import User from "@models/userModel";
import catchAsync from "@errors/catchAsync";

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

    res.status(201).json({
      status: 'success',
      data: { user },
    });
  }),
}