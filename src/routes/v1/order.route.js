const express = require("express");
const { authentication } = require("../../config/Authenticate");
const router = express.Router();
const orderController = require("../../controllers/order.controller");

// DONE - GET ALL ORDERS - ADMIN
router.get("/", orderController.getOrders);

// DONE - GET Filter ALL ORDERS - ADMIN
router.get("/filterOrder", authentication, orderController.filterOrder);

// DONE - GET ALL RECENT ORDERS - ADMIN
router.get("/recentOrder", authentication, orderController.getRecentOrder);

//DONE TOTAL SALE - ADMIN
router.get("/totalSales", authentication, orderController.getTotalSale);

//DONE TOTAL SALE by date - ADMIN
router.post(
    "/totalSales/byDate",
    authentication,
    orderController.getTotalSaleByDate
);

//DONE TOTAL ORDERS - ADMIN
router.get("/totalOrders", authentication, orderController.getTotalOrders);

//DONE TOTAL ORDERS BY Year - ADMIN
router.get(
    "/totalSaleByYear",
    authentication,
    orderController.getTotalSaleByYear
);

//DONE TOTAL SALES BY YEAR- ADMIN
router.get(
    "/totalOrdersByYear",
    authentication,
    orderController.getTotalOrdersByYear
);

//DONE TOTAL SALES BY MONTH- ADMIN
router.get(
    "/totalSaleByMonth",
    authentication,
    orderController.getTotalSaleByMonth
);

//DONE TOTAL Orders BY MONTH- ADMIN
router.get(
    "/totalOrdersByMonth",
    authentication,
    orderController.getTotalOrdersByMonth
);

//DONE TOTAL SALES BY DAY - ADMIN
router.get(
    "/totalSaleByDay",
    authentication,
    orderController.getTotalSaleByDay
);

//DONE TOTAL ORDERS BY DAY - ADMIN
router.get(
    "/totalOrdersByDay",
    authentication,
    orderController.getTotalOrdersByDay
);

// GET ORDERS by SALES STATUS (pending, processing, delivered....etc) - ADMIN
router.get(
    "/status/:status",
    authentication,
    orderController.getOrdersOnStatus
);

// GET ALL ORDERS by USER - CLIENT
router.get("/user/:email", orderController.getOrdersByUserId);

// GET SINGLE ORDER by ID - ADMIN
router.get("/:id", authentication, orderController.getOrder);

// CREATE SINGLE ORDER - CLIENT
router.post("/:email", orderController.createOrder);

// CREATE MULTIPLE ORDERS
// router.post('/all', orderController.createOrders);

// UPDATE SINGLE ORDER - ADMIN
router.put("/:id", authentication, orderController.updateOrder);

// DELETE SINGLE ORDER - ADMIN
router.delete("/:id", authentication, orderController.deleteOrder);

// TODO - DELETE ALL ORDERS

module.exports = router;
