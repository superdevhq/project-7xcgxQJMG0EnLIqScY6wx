
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

    // Build search queries
    let results = []
    
    // If subreddits are provided, search within those subreddits
    if (subreddits && subreddits.length > 0) {
      for (const subreddit of subreddits) {
        // If keywords are provided, search for posts containing those keywords
        if (keywords && keywords.length > 0) {
          for (const keyword of keywords) {
            const subredditPosts = await fetchRedditPosts(subreddit, keyword, limit)
            results = [...results, ...subredditPosts]
          }
        } else {
          // If no keywords, just get recent posts from the subreddit
          const subredditPosts = await fetchRedditPosts(subreddit, '', limit)
          results = [...results, ...subredditPosts]
        }
      }
    } else if (keywords && keywords.length > 0) {
      // If only keywords are provided, search across all of Reddit
      for (const keyword of keywords) {
        const keywordPosts = await fetchRedditPosts('all', keyword, limit)
        results = [...results, ...keywordPosts]
      }
    }

    // Remove duplicates based on post ID
    const uniqueResults = Array.from(
      new Map(results.map(post => [post.id, post])).values()
    )

    // Return the results
    return new Response(
      JSON.stringify({ 
        success: true, 
        count: uniqueResults.length,
        posts: uniqueResults 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
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

/**
 * Fetch Reddit posts from a subreddit
 */
async function fetchRedditPosts(subreddit, query, limit) {
  try {
    // Build the URL
    let url = `https://www.reddit.com/r/${subreddit}`
    
    if (query) {
      // If there's a search query, use the search endpoint
      url += `/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&limit=${limit}`
    } else {
      // Otherwise, just get the subreddit's posts
      url += `/hot.json?limit=${limit}`
    }
    
    // Add timestamp to avoid caching
    url += `&t=${Date.now()}`
    
    // Fetch the data
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'web:reddit-scraper:v1.0 (by /u/anonymous)'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from Reddit: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Transform the data
    const posts = data.data.children.map((child) => {
      const post = child.data
      return {
        id: post.id,
        title: post.title,
        author: post.author,
        subreddit: post.subreddit,
        upvotes: post.ups,
        commentCount: post.num_comments,
        createdAt: new Date(post.created_utc * 1000).toISOString(),
        url: `https://www.reddit.com${post.permalink}`,
        thumbnail: post.thumbnail && post.thumbnail.startsWith('http') ? post.thumbnail : undefined,
        selftext: post.selftext
      }
    })
    
    return posts
  } catch (error) {
    console.error(`Error fetching from r/${subreddit}:`, error)
    return []
  }
}
