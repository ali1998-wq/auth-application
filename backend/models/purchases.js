const mongoose = require("mongoose");

const purchasesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
    content: {
      type: mongoose.Schema.ObjectId,
      ref: "Content",
      required: true,
    },
    author:{
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "completed",
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchases", purchasesSchema);
