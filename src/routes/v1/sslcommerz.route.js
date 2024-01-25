const express = require("express");
const router = express.Router();
const SSLCommerzPayment = require("sslcommerz-lts");
const axios = require("axios");

// GET ALL ADDRESSES - ADMIN
router.get("/", async (req, res) => {
    /**
     * process.env.BASE_URL url response
     */

    return res.status(200).json({
        message: "Welcome to sslcommerz router",
        url: `${process.env.BASE_URL}/ssl-request`,
    });
});

router.get("/ssl-request/:userEmail", async (req, res) => {
    const { userEmail } = req.params;
    let { address, userData } = await getUserCartInfo(userEmail);

    const data = {
        total_amount: userData.total,
        currency: "BDT",
        tran_id: "BEPONI-" + new Date().getTime(),
        success_url: `${process.env.BASE_URL}/ssl/ssl-payment-success/${userData.shippingCharge}/${userEmail}`,
        fail_url: `${process.env.BASE_URL}/ssl/ssl-payment-fail`,
        cancel_url: `${process.env.BASE_URL}/ssl/ssl-payment-cancel`,
        shipping_method: "No",
        product_name: "Bd Beponi Products",
        product_category: "Beponi Product Category",
        product_profile: "general",
        cus_name: address.shippingName || "",
        cus_email: "cust@yahoo.com",
        // cus_add1: "Dhaka",
        // cus_add2: "Dhaka",
        // cus_city: "Dhaka",
        // cus_state: "Dhaka",
        // cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: address.shippingPhone || "01711111111",
        // cus_fax: "01711111111",
        // multi_card_name: "all",
        // value_a: "ref001_A",
        // value_b: "ref002_B",
        // value_c: "ref003_C",
        // value_d: "ref004_D",
        ipn_url: `${process.env.BASE_URL}/ssl/ssl-payment-notification`,
    };
    const sslcommerz = new SSLCommerzPayment(
        process.env.STORE_ID,
        process.env.STORE_PASSWORD,
        true
    );

    sslcommerz
        .init(data)
        .then((response) => {
            // process the response that got from sslcommerz
            if (response?.GatewayPageURL) {
                res.redirect(response.GatewayPageURL);
            } else {
                res.status(400).json({
                    message: "Session was not successful",
                    res: response,
                });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        });
});

router.post("/ssl-payment-notification", async (req, res) => {
    /**
     * If payment notification
     */

    return res.status(200).json({
        data: req.body,
        message: "Payment notification",
    });
});

router.post(
    "/ssl-payment-success/:shippingPrice/:userEmail",
    async (req, res) => {
        /**
         * If payment successful
         */
        try {
            const { shippingPrice, userEmail } = req.params;
            const { card_type, tran_id, amount } = req.body; // this all data get from sslcommerz  boyd.
            const orderData = {
                status: "pending",
                paymentType: "SSLCOMMERZ",
                totalAmount: amount,
                shippingCharge: shippingPrice,
                transactionId: tran_id,
                paymentMethod: card_type,
            };
            const headers = {
                "access-control-allow-credentials": "true",
                "Content-Type": "application/json",
            };
            await axios.post(
                `${process.env.BASE_URL}/order/${userEmail}`,
                orderData,
                { headers }
            );
            res.redirect(process.env.CLIENT_URL);
            // return res.status(200).json({
            //     data: req.body,
            //     message: "Payment success",
            // });
        } catch (error) {
            // console.log(error);
        }
    }
);

router.post("/ssl-payment-fail", async (req, res) => {
    /**
     * If payment failed
     */
    res.redirect(`${process.env.CLIENT_URL}/order-cancel`);

    // return res.status(200).json({
    //     data: req.body,
    //     message: "Payment failed",
    // });
});

router.post("/ssl-payment-cancel", async (req, res) => {
    /**
     * If payment cancelled
     */
    res.redirect(`${process.env.CLIENT_URL}/order-cancel`);

    // return res.status(200).json({
    //     data: req.body,
    //     message: "Payment cancelled",
    // });
});

async function getUserCartInfo(userEmail) {
    try {
        const response = await axios.get(
            `${process.env.BASE_URL}/cart/myCart/${userEmail}`
        );
        const getActiveAddress = await axios.get(
            `${process.env.BASE_URL}/address/active/${userEmail}`
        );

        const userData = response.data.data;
        const address = getActiveAddress.data.data;

        // do something with userData
        return { address, userData };
    } catch (error) {
        return null;
    }
}

module.exports = router;
