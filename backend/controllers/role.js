const Role = require("../models/roles");
const { validateRoleFields } = require("../utils/validators/fieldsValidator");
const { commonResponse } = require("../utils/response/response");

exports.addRole = async (req, res) => {
  try {
    const validationErrors = validateRoleFields(req.body);
    if (Object.keys(validationErrors).length > 0) {
      return res
        .status(400)
        .json(commonResponse(Object.values(validationErrors)[0], false));
    }
    const { name } = req.body;
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json(commonResponse("Role already exists", false));
    }
    const role = new Role({
      name,
    });
    await role.save();
    if (role) {
      return res
        .status(201)
        .json(commonResponse("Role created successfully", true, role));
    } else {
      return res.status(400).json(commonResponse("Role not created", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.singleRole = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(commonResponse("Invalid role id", false));
    } else {
      const role = await Role.findOne({ _id: id });
      if (role) {
        return res.status(200).json(commonResponse("Role found", true, role));
      } else {
        return res.status(404).json(commonResponse("Role not found", false));
      }
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.allRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    if (roles.length > 0) {
      return res.status(200).json(commonResponse("Roles found", true, roles));
    } else {
      return res.status(404).json(commonResponse("No roles found", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id, permissions, name } = req.body;
    if (!id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(commonResponse("Invalid role id", false));
    }
    const updatedRole = await Role.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          permissions,
        },
        name: name,
      },
      { new: true }
    );
    if (updatedRole) {
      return res
        .status(200)
        .json(commonResponse("Role updated successfully", true, updatedRole));
    } else {
      return res.status(400).json(commonResponse("Role not updated", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(commonResponse("Invalid role id", false));
    }
    const deletedRole = await Role.findOneAndDelete({ _id: id });
    if (deletedRole) {
      return res
        .status(200)
        .json(commonResponse("Role deleted successfully", true, deletedRole));
    } else {
      return res.status(400).json(commonResponse("Role not deleted", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};
