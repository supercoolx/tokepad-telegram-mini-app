const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const BoostItem = require('../models/Item');

const { createInvoiceLink } = require('../helper/botHelper');

//boost
const useBoost = async (req, res) => {
  const { userid, boostid } = req.body;
  var user = await User.findOne({ userid }).populate('boosts.item');
  if(!user) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'Not found user!'});
  }

  const boost = user.boosts.find(b => b.item.boostid == boostid);
  if (!boost || boost.usesRemaining <= 0) {
    return res.status(StatusCodes.OK).json({success: false, status: 'noboostitem', msg: 'Not found boost item!'});
  }

  boost.usesRemaining -= 1;
  if (boost.usesRemaining === 0) {
    user.boosts = user.boosts.filter(b => b.item.boostid != boostid);
  }
  await user.save();
  
  return res.status(StatusCodes.OK).json({success: true, msg: 'Use boost successfully!'});
}
const getAllBoost = async (req, res) => {
  const boosts = await BoostItem.find({});
  return res.status(StatusCodes.OK).json({boosts});
}
const addBoost = async (req, res) => {
  const { boostid, title, description, logo, maxUses, price, bonus } = req.body;
  const boostItem = await BoostItem.findOne({boostid});
  if(boostItem) {
    return res.status(StatusCodes.OK).json({success: false, status: 'exist', msg: 'Boost name already exist!'});
  }
  await BoostItem.create({
    boostid,
    title,
    description,
    logo,
    maxUses,
    price,
    bonus
  });
  return res.status(StatusCodes.OK).json({status: true, msg: 'Boost add success!'});
}
const getMyBoost = async (req, res) => {
  const { userid } = req.params;
  const user = await User.findOne({ userid }).populate('boosts.item');
  if(!user) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'Not found user!'});
  }

  const result = await User.aggregate([
    { $match: { 'boosts.item': { $ne: null } } }, // Filter users with boosts
    { $unwind: '$boosts' }, // Deconstruct boosts array
    {
      $lookup: {
        from: 'boostitems', // The collection name for BoostItem
        localField: 'boosts.item',
        foreignField: '_id',
        as: 'boostDetails'
      }
    },
    { $unwind: '$boostDetails' }, // Deconstruct boostDetails array
    {
      $group: {
        _id: null,
        totalUsers: { $addToSet: '$userid' }, // Unique user IDs
        totalPrice: { $sum: '$boostDetails.price' } // Sum of prices
      }
    },
    {
      $project: {
        totalUsersCount: { $size: '$totalUsers' },
        totalBoostsPrice: '$totalPrice'
      }
    }
  ]);
  const total = {
    usersCount: result.length > 0 ? result[0].totalUsersCount.toString() : 0,
    price: result.length > 0 ? result[0].totalBoostsPrice.toString() : 0
  }

  const currentTime = new Date();
  for (const boost of user.boosts) {
    if (currentTime < boost.endTime) {
      return res.status(StatusCodes.OK).json({success: true, boost, total});
    }
  }
  return res.status(StatusCodes.OK).json({success: false, status: 'noboost', total, msg: 'You did not buy boost!'});
}
const getTotalBoostHistory = async (req, res) => {
  const result = await BoostStarPaymentHistory.aggregate([
    {
      $lookup: {
        from: 'boostitems', // The name of the BoostItem collection
        localField: 'boostItem',
        foreignField: '_id',
        as: 'boostDetails',
      },
    },
    {
      $unwind: '$boostDetails', // Unwind to access boost details
    },
    {
      $group: {
        _id: null,
        totalUniqueUsers: { $addToSet: '$user' }, // Collect unique users
        totalPrice: { $sum: { $multiply: ['$quantity', '$boostDetails.price'] } }, // Calculate total price
      },
    },
    {
      $project: {
        _id: 0,
        totalUniqueUsers: { $size: '$totalUniqueUsers' }, // Count unique users
        totalPrice: 1, // Include total price
      },
    },
  ]);
  return res.status(StatusCodes.OK).json({success: true, result});
}
//star invoice
const generateInvoice = async(req, res) => {
  const {userid, id} = req.body;
  var user = await User.findOne({ userid });
  if(!user) {
    return res.status(StatusCodes.OK).json({success: false, status: 'nouser', msg: 'There is no user!'});
  }
  const boost = await BoostItem.findById(id);
  if(!boost) {
    return res.status(StatusCodes.OK).json({success: false, status: 'noboost', msg: 'There is no boost item!'});
  }

  const paylog = { userid: user._id, boostid: boost._id };
  const invoiceLink = await createInvoiceLink(boost.title, boost.description, JSON.stringify(paylog), boost.price);
  console.log("invoiceLink=", invoiceLink);
  return res.status(StatusCodes.OK).json({success: true, link: invoiceLink});
}

module.exports = {
    getAllBoost,
    getMyBoost,
    addBoost,
    getTotalBoostHistory,

    generateInvoice,
};
