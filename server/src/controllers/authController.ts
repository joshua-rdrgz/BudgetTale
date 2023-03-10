import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { MiddlewareFunction } from '@types';
import User, { IUser } from '@models/userModel';
import catchAsync from '@errors/catchAsync';
import AppError from '@errors/apiError';
import sendEmail from '@utils/email';

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
    const {
      name,
      email,
      role,
      password,
      passwordConfirm,
      months,
    }: {
      name: IUser['name'];
      email: IUser['email'];
      role: IUser['role'];
      password: IUser['password'];
      passwordConfirm: IUser['passwordConfirm'];
      months: IUser['months'];
    } = req.body;

    // manually add properties for secure creation of user
    const user = await User.create({
      name,
      email,
      role,
      password,
      passwordConfirm,
      months,
    });

    const token = signToken(user._id.toString());

    res.status(201).json({
      status: 'success',
      token,
      data: { user },
    });
  }),

  loginUser: catchAsync(async function (req, res, next) {
    const {
      email,
      password,
    }: {
      email: IUser['email'];
      password: IUser['password'];
    } = req.body;
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

  forgotPassword: catchAsync(async (req, res, next) => {
    const { email }: { email: string } = req.body;

    // 1) Get user based on POSTed email
    const user = await User.findOne({ email });
    if (!user)
      return next(new AppError('No user found, try a different email.', 404));

    // 2) Create reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateModifiedOnly: true });

    // 3) Send reset token
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/resetPassword/${resetToken}`;
    const message = `Forgot your password?  Click the link here with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Reset Your PBA Password (Valid 10 Minutes Only)',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Reset link sent to email!',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateModifiedOnly: true });

      return next(
        new AppError(
          'There was an error sending the email.  Try again later.',
          500
        )
      );
    }
  }),

  resetPassword: catchAsync(async (req, res, next) => {
    const {
      password,
      passwordConfirm,
    }: {
      password: IUser['password'];
      passwordConfirm: IUser['passwordConfirm'];
    } = req.body;

    // 1) Get user based on token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2) Check if user exists && token hasn't expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user)
      return next(new AppError('Token is invalid or has expired.', 400));

    // 3) Reset password
    user.password = password;
    user.passwordConfirm = passwordConfirm;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 4) Log User In (send JWT)
    const token = signToken(user._id.toString());
    res.status(200).json({
      status: 'success',
      token,
    });
  }),
};
