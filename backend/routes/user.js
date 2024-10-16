const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
    getUser,
    getAllFriends,
    getLeaderboard,
    getAllUserCount,

    getAvatarImage,
    updateUserByTap,
    growUp,

    purchaseBoost,
    getAllBoost,
    addBoost,
    getMyBoost,

} = require('../controllers/userController');

router.get('/get/:userid', authenticateUser, getUser);
router.get('/friends/:userid', authenticateUser, getAllFriends);
router.get('/ranking/:userid/:type', authenticateUser, getLeaderboard);
router.get('/count/all', authenticateUser, getAllUserCount);


router.put('/tap', authenticateUser, updateUserByTap);
router.put('/growUp',authenticateUser, growUp);
router.get('/avatar/:userid', getAvatarImage);

router.post('/boost/purchase', purchaseBoost);
router.get('/boost/getall', authenticateUser, getAllBoost);
router.post('/boost/add', authenticateUser, addBoost);
router.get('/boost/getmy/:userid', authenticateUser, getMyBoost);

module.exports = router;
