const Content = require("../models/content");
const Permissions = require("../models/permissions");
const { commonResponse } = require("../utils/response/response");
const {
  validateContentFields,
} = require("../utils/validators/fieldsValidator");
const mongoose = require("mongoose");

exports.addContent = async (req, res) => {
  try {
    const validationErrors = validateContentFields(req.body);
    if (Object.keys(validationErrors).length > 0) {
      return res
        .status(400)
        .json(commonResponse(Object.values(validationErrors)[0], false));
    }
    const { title, description, body, author, amount, type } = req.body;
    const existingContent = await Content.findOne({ title });
    if (existingContent) {
      return res
        .status(400)
        .json(commonResponse("Content already exists", false));
    }
    const content = new Content({
      title,
      description,
      body,
      author,
      amount,
      type,
    });
    await content.save();
    if (content) {
      return res
        .status(201)
        .json(commonResponse("Content created successfully", true, content));
    } else {
      return res.status(400).json(commonResponse("Content not created", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.singleContent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(commonResponse("Invalid content id", false));
    } else {
      const content = await Content.findOne({ _id: id }).populate("permission");
      if (content) {
        return res
          .status(200)
          .json(commonResponse("Content found", true, content));
      } else {
        return res.status(404).json(commonResponse("Content not found", false));
      }
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.allContent = async (req, res) => {
  try {
    const contents = await Content.find().populate({path:"permission",populate:{path:"usersWithAccess"}}).sort({ createdAt: -1 });
    if (contents?.length > 0) {
      return res
        .status(200)
        .json(commonResponse("Contents found", true, contents));
    } else {
      return res.status(404).json(commonResponse("No contents found", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.updateContent = async (req, res) => {
  try {
    const { id, title, description, body, author, amount, type } = req.body;
    if (!id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(commonResponse("Invalid content id", false));
    }
    const updatedContent = await Content.findOneAndUpdate(
      { _id: id },
      { title, description, body, author, amount, type },
      { new: true }
    );
    if (updatedContent) {
      return res
        .status(200)
        .json(
          commonResponse("Content updated successfully", true, updatedContent)
        );
    } else {
      return res.status(400).json(commonResponse("Content not updated", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(commonResponse("Invalid content id", false));
    }
    const deletedContent = await Content.findOneAndDelete({ _id: id });
    if (deletedContent) {
      return res
        .status(200)
        .json(commonResponse("Content deleted successfully", true));
    } else {
      return res.status(400).json(commonResponse("Content not deleted", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.contentByAuthor = async (req, res) => {
  try {
    const { author } = req.params;
    if (!author && !mongoose.Types.ObjectId.isValid(author)) {
      return res.status(400).json(commonResponse("Invalid author id", false));
    }
    const contents = await Content.find({ author });
    if (contents?.length > 0) {
      return res
        .status(200)
        .json(commonResponse("Contents found", true, contents));
    } else {
      return res.status(404).json(commonResponse("No contents found", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};
