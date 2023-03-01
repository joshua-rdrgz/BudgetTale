import catchAsync from '@errors/catchAsync';
import User from '@models/userModel';

export default {
  getAllUsers: catchAsync(async function (req, res, next) {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      data: { users },
    });
  }),
  createUser: catchAsync(async function (req, res, next) {
    const user = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { user },
    });
  }),
};
