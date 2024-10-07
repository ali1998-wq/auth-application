const User = require("../models/users");
const Role = require("../models/roles");
const { commonResponse } = require("../utils/response/response");
const {
  validateUserFields,
  validateLoginFields,
} = require("../utils/validators/fieldsValidator");
const { generateTokens } = require("../utils/common/generateTokens");
const mongoose = require("mongoose");

//user registration
exports.Register = async (req, res) => {
  try {
    const validationErrors = validateUserFields(req.body);
    if (Object.keys(validationErrors).length > 0) {
      return res
        .status(400)
        .json(commonResponse(Object.values(validationErrors)[0], false));
    }
    const { firstName, lastName, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(commonResponse("User already exists", false));
    }
    const roleId = await Role.findOne({ name: role });
    if (!roleId) {
      return res.status(400).json(commonResponse("Role not found", false));
    }
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: roleId._id,
    });
    await user.save();
    if (user) {
      const { Token, RefreshToken } = generateTokens(
        firstName,
        lastName,
        email,
        role,
        user._id
      );
      const userData = {
        user: {
          firstName,
          lastName,
          email,
          role,
          status: user.status,
          id: user._id,
        },
        Token,
        RefreshToken,
      };
      return res
        .status(201)
        .json(commonResponse("User created successfully", true, userData));
    } else {
      return res.status(400).json(commonResponse("User not created", false));
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//user login
exports.Login = async (req, res) => {
  try {
    const validationErrors = validateLoginFields(req.body);
    if (Object.keys(validationErrors).length > 0) {
      return res
        .status(400)
        .json(commonResponse(Object.values(validationErrors)[0], false));
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role");
    if (!user) {
      return res.status(400).json(commonResponse("User not found", false));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json(commonResponse("Invalid password", false));
    }
    const { Token, RefreshToken } = generateTokens(
      user.firstName,
      user.lastName,
      user.email,
      user.role.name,
      user._id
    );
    const userData = {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role.name,
        status: user.status,
        id: user._id,
        purchasedContent: user.purchasedContent,
      },
      Token,
      RefreshToken,
    };
    return res
      .status(200)
      .json(commonResponse("Login successful", true, userData));
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

//grant access to author to publish content
exports.grantAccess = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(commonResponse("Invalid user id", false));
    }
    const user = await User.findOne({ _id: id }).populate("role");
    if (user) {
      if (!user?.role || user?.role.name !== "author") {
        return res
          .status(400)
          .json(commonResponse("User is not an author", false));
      }
      await User.findOneAndUpdate(
        { _id: id },
        { status: "verified" },
        { new: true }
      );
      return res.status(200).json(
        commonResponse("Access granted successfully", true, {
          ...user._doc,
          status: "verified",
        })
      );
    } else {
      return res.status(400).json(commonResponse("User not found", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role").sort({ createdAt: -1 });
    if (users.length > 0) {
      return res.status(200).json(commonResponse("Users found", true, users));
    } else {
      return res.status(404).json(commonResponse("No users found", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.singleUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(commonResponse("Invalid user id", false));
    }
    const user = await User.findOne({ _id: id }).populate("role");
    if (user) {
      return res.status(200).json(commonResponse("User found", true, user));
    } else {
      return res.status(404).json(commonResponse("User not found", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};




