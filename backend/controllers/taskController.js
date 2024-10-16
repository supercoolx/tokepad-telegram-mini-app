const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const Follow = require('../models/Follow');

const { BONUS, TELEGRAM } = require('../helper/constants');
const { isUserTGJoined } = require('../helper/botHelper');

module.exports.joinTelegram = async (req, res) => {
    const { userid, type } = req.body;
    var user = await User.findOne({ userid });
    if (user) {
        const isDBTGJoined = type == 'channel' ? user.telegramChannelJoined : user.telegramGroupJoined;
        if (isDBTGJoined) {
            return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Already received!' });
        }
        const isTGJoined = await isUserTGJoined(userid, type == 'channel' ? TELEGRAM.CHANNEL_ID : TELEGRAM.GROUP_ID);
        if (!isTGJoined) {
            return res.status(StatusCodes.OK).json({ success: false, status: 'notyet', msg: `Not joined telegram ${type} yet!` });
        }
        var bonus = 0;
        if (type == 'channel') {
            bonus = BONUS.JOIN_TG_CHANNEL;
            user.telegramChannelJoined = true;
        } else {
            bonus = BONUS.JOIN_TG_GROUP;
            user.telegramGroupJoined = true;
        }
        user.addPoint(bonus);

        await user.save();
        return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'Received telegram joined bonus.', point: user.point, bonus: bonus });
    }
    return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'There is no userid!' });
};

module.exports.followX = async (req, res) => {
    const { userid, username } = req.body;
    if (!username || username == '') {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nousername', msg: 'Please input username!' });
    }
    var user = await User.findOne({ userid });
    if (!user) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'There is no userid!' });
    }

    if (user.xFollowed) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Already received!' });
    }

    var follow = await Follow.findOne({ userid, platform: 'X' });
    if (!follow) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nofollow', msg: 'Not follow yet!' });
    }
    follow.username = username;
    await follow.save();

    user.xFollowed = true;
    user.addPoint(BONUS.FOLLOW_X_ACCOUNT);

    await user.save();
    return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'Received follow X bonus.', point: user.point, bonus: BONUS.FOLLOW_X_ACCOUNT });
};

module.exports.retweet = async (req, res) => {
    const { userid, username } = req.body;

    if (!username || username == '') {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nousername', msg: 'Please input username!' });
    }

    var user = await User.findOne({ userid });
    if (!user) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'There is no userid!' });
    }
    if (user.xTweet) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Already received!' });
    }

    var follow = await Follow.findOne({ userid, platform: 'Tweet' });
    if (!follow) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nofollow', msg: 'Not tweet @Point yet!' });
    }
    follow.username = username;
    await follow.save();

    user.xTweet = true;
    user.addPoint(BONUS.RETWEET_POST);

    await user.save();
    return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'Received visit website bonus.', point: user.point, bonus: BONUS.RETWEET_POST });
};

module.exports.subscribe_youtube = async (req, res) => {
    const { userid, username } = req.body;

    if (!username || username == '') {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nousername', msg: 'Please input username!' });
    }

    var user = await User.findOne({ userid });
    if (!user) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'There is no userid!' });
    }

    if (user.youtubeSubscribed) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Already received!' });
    }

    var follow = await Follow.findOne({ userid, platform: 'YouTube' });
    if (!follow) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nofollow', msg: 'Not subscribe yet!' });
    }
    follow.username = username;
    await follow.save();

    user.youtubeSubscribed = true;
    user.addPoint(BONUS.SUBSCRIBE_YOUTUBE);

    await user.save();
    return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'Received subscribe youtube bonus.', point: user.point, bonus: BONUS.SUBSCRIBE_YOUTUBE });
};

module.exports.follow_instagram = async (req, res) => {
    const { userid, username } = req.body;

    if (!username || username == '') {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nousername', msg: 'Please input username!' });
    }

    var user = await User.findOne({ userid });
    if (!user) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'There is no userid!' });
    }

    if (user.instagramFollowed) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Already received!' });
    }

    var follow = await Follow.findOne({ userid, platform: 'Instagram' });
    if (!follow) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nofollow', msg: 'Not followed yet!' });
    }
    follow.username = username;
    await follow.save();

    user.instagramFollowed = true;
    user.addPoint(BONUS.FOLLOW_INSTAGRM);

    await user.save();
    return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'Received instagram follow bonus.', point: user.point, bonus: BONUS.FOLLOW_INSTAGRM });
};

module.exports.visit_website = async (req, res) => {
    const { userid } = req.body;
    const username = "test";

    if (!username || username == '') {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nousername', msg: 'Please input username!' });
    }

    var user = await User.findOne({ userid });
    if (!user) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'There is no userid!' });
    }
    if (user.visitWebSite) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Already received!' });
    }

    var follow = await Follow.findOne({ userid, platform: 'Site' });
    if (!follow) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nofollow', msg: 'Not visited yet!' });
    }
    follow.username = username;
    await follow.save();

    user.visitWebSite = true;
    user.addPoint(BONUS.VISIT_WEBSITE);

    await user.save();
    return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'Received visit website bonus.', point: user.point, bonus: BONUS.VISIT_WEBSITE });
};

module.exports.visit_opensea = async (req, res) => {
    const { userid } = req.body;
    const username = "test";

    if (!username || username == '') {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nousername', msg: 'Please input username!' });
    }

    var user = await User.findOne({ userid });
    if (!user) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'There is no userid!' });
    }
    if (user.visitOpensea) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Already received!' });
    }

    var follow = await Follow.findOne({ userid, platform: 'Opensea' });
    if (!follow) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'nofollow', msg: 'Not visited yet!' });
    }
    follow.username = username;
    await follow.save();

    user.visitOpensea = true;
    user.addPoint(BONUS.VISIT_OPENSEA);

    await user.save();
    return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'Received visit opensea bonus.', point: user.point, bonus: BONUS.VISIT_OPENSEA });
};

module.exports.follow_task_do = async (req, res) => {
    const { userid, platform } = req.body;

    var follow = await Follow.findOne({ userid, platform });
    if (follow) {
        return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Already done!' });
    }
    follow = await Follow.create({
        userid,
        platform
    });
    return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'Task completed!' });
};

module.exports.claimDailyReward = async (req, res) => {
    const oneDay = 24 * 60 * 60 * 1000;
    try {
        const { userid } = req.body;
        const user = await User.findOne({ userid });

        if (!user) {
            return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'Can not find user!' });
        }

        const now = new Date();
        const lastRewardDate = user.lastRewardDate || new Date(0);

        const timeSinceLastReward = now - lastRewardDate;

        const isConsecutiveDay = timeSinceLastReward < 2 * oneDay;
        user.rewardStreak = isConsecutiveDay ? (user.rewardStreak + 1) : 1;
        const reward = BONUS.DAILY_REWARD * user.rewardStreak;

        var status = 'notyet';
        if (timeSinceLastReward >= oneDay) {
            user.addPoint(reward);
            user.lastRewardDate = now;
            if (req.body.status == 1) {
                await user.save();
                status = 'success';
                console.log('Daily reward claimed successfully');
            }

            return res.status(StatusCodes.OK).json({
                success: true,
                status,
                reward,
                ms: req.body.status == 1 ? oneDay : 0,
            });
        } else {
            const ms = oneDay - timeSinceLastReward;
            return res.status(StatusCodes.OK).json({ success: true, ms, status, reward });
        }
    } catch (error) {
        console.error('Error claiming daily reward:', error);
        return res.status(StatusCodes.OK).json({ success: false, status: 'error', msg: 'Server unknown error!' });
    }
};


module.exports.connectWallet = async (req, res) => {
    const { userid } = req.body;
    var user = await User.findOne({ userid });
    if (user) {
        if (user.walletConnected) {
            return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Already received!' });
        }
        user.walletConnected = true;
        const bonus = BONUS.WALLET_CONNECT;
        user.addPoint(bonus);

        await user.save();
        return res.status(StatusCodes.OK).json({ success: true, status: 'success', msg: 'Received wallet connect bonus.', point: user.point, bonus: bonus });
    }
    return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'There is no userid!' });
}  