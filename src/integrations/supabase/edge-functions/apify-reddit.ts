
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

    // Prepare the input for Apify Reddit Scraper
    const apifyInput = {
      startUrls: []
    }

    // Build start URLs based on subreddits and keywords
    if (subreddits && subreddits.length > 0) {
      for (const subreddit of subreddits) {
        if (keywords && keywords.length > 0) {
          for (const keyword of keywords) {
            // Add search URL for this subreddit and keyword
            apifyInput.startUrls.push({
              url: `https://www.reddit.com/r/${subreddit}/search/?q=${encodeURIComponent(keyword)}&restrict_sr=1`
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
        apifyInput.startUrls.push({
          url: `https://www.reddit.com/search/?q=${encodeURIComponent(keyword)}`
        })
      }
    }

    // Set additional options for the scraper
    apifyInput.maxItems = limit
    apifyInput.maxPostCount = limit
    apifyInput.maxComments = 0 // We don't need comments for this implementation

    // Start the Apify task for Reddit scraper
    const startTaskResponse = await fetch('https://api.apify.com/v2/actor-tasks/reGe2T7rBgKF3NbJW/runs?token=' + apifyApiToken, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: apifyInput }),
    })

    if (!startTaskResponse.ok) {
      const errorText = await startTaskResponse.text()
      throw new Error(`Failed to start Apify task: ${startTaskResponse.status} ${startTaskResponse.statusText} - ${errorText}`)
    }

    const startTaskData = await startTaskResponse.json()
    const runId = startTaskData.data.id

    // Wait for the task to finish (with timeout)
    let taskFinished = false
    let attempts = 0
    const maxAttempts = 30 // Maximum 30 attempts (30 seconds)
    let taskData

    while (!taskFinished && attempts < maxAttempts) {
      // Wait 1 second between checks
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check task status
      const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${apifyApiToken}`)
      
      if (!statusResponse.ok) {
        throw new Error(`Failed to check task status: ${statusResponse.status} ${statusResponse.statusText}`)
      }
      
      taskData = await statusResponse.json()
      
      if (taskData.data.status === 'SUCCEEDED' || taskData.data.status === 'FAILED' || taskData.data.status === 'TIMED-OUT') {
        taskFinished = true
      }
      
      attempts++
    }

    if (!taskFinished) {
      throw new Error('Apify task timed out')
    }

    if (taskData.data.status !== 'SUCCEEDED') {
      throw new Error(`Apify task failed with status: ${taskData.data.status}`)
    }

    // Get the dataset items
    const datasetId = taskData.data.defaultDatasetId
    const datasetResponse = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyApiToken}`)
    
    if (!datasetResponse.ok) {
      throw new Error(`Failed to get dataset: ${datasetResponse.status} ${datasetResponse.statusText}`)
    }
    
    const redditPosts = await datasetResponse.json()

    // Transform Apify data to our format
    const posts = redditPosts.map(post => ({
      id: post.id || Math.random().toString(36).substring(2, 15),
      title: post.title || 'No title',
      author: post.author || 'Unknown',
      subreddit: post.subreddit || 'Unknown',
      upvotes: post.score || 0,
      commentCount: post.numComments || 0,
      createdAt: post.created ? new Date(post.created).toISOString() : new Date().toISOString(),
      url: post.url || `https://www.reddit.com/r/${post.subreddit}/comments/${post.id}/`,
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
