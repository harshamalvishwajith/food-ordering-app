//payhere checkout api

//define router
const express = require("express");
const router = express.Router();
const md5 = require("crypto-js/md5");
const { default: axios } = require("axios");

//Redirecting the customer to payhere gateway
router.post("/api/checkout", async (req, res) => {
  try {
    console.log("Request recieved from front", req.body);
    let merchantSecret = "MjU3MzExMDEzMTM2MjM3OTEyMDg5Nzk2ODk3NTc3MDMwNTIxNTU=";
    let merchantId = "1226513";
    let hashedSecret = md5(merchantSecret).toString().toUpperCase();
    let currency = "LKR";
    let orderId = req.body.orderId;

    let amount = req.body.amount;
    let amountFormated = parseFloat(amount)
      .toLocaleString("en-us", { minimumFractionDigits: 2 })
      .replaceAll(",", "");

    let hash = md5(
      merchantId + orderId + amountFormated + currency + hashedSecret
    )
      .toString()
      .toUpperCase();

    let payload = {
      sandbox: true,
      merchant_id: merchantId,
      return_url: "http://localhost:5197/payment-success",
      cancel_url: "http://localhost:5197/payment-cancel",
      notify_url: "http://localhost:3000/api/payhere-notify",
      first_name: req.body.fname,
      last_name: req.body.lname,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      order_id: orderId,
      items: req.body.items,
      currency: currency,
      amount: amountFormated,
      hash: hash,
    };
    res.send(payload);
  } catch (error) {
    console.log(error);
  }
});

//Listning to payment notification

//Verifying the payment status

module.exports = router;
