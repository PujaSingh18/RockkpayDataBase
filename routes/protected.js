//routes/protectedRoutes.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const {
  getUserBalance,
  getUsersUnderUser,
  createTransaction,
  getUserTypeFromUserId,
  getAllTransactions,
  getUserTransactions,
  getUsersUnderSignedInUser,
  getUserById,
} = require("../models/dbOperations");

// GET RESPONSE ON ACCESSING PROTECTED ROUTES
router.get("/", verifyToken, (req, res) => {
  // This route is protected and accessed with a valid token
  res.json({
    message: "Protected route accessed successfully",
    userId: req.userId,
  });
});

// GET SIGNED IN USER'S BALANCE
router.get("/balance", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const balance = await getUserBalance(userId); // Get the user's balance
    res.json({
      message: "Protected route accessed successfully",
      userId,
      balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET USERS UNDER THE SIGNED IN USER BY USING USERTYPE
router.get("/underme/:utype", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { utype } = req.params;
    const user = await getUsersUnderUser(userId, utype);
    res.json({
      message: "Protected route accessed successfully",
      userId,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// TRANSFER MONEY WALLET TO WALLET
router.post("/transfer", verifyToken, async (req, res) => {
  try {
    const { receiverId, receiverName, receiverType, amount, reason } = req.body;
    // Sender's name and type can be retrieved from req.userId if needed
    const senderName = "Sender Name"; // Example
    const senderType = "Sender Type"; // Example
    // Call the createTransaction function with the provided details
    const transactionId = await createTransaction(
      req,
      senderName,
      senderType,
      receiverId,
      receiverName,
      receiverType,
      amount,
      reason
    );
    res
      .status(201)
      .json({ message: "Transaction created successfully", transactionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET ALL TRANSACTIONS FROM WHOLE DATABASE FOR ADMIN
router.get("/adminalltransactions", getAllTransactions);

// GET ALL TRANSACTIONS FOR SIGNED IN USER ONLY
router.get("/my-transactions", verifyToken, getUserTransactions);

// API endpoint to get users under the signed-in user
router.get("/users-under-me", verifyToken, getUsersUnderSignedInUser);

// GET RECEIVER'S DETAILS FROM ITS USER ID
router.get("/userrr/:rid", verifyToken, async (req, res) => {
  try {
    const { rid } = req.params;
    const user = await getUserById(rid);
    res.json({ message: "Protected route accessed successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
