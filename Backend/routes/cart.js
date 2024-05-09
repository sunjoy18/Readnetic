const express = require("express");
const router = express.Router();
const { Cart, Book, User } = require("../model/Models");

// Get User's Cart
router.get("/getcart/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user's cart
        const cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found for the user." });
        }

        return res.status(200).json({ cart: cart });
    } catch (err) {
        console.error("Error retrieving user's cart: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Remove Item from Cart
router.delete("/removeFromCart/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const titleToRemove = req.body.title; // Assuming the title is in the request body

        // Find the user's cart
        const cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found for the user." });
        }

        // Remove the specified book from the cart
        const updatedBooks = cart.books.filter((item) => item.title !== titleToRemove);
        cart.books = updatedBooks;

        // Save the updated cart
        await cart.save();

        return res.status(200).json({ message: "Item removed from the cart successfully." });
    } catch (err) {
        console.error("Error removing item from cart: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Clear User's Cart
router.delete("/clearCart/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user's cart
        const cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found for the user." });
        }

        // Clear all items from the cart
        cart.books = [];

        // Save the updated cart
        await cart.save();

        return res.status(200).json({ message: "Cart cleared successfully." });
    } catch (err) {
        console.error("Error clearing user's cart: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update quantity of a book in the cart
router.put("/updateQuantity/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { title, operation } = req.body;

        // Find the user's cart
        const cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found for the user." });
        }

        // Find the book details
        const book = await Book.findOne({ title: title });

        if (!book) {
            return res.status(404).json({ error: "Book not found." });
        }

        // Check if the book is already in the cart
        const existingBook = cart.books.find((item) => item.title === book.title);

        if (existingBook) {
            // If the book is in the cart, update the quantity
            if (operation === 'increment') {
                existingBook.quantity = existingBook.quantity + 1;
            }
            else if (operation === 'decrement') {
                existingBook.quantity = existingBook.quantity - 1;
                if (existingBook.quantity < 1){
                    existingBook.quantity = 1;
                }
            }
        } else {
            return res.status(404).json({ error: "Book not found in the cart." });
        }

        // Save the updated cart
        await cart.save();

        return res.status(200).json({ message: "Quantity updated successfully." });
    } catch (err) {
        console.error("Error updating quantity: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;


module.exports = router;
