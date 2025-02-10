const asyncHandler = require('../middlewares/asyncHandler');
const { registerUserService, loginUserService, logoutUserService, getUserDetails, softDeleteUser, makeUserAdmin, getAllUsersService } = require('../services/authService');
const { registerValidation, loginValidation } = require('../validators/authValidation');
const { generateAccessToken } = require('../utils/generateToken')
const CustomError = require('../utils/customError');
const jwt = require('jsonwebtoken')

// Register User
exports.registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  const { error } = registerValidation.validate({ username, email, password, confirmPassword });
  if (error) throw new CustomError(error.details[0].message, 400);

  const { accessToken, user } = await registerUserService({ username, email, password });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
    sameSite: 'none'
  });
  res.status(200).json({
    message: 'Register successful',
    user,
  });
});


// Login User
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginValidation.validate({ email, password });
  if (error) throw new CustomError(error.details[0].message, 400);

  const { accessToken, user } = await loginUserService({ email, password });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
    sameSite: 'none'
  });
  res.status(200).json({
    message: 'Login successful',
    user,
  });
});


// Logout User
exports.logoutUser = asyncHandler(async (req, res) => {
  await logoutUserService();

  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: '/'
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// logined user
exports.getLoggedInUser = asyncHandler(async (req, res) => {
  const user = await getUserDetails(req.user.id);
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  res.status(200).json({ user });
});

// get all users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();
  res.status(200).json(users);
})

// delete user
exports.deleteUser = asyncHandler(async (req, res) => {
  await softDeleteUser(req.params.userId);
  res.status(200).json({ message: "User deleted successfully" });
});

// Make User Admin
exports.promoteUser = asyncHandler(async (req, res) => {
  await makeUserAdmin(req.params.userId);
  res.status(200).json({ message: "User promoted to admin" });
});