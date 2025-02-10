const User = require('../models/userModel');
const CustomError = require('../utils/customError');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

// Register Service
exports.registerUserService = async ({ username, email, password }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new CustomError('Email already registered', 400);

    try {
        const user = await User.create({ username, email, password });

        const accessToken = generateAccessToken({ id: user._id, role: user.role, email: user.email });

        return {
            accessToken,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        };
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            throw new CustomError(`The ${field} "${err.keyValue[field]}" is already taken. Please use a different one.`, 400);
        }
        throw new CustomError('Something went wrong during registration. Please try again later.', 500);
    }
};


// Login Service (No changes here)
exports.loginUserService = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new CustomError('Invalid email or password', 401);

    if (user.isBlocked) {
        throw new CustomError('Your account is blocked. Please contact Admin.', 403);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new CustomError('Invalid email or password', 401);

    // Generate tokens
    const accessToken = generateAccessToken({ id: user._id, role: user.role, email: user.email });

    return {
        accessToken,
        user: { username: user.username, email: user.email, role: user.role },
    };
};

// delete user
exports.softDeleteUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new CustomError("User not found", 404);

    user.isDeleted = true;
    await user.save();
};

// Make User an Admin
exports.makeUserAdmin = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new CustomError("User not found", 404);

    user.role = "admin";
    await user.save();
};


exports.getAllUsersService = async () => {
    return await User.find({isDeleted:"false"}, "-password");
}


// Logout Service
exports.logoutUserService = () => {
    return true;
};


// logined user details
exports.getUserDetails = async (id) => {
    const user = await User.findById(id).select('username role');
    return user;
};

