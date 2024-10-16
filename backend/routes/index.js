const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./user');
const taskRouter = require('./task');
const playRouter = require('./play');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/task', taskRouter);
router.use('/play', playRouter);

const allRouter = express.Router();
allRouter.use('/api/v1', router);

module.exports = allRouter;