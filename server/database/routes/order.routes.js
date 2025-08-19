const express = require("express")
const router = express.Router()
const orderController = require("../controllers/order.controller.js")

router.post("/user", orderController.createOrder)
router.get("/user", orderController.getOrders)
router.get("/user/:id", orderController.getOneOrder)
router.put("/user", orderController.updateOrder)
router.delete("/user/:id", orderController.deleteOrder)

module.exports = router
