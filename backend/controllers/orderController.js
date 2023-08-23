import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js"

// create new order
// POST /api/order
// Private
const addOrderProducts = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

//get logged in user roders
// GET /api/orders/myorders
//private

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id});
  res.status(200).json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if(order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// PUT /api/orders/:id/pay
// private
const updateOrderPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if(order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult ={
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//PUT /api/orders/:id/deliver
///private/admin
const updateOrderDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  //if order exists then:
  //set delivered true and delivered at the current date
  //save it in updatedOrder and respond to it
  //else throw error
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now(); 

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("order was not found");
  }
});

const getOrders= asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.status(200).json(orders);
});

export {
  addOrderProducts,
  getUserOrders,
  getOrderById,
  updateOrderPaid,
  updateOrderDelivered,
  getOrders,
}
