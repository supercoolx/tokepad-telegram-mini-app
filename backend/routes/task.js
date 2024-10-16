const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const {
    connectWallet,
    joinTelegram,
    followX,
    retweet,
    subscribe_youtube,
    follow_instagram,
    visit_website,
    visit_opensea,
    follow_task_do,
    claimDailyReward,
} = require('../controllers/taskController');

router.post('/connect_wallet', authenticateUser, connectWallet);
router.post('/jointg', authenticateUser, joinTelegram);
router.post('/followX', authenticateUser, followX);
router.post('/tweet', authenticateUser, retweet);
router.post('/subscribe_youtube', authenticateUser, subscribe_youtube);
router.post('/instagram', authenticateUser, follow_instagram);
router.post('/visit_website', authenticateUser, visit_website);
router.post('/visit_opensea', authenticateUser, visit_opensea);
router.post('/follow', authenticateUser, follow_task_do);
router.post('/claim/daily', authenticateUser, claimDailyReward);

module.exports = router;