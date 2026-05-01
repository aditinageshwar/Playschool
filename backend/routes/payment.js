const Razorpay = require('razorpay');
const crypto = require('crypto');
const Fee = require('../models/Fee');
require('dotenv').config();
const express = require("express");
const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.get('/getRazorpayKey', (req,res) =>{
    return res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// 1. Order Create API
router.post("/create-order", async (req, res) => {
  try {
    const { amount, feeId } = req.body;

    const options = {
      amount: Number(amount * 100),     // Amount in paise
      currency: "INR",
      receipt: `receipt_${feeId}`,
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) return res.status(500).send("Error creating order");

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Razorpay Order Error" });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      feeId 
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex");

    if (razorpay_signature === expectedSign) {
      const updatedFee = await Fee.findByIdAndUpdate(
        feeId,
        {
          status: 'Paid',
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          paymentDate: new Date()
        },
        { new: true }
      );

      return res.status(200).json({ 
        success: true, 
        message: "Payment verified successfully! ✨",
        data: updatedFee 
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/create-order-all', async (req, res) => {
    try {
        const { amount, feeIds } = req.body;

        const options = {
            amount: Math.round(amount * 100), 
            currency: "INR",
            receipt: `multi_pay_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error("Create Order All Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/verify-payment-all', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, feeIds } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");

        if (expectedSignature === razorpay_signature) {
            await Fee.updateMany(
              { _id: { $in: feeIds } },
              {
                $set: {
                    status: "Paid",
                    paymentDate: new Date(),
                    paymentId: razorpay_payment_id,
                    orderId: razorpay_order_id
                }
              }
            );
            res.status(200).json({ success: true, message: "All payments verified and updated" });
        } 
        else {
          res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error("Verification All Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;