const Purchase = require("../models/purchases");
const { commonResponse } = require("../utils/response/response");
const {
  validatePaymentFields,
} = require("../utils/validators/fieldsValidator");
const User = require("../models/users");
const {getIOInstance}=require("../utils/socket/index");

exports.makePayment = async (req, res) => {
  try {
    const validationErrors = validatePaymentFields(req.body);
    if (Object.keys(validationErrors).length > 0) {
      return res
        .status(400)
        .json(commonResponse(Object.values(validationErrors)[0], false));
    }
    const { content, user, amount,author } = req.body;
    const purchase = new Purchase({
      content,
      user,
      amount,
      author,
    });
    await purchase.save();
    if (purchase) {
      const updatedUser=await User.findOneAndUpdate(
        { _id: user },
        { $push: { purchasedContent: content } },
        { new: true }
      );
      const data={
        user:{
            firstName:updatedUser?.firstName,
            lastName:updatedUser?.lastName,
            email:updatedUser?.email,
            role:updatedUser?.role,
            status:updatedUser?.status,
            id:updatedUser?._id,
            purchasedContent:updatedUser?.purchasedContent
        },
        purchase:purchase
      }
      return res
        .status(201)
        .json(commonResponse("Payment made successfully", true, data));
    } else {
      return res.status(400).json(commonResponse("Payment not made", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.purchasesByUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(commonResponse("Invalid user id", false));
    }
    const purchases = await Purchase.find({ user: id }).populate('content author user');
    if (purchases) {
      return res
        .status(200)
        .json(commonResponse("Purchases found", true, purchases));
    } else {
      return res.status(404).json(commonResponse("Purchases not found", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};

exports.purchasesByAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(commonResponse("Invalid author id", false));
    }
    const purchases = await Purchase.find({ author: id });
    if (purchases) {
      return res
        .status(200)
        .json(commonResponse("Purchases found", true, purchases));
    } else {
      return res.status(404).json(commonResponse("Purchases not found", false));
    }
  } catch (error) {
    res.status(500).json(commonResponse("Server error", false));
  }
};
