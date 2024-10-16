const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { createJWT } = require('../helper/jwt');
const logger = require('../helper/logger');
const { BONUS } = require('../helper/constants');

const register = async (userid, username, firstname, lastname, is_premium, inviter) => {
  logger.info(`User register: userid=${userid}, username=${username}, firstname=${firstname}, lastname=${lastname}, inviter=${inviter}, premium=${is_premium}`);

  if (!userid) {
    logger.error('Authlogin not found userid');
    return {success: false, msg: 'failed'};
  }

  var user = await User.findOne({ userid });
  if (!user) {
    user = await User.create({
      userid,
      username,
      firstname, lastname,
      isPremim: is_premium,
      inviter,
    });
    if(inviter && inviter != '') {
      var inviteUser = await User.findOne({userid: inviter});
      if(inviteUser && !inviteUser.friends.includes(user._id)) {
        logger.info('inviter bonus start')
        inviteUser.friends.push(user._id);
        inviteUser.addPoint(is_premium ? BONUS.INVITE_FRIEND_WITH_PREMIUM : BONUS.INVITE_FRIEND)
        inviteUser.ticket += (inviteUser.friends.length % 10 == 0) ? inviteUser.friends.length / 10 : 0;
        await inviteUser.save();
      }
    }
  }
  const token = createJWT({ payload: { userid, username } });
  return {success: true, token, msg: 'login success'};
};

const login = async (req, res) => {
  const { userid, username, firstname, lastname, is_premium, inviter } = req.body;

  const loginRes = await register(userid, username, firstname, lastname, is_premium, inviter);
  if(!loginRes.success) {
    return res.status(StatusCodes.BAD_REQUEST).json('Please provide userid');
  }

  res.status(StatusCodes.OK).json({ token: loginRes.token });
};

module.exports = {
  register, login
}