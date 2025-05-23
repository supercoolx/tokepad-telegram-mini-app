const fs = require('fs');
const path = require('path');

const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const Item = require('../models/Item');
const History = require('../models/TonPaymentHistory');

const logger = require('../helper/logger');
const { LEADERBOARD_SHOW_USER_COUNT } = require('../helper/constants');

const { verifyTransaction } = require('../helper/transaction');

const getUser = async (req, res) => {
  const { userid } = req.params;
  const user = await User.findOne({ userid });
  await user.updateEnergy();
  await user.updatePoint();
  res.status(StatusCodes.OK).json(user);
}

const getAllFriends = async (req, res) => {
  const { userid } = req.params;
  if (!userid) {
    logger.error(`cannot find userid=${userid}`);
    return res.status(StatusCodes.OK).json({});
  }
  const user = await User.findOne({ userid }).populate('friends').select('friends');

  res.status(StatusCodes.OK).json(user);
};

const getAllUserCount = async (req, res) => {
  const userCount = await User.countDocuments();
  res.status(StatusCodes.OK).json({ count: userCount });
};

const getAvatarImage = (req, res) => {
  const { userid } = req.params;
  const url = path.join(__dirname, '..', 'uploads/avatars', userid + '.jpg');
  const isExist = fs.existsSync(url);
  if (isExist) {
    res.sendFile(url);
  }
  else res.sendFile(path.join(__dirname, '..', 'uploads/avatars', 'default.png'));
}

const getLeaderboard = async (req, res) => {
  try {
    const { userid, type } = req.params;
    var users = [];
    const self = await User.findOne({ userid }).select('-password');
    var rank = -1;
    if (type == "week") {
      users = await User.find({}).sort({ weeklyScore: -1 }).limit(LEADERBOARD_SHOW_USER_COUNT).select('-password');
      rank = await User.countDocuments({ weeklyScore: { $gt: self.weeklyScore } });
    } else if (type == "month") {
      users = await User.find({}).sort({ monthlyScore: -1 }).limit(LEADERBOARD_SHOW_USER_COUNT).select('-password');
      rank = await User.countDocuments({ monthlyScore: { $gt: self.monthlyScore } });
    } else if (type == "total") {
      users = await User.find({}).sort({ totalScore: -1 }).limit(LEADERBOARD_SHOW_USER_COUNT).select('-password');
      rank = await User.countDocuments({ totalScore: { $gt: self.totalScore } });
    }
    return res.status(StatusCodes.OK).json({ users, rank: rank + 1, self });

  } catch (error) {
    console.log("getLeaderboard error=", error);
  }
}

const updateUserByTap = async (req, res) => {
  const { userid } = req.body;
  var user = await User.findOne({ userid }).select('-password');
  if (!user) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'Not found user!' });
  }
  if (user.energy < user.loseEnergyPerTap) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'noenergy', msg: 'There is no energy!' });
  }

  user.addPoint(user.earnPerTap);
  user.energy -= user.loseEnergyPerTap;
  if (user.energy < 0) {
    user.energy = 0;
  }
  await user.save();

  return res.status(StatusCodes.OK).json({ success: true, point: user.point, energy: user.energy });
}

const growUp = async (req, res) => {
  const { userid } = req.body;
  var user = await User.findOne({ userid }).select('-password');
  if (!user) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'Not found user!' });
  }

  if (user.energy < user.maxEnergy) {
    const addValue = await user.calcEnergyInc();
    user.energy += addValue;
    user.lastEnergyUpdate = Date.now();
  }
  await user.save();

  return res.status(StatusCodes.OK).json({ success: true, energy: user.energy });
}

const purchaseBoost = async (req, res) => {
  const { userid, boostid, tx } = req.body;
  const user = await User.findOne({ userid });
  if (!user) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'Not found user!' });
  }
  const boostItem = await Item.findById(boostid);
  if (!boostItem) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'noboostitem', msg: 'Not found boost item!' });
  }

  const result = await verifyTransaction(tx, boostItem.price);
  console.log('Verify result:', result);
  if (!result.success) return res.status(StatusCodes.OK).json(result);
  
  user.boosts.push({ item: boostItem._id });
  await user.save();

  res.status(StatusCodes.OK).json({ success: true, boost: boostItem, msg: 'You are boosted!' });

  const history = new History({
    user: user._id,
    boostItem: boostItem._id,
    quantity,
    hash: result.hash,
    from: result.from,
    to: result.to,
    amount: result.amount
  });
  history.save();
}

const getAllBoost = async (req, res) => {
  const boosts = await Item.find({});
  return res.status(StatusCodes.OK).json({ boosts });
}

const addBoost = async (req, res) => {
  const { userid, name, title, period, price } = req.body;
  const boostItem = await Item.findOne({ name });
  if (boostItem) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'exist', msg: 'Boost name already exist!' });
  }
  await Item.create({
    name,
    title,
    period,
    price
  });
  return res.status(StatusCodes.OK).json({ status: true, msg: 'Boost add success!' });
}

const getMyBoost = async (req, res) => {
  const { userid } = req.params;
  const user = await User.findOne({ userid }).populate('boosts.item');
  if (!user) {
    return res.status(StatusCodes.OK).json({ success: false, status: 'nouser', msg: 'Not found user!' });
  }

  const boosts = user.boosts;
  return res.status(StatusCodes.OK).json({ success: true, boosts });
}
module.exports = {
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
};
