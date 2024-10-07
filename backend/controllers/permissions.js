const Permission = require("../models/permissions");
const { commonResponse } = require("../utils/response/response");
const Content = require("../models/content");
const Roles = require("../models/roles");
const mongoose = require("mongoose");
const {
  validatePermissionFields,
} = require("../utils/validators/fieldsValidator");

exports.addPermission = async (req, res) => {
  try {
    const validationErrors = validatePermissionFields(req.body);
    if (Object.keys(validationErrors).length > 0) {
      return res
        .status(400)
        .json(commonResponse(Object.values(validationErrors)[0], false));
    }
    const { name, content, usersWithAccess, groupsWithAccess } = req.body;
    const existingPermission = await Permission.findOne({ content: content });
    if (existingPermission) {
      return res
        .status(400)
        .json(commonResponse("Permission already exists", false));
    }
    const permission = new Permission({
      name,
      content,
      usersWithAccess: usersWithAccess,
      groupsWithAccess: groupsWithAccess,
    });

    await permission.save();

    if (permission) {
      await Content.findOneAndUpdate(
        { _id: content },
        { permission: permission._id },
        { new: true }
      );
      await Roles.updateMany(
        { name: { $in: groupsWithAccess } },
        { $push: { permissions: permission._id } }
      );
      return res
        .status(201)
        .json(
          commonResponse("Permission created successfully", true, permission)
        );
    } else {
      return res
        .status(400)
        .json(commonResponse("Permission not created", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.permissionByContent = async (req, res) => {
  try {
    const { content } = req.params;
    if (!content) {
      return res.status(400).json(commonResponse("Content is required", false));
    }
    const permission = await Permission.findOne({ content });
    if (permission) {
      return res
        .status(200)
        .json(commonResponse("Permission found", true, permission));
    } else {
      return res
        .status(404)
        .json(commonResponse("Permission not found", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.updatePermission = async (req, res) => {
  try {
    const { id, name, content, usersWithAccess, groupsWithAccess } = req.body;
    if (!id && !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json(commonResponse("Invalid permission id", false));
    }
    const updatedPermission = await Permission.findOneAndUpdate(
      { _id: id },
      { name, content, usersWithAccess, groupsWithAccess },
      { new: true }
    );
    if (updatedPermission) {
      return res
        .status(200)
        .json(
          commonResponse(
            "Permission updated successfully",
            true,
            updatedPermission
          )
        );
    } else {
      return res
        .status(400)
        .json(commonResponse("Permission not updated", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.deletePermission = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id && !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json(commonResponse("Invalid permission id", false));
    }
    const deletedPermission = await Permission.findOneAndDelete({ _id: id });
    if (deletedPermission) {
      await Content.findOneAndUpdate(
        { permission: id },
        { $unset: { permission: "" } },
        { new: true }
      );
      await Roles.updateMany(
        { permissions: id },
        { $pull: { permissions: id } }
      );
      return res
        .status(200)
        .json(
          commonResponse(
            "Permission deleted successfully",
            true,
            deletedPermission
          )
        );
    } else {
      return res
        .status(400)
        .json(commonResponse("Permission not deleted", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};
