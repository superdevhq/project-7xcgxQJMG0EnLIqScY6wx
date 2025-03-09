
// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle OPTIONS request for CORS
Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    })
  }

  try {
    // Get the request body
    const { keywords = [], subreddits = [], limit = 25 } = await req.json()

    // Validate input
    if ((!keywords || keywords.length === 0) && (!subreddits || subreddits.length === 0)) {
      return new Response(
        JSON.stringify({ error: 'At least one keyword or subreddit is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Get Apify API token from environment variables
    const apifyApiToken = Deno.env.get('APIFY_API_TOKEN')
    if (!apifyApiToken) {
      throw new Error('APIFY_API_TOKEN is not set')
    }

    // Prepare the input for trudax/reddit-scraper-lite
    const apifyInput = {
      startUrls: [],
      searches: [],
      maxItems: limit,
      proxy: {
        useApifyProxy: true
      }
    }

    // Build searches or startUrls based on subreddits and keywords
    if (subreddits && subreddits.length > 0) {
      for (const subreddit of subreddits) {
        if (keywords && keywords.length > 0) {
          for (const keyword of keywords) {
            // Add search for this subreddit and keyword
            apifyInput.searches.push({
              subreddit: subreddit,
              term: keyword
            })
          }
        } else {
          // Just add the subreddit URL
          apifyInput.startUrls.push({
            url: `https://www.reddit.com/r/${subreddit}`
          })
        }
      }
    } else if (keywords && keywords.length > 0) {
      for (const keyword of keywords) {
        // Search all of Reddit for this keyword
        apifyInput.searches.push({
          term: keyword
        })
      }
    }

    // Start the Apify actor for Reddit scraper
    // Using trudax/reddit-scraper-lite
    const startActorResponse = await fetch('https://api.apify.com/v2/acts/trudax~reddit-scraper-lite/runs?token=' + apifyApiToken, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        input: apifyInput,
        timeout: 120 // 2 minute timeout
      }),
    })

    if (!startActorResponse.ok) {
      const errorText = await startActorResponse.text()
      throw new Error(`Failed to start Apify actor: ${startActorResponse.status} ${startActorResponse.statusText} - ${errorText}`)
    }

    const startActorData = await startActorResponse.json()
    const runId = startActorData.data.id

    // Wait for the actor to finish (with timeout)
    let actorFinished = false
    let attempts = 0
    const maxAttempts = 60 // Maximum 60 attempts (60 seconds)
    let actorData

    while (!actorFinished && attempts < maxAttempts) {
      // Wait 1 second between checks
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check actor status
      const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${apifyApiToken}`)
      
      if (!statusResponse.ok) {
        throw new Error(`Failed to check actor status: ${statusResponse.status} ${statusResponse.statusText}`)
      }
      
      actorData = await statusResponse.json()
      
      if (actorData.data.status === 'SUCCEEDED' || actorData.data.status === 'FAILED' || actorData.data.status === 'TIMED-OUT' || actorData.data.status === 'ABORTED') {
        actorFinished = true
      }
      
      attempts++
    }

    if (!actorFinished) {
      throw new Error('Apify actor timed out')
    }

    if (actorData.data.status !== 'SUCCEEDED') {
      throw new Error(`Apify actor failed with status: ${actorData.data.status}`)
    }

    // Get the dataset items
    const datasetId = actorData.data.defaultDatasetId
    const datasetResponse = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyApiToken}`)
    
    if (!datasetResponse.ok) {
      throw new Error(`Failed to get dataset: ${datasetResponse.status} ${datasetResponse.statusText}`)
    }
    
    const redditPosts = await datasetResponse.json()

    // Transform Apify data to our format
    // trudax/reddit-scraper-lite has a different output format
    const posts = redditPosts.map(post => ({
      id: post.id || Math.random().toString(36).substring(2, 15),
      title: post.title || 'No title',
      author: post.author || 'Unknown',
      subreddit: post.subreddit || 'Unknown',
      upvotes: post.upvotes || 0,
      commentCount: post.numComments || 0,
      createdAt: post.created ? new Date(post.created).toISOString() : new Date().toISOString(),
      url: post.postUrl || `https://www.reddit.com${post.permalink || ''}`,
      thumbnail: post.thumbnail && post.thumbnail.startsWith('http') ? post.thumbnail : undefined,
      selftext: post.text || ''
    }))

    // Return the results
    return new Response(
      JSON.stringify({ 
        success: true, 
        count: posts.length,
        posts: posts 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in Apify Reddit scraper:', error)
    
    // Handle errors
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
