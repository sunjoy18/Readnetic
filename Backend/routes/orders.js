const express = require('express');
const router = express.Router();
const {Cart, User, Book} = require('../model/Models');
const mongoose = require('mongoose');


router.post('/orders/place/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Get user's cart
        const cart = await Cart.findOne({ userId: userId });

        if (!cart || cart.books.length === 0) {
            return res.status(400).json({ error: 'Cart is empty. Add items to cart before placing an order.' });
        }

        // Create an order object from the cart
        const order = {
            orderId: new mongoose.Types.ObjectId(),
            items: cart.books.map((item) => ({
                title: item.title,
                quantity: item.quantity,
                price: item.price,
            })),
            orderDate: new Date(),
        };

        // Update user's orders and clear the cart
        await User.findByIdAndUpdate(
            userId,
            {
                $push: { orders: order },
            },
            { new: true }
        );

        // Clear the user's cart
        await Cart.findOneAndUpdate({ userId: userId }, { $set: { books: [] } });

        res.status(200).json({ message: 'Order placed successfully.', order: order });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
