document.getElementById('tweet-form').addEventListener('submit', function(e) {
    e.preventDefault();
    fetchTweet();
});

async function fetchTweet() {
    const tweetUrl = document.getElementById('tweet-url').value;
    const tweetId = extractTweetId(tweetUrl);
    if (!tweetId) {
        alert('Invalid tweet URL');
        return;
    }

    const tweetContent = await getTweetContent(tweetId);
    if (tweetContent) {
        document.getElementById('tweet-content').textContent = tweetContent;
        document.getElementById('tweet-container').classList.remove('hidden');
        postToWarpcast(tweetContent);
    } else {
        alert('Failed to fetch tweet');
    }
}

function extractTweetId(url) {
    const match = url.match(/status\/(\d+)/);
    return match ? match[1] : null;
}

async function getTweetContent(tweetId) {
    const apiKey = 'YOUR_TWITTER_BEARER_TOKEN'; // Replace with your Twitter API Bearer Token
    const url = `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=text`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const data = await response.json();
        return data.data ? data.data.text : null;
    } catch (error) {
        console.error('Error fetching tweet:', error);
        return null;
    }
}

function postToWarpcast(tweetContent) {
    const postData = {
        content: tweetContent
    };

    fetch('https://warpcast-api-url', { // Replace with actual Warpcast API URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
