require('dotenv').config()

const TWITTER_API_ENDPOINT = 'https://api.twitter.com'

async function getOAuth2Token() {
    const endpoint = `${TWITTER_API_ENDPOINT}/oauth2/token?grant_type=client_credentials`

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.TWITTER_KEY}:${process.env.TWITTER_SECRET}`).toString('base64')}`,
        },
    })

    const data = await response.json()
    return data.access_token
}

async function searchTweets(token, query) {
    const endpoint = `${TWITTER_API_ENDPOINT}/2/tweets/search/recent?query=${query}%20-is:retweet%20lang:en&tweet.fields=text,created_at&user.fields=username,profile_image_url&expansions=author_id&max_results=100`

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if(response.status != 200) {
        return {
            success: false,
            error: response.status,
        }
    }

    let data = await response.json()
    data.success = true
    return data
}

export { getOAuth2Token, searchTweets }
