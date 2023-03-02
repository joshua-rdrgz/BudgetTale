import jwt from 'jsonwebtoken';
import User from '@models/userModel';
import catchAsync from '@errors/catchAsync';
import AppError from '@errors/apiError';

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

export default {
  createUser: catchAsync(async function (req, res, next) {
    // manually add properties for secure creation of user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      months: req.body.months,
    });

    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: { user },
    });
  }),
  loginUser: catchAsync(async function (req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    // 1) verify that the client sent an email and password
    if (!email || !password)
      return next(new AppError('Please provide both email and password!', 400));

    // 2) verify that the email exists && password is correct.
    if (!user || !(await user.verifyCorrectPassword(password, user.password)))
      return next(
        new AppError('Incorrect email or password, please try again', 401)
      );

    // 3) Send token to client
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
    });
  }),
};
