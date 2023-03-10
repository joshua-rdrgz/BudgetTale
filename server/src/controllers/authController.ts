import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { MiddlewareFunction } from '@types';
import User, { IUser } from '@models/userModel';
import catchAsync from '@errors/catchAsync';
import AppError from '@errors/apiError';

const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

const verifyJwt: (
  token: string,
  secret: jwt.Secret
) => Promise<jwt.JwtPayload> = promisify(jwt.verify);

export default {
  createUser: catchAsync(async function (req, res, next) {
    // manually add properties for secure creation of user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      months: req.body.months,
      role: req.body.role,
    });

    const token = signToken(user._id.toString());

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
    const token = signToken(user._id.toString());

    res.status(200).json({
      status: 'success',
      token,
    });
  }),

  protectRoute: catchAsync(async (req, res, next) => {
    // 1) Get token, check if exists
    let token: string;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    )
      token = req.headers.authorization.split(' ').pop();
    if (!token)
      return next(
        new AppError('You are not logged in, please log in and try again.', 401)
      );

    // 2) Verify token (not expired or manipulated)
    const decoded = await verifyJwt(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const tokenedUser = await User.findById(decoded.id);
    if (!tokenedUser)
      return next(
        new AppError(
          'User no longer exists, please create a new account and try again.',
          401
        )
      );

    // 4) Check if user has changed their password since JWT was obtained
    if (tokenedUser.passwordChangedAfter(decoded.iat))
      return next(
        new AppError('Password has recently changed, please log in again.', 401)
      );

    // 5) Assign user to 'req' for future middleware use
    req.user = tokenedUser;

    // 6) Grant access to the route
    next();
  }),

  restrictRouteTo: (...roles: IUser['role'][]) => {
    const returned: MiddlewareFunction = (req, res, next) => {
      if (!roles.includes(req.user.role))
        return next(
          new AppError(
            'You do not have permission to perform this action.',
            403
          )
        );
      next();
    };
    return returned;
  },
};
