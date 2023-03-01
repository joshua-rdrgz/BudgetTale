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
};
