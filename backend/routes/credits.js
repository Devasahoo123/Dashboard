const router = require('express').Router();
const { auth, admin } = require('../middleware/auth');
const Credit = require('../models/Credit');

// Get user credits
// credits.js - Add more descriptive errors
router.get('/', auth, async (req, res) => {
  try {
    const credit = await Credit.findOne({ userId: req.user.id });
    if (!credit) {
      // Create a new credit record if none exists
      const newCredit = new Credit({ userId: req.user.id, balance: 0 });
      await newCredit.save();
      return res.json(newCredit);
    }
    res.json(credit);
  } catch (err) {
    res.status(500).json({ 
      message: 'Server error',
      error: err.message 
    });
  }
});

// Admin: Get all credits
router.get('/all', auth, admin, async (req, res) => {
  try {
    const credits = await Credit.find().populate('userId');
    res.json(credits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add credits (admin only)
// Change from admin-only to allow users to add their own credits
router.post('/add', auth, async (req, res) => {
  try {
    // Ensure user can only add to their own account
    const userId = req.body.userId || req.user.id;
    
    if (userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify this account' });
    }

    let credit = await Credit.findOne({ userId });
    
    if (!credit) {
      credit = new Credit({ userId, balance: req.body.amount });
      credit.transactions.push({ 
        amount: req.body.amount, 
        reason: req.body.reason 
      });
      await credit.save();
      return res.json(credit);
    }

    credit.balance += req.body.amount;
    credit.transactions.push({ 
      amount: req.body.amount, 
      reason: req.body.reason 
    });
    await credit.save();
    
    res.json(credit);
  } catch (err) {
    console.error('Credit add error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;