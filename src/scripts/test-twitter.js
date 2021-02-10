const Twitter = require('twitter-lite')
require('dotenv').config()
const log4js = require('log4js')

const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET_KEY,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCES_TOKEN_SECRET
})

async function tweetThread (thread) {
  let lastTweetID = ''
  for (const status of thread) {
    const tweet = await client.post('statuses/update', {
      status: status,
      in_reply_to_status_id: lastTweetID,
      auto_populate_reply_metadata: true
    })
    lastTweetID = tweet.id_str
  }
}

const thread = ['First tweet', 'Second tweet', 'Third tweet']
tweetThread(thread).catch(console.error)
