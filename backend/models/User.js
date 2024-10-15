const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../helper/logger');


const UserSchema = new mongoose.Schema({
  userid: { type: String, unique: true, required: [true, 'Please provide telegram id'] },
  username: { type: String, default: '' },
  firstname: { type: String, default: '' },
  lastname: { type: String, default: '' },
  inviter: { type: String, default: '' },
  isPremium: { type: Boolean, default: false },
  walletConnected: { type: Boolean, default: false },
  visitWebSite: { type: Boolean, default: false },
  telegramChannelJoined: { type: Boolean, default: false },
  telegramGroupJoined: { type: Boolean, default: false },
  xFollowed: { type: Boolean, default: false },
  xTweet: { type: Boolean, default: false },
  
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  
  token: { type: Number, default: 0 },
  point: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  weeklyScore: { type: Number, default: 0 },
  monthlyScore: { type: Number, default: 0 },
  
  energy: { type: Number, default: 1000 },
  maxEnergy: { type: Number, default: 1000 },
  loseEnergyPerTap: { type: Number, default: 10 },
  addEnergyPerSecond: { type: Number, default: 1 },
  lastEnergyUpdate: { type: Date, default: Date.now },
  earnPerTap: { type: Number, default: 1 },

  lastRewardDate: { type: Date },
  rewardStreak: { type: Number, default: 0 },

  boosts: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    endTime: { type: Date, default: Date.now },
  }],
});

// Method to update energy based on elapsed time since last update
UserSchema.methods.updateEnergy = async function() {
  const now = Date.now();
  const secondsElapsed = Math.floor((now - this.lastEnergyUpdate) / 1000);
  
  if (secondsElapsed > 0) {
    var addValue = await this.calcEnergyInc();
    const energyGain = addValue * secondsElapsed;
    this.energy = Math.min(this.energy + energyGain, this.maxEnergy);
    this.lastEnergyUpdate = now;
    return this.save(); // Save the changes to the database
  }
  return Promise.resolve(); // No time has elapsed
};

// Calc add energy per second
UserSchema.methods.calcEnergyInc = async function() {
  var value = this.addEnergyPerSecond;
  const currentTime = new Date();
  for (const boost of this.boosts) {
    if (currentTime < boost.endTime) {
      return value * 2;
    }
  }
  return value;
};

// Method to add point with totalScore, weeklyScore, monthlyScore
UserSchema.methods.addPoint = async function(value) {
  this.point += value;
  this.totalScore += value;
  this.weeklyScore += value;
  this.monthlyScore += value;

  return this;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
