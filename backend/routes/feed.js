const router = require('express').Router();
const axios = require('axios');
const { auth } = require('../middleware/auth');
const SavedFeed = require('../models/SavedFeed');

// Twitter API
router.get('/twitter', auth, async (req, res) => {
  try {
    // Note: In production, use Twitter API v2 with proper authentication
    const response = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
      params: { query: 'creators OR content', max_results: 10 },
      headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` }
    });
    res.json(response.data.data.map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      source: 'twitter',
      url: `https://twitter.com/i/web/status/${tweet.id}`
    })));
  } catch (err) {
    console.error('Twitter API error:', err);
    // Fallback mock data
    res.json([
      {
        id: '1',
        text: 'Example tweet about content creation #creators',
        source: 'twitter',
        url: 'https://twitter.com/i/web/status/1'
      }
    ]);
  }
});

// Reddit API
router.get('/reddit', auth, async (req, res) => {
  try {
    const response = await axios.get('https://www.reddit.com/r/contentcreation.json?limit=10');
    res.json(response.data.data.children.map(post => ({
      id: post.data.id,
      title: post.data.title,
      text: post.data.selftext,
      source: 'reddit',
      url: `https://reddit.com${post.data.permalink}`
    })));
  } catch (err) {
    console.error('Reddit API error:', err);
    // Fallback mock data
    res.json([
      {
        id: '1',
        title: 'Example Reddit post',
        text: 'Discussion about content creation strategies',
        source: 'reddit',
        url: 'https://reddit.com/r/contentcreation/1'
      }
    ]);
  }
});
// Add this new route to fetch specific Reddit post
router.get('/reddit/post/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://www.reddit.com/r/contentcreation/comments/${id}.json`);
    
    const postData = response.data[0].data.children[0].data;
    const comments = response.data[1].data.children.map(c => c.data);
    
    res.json({
      id: postData.id,
      title: postData.title,
      author: postData.author,
      text: postData.selftext,
      url: `https://reddit.com${postData.permalink}`,
      upvotes: postData.ups,
      comments: comments.slice(0, 5), // Get first 5 comments
      created: new Date(postData.created_utc * 1000),
      source: 'reddit'
    });
  } catch (err) {
    console.error('Reddit post fetch error:', err);
    res.status(500).json({ 
      message: 'Error fetching Reddit post',
      error: err.message 
    });
  }
});

// Save feed item
router.post('/save', auth, async (req, res) => {
  try {
    const { itemId, source, title, url } = req.body;
    const savedItem = await SavedFeed.findOneAndUpdate(
      { userId: req.user.id, itemId, source },
      { $set: { title, url, savedAt: new Date() } },
      { upsert: true, new: true }
    );
    res.json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get saved feeds
router.get('/saved', auth, async (req, res) => {
  try {
    const savedFeeds = await SavedFeed.find({ userId: req.user.id }).sort({ savedAt: -1 });
    res.json(savedFeeds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;