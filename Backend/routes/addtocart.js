const express = require("express");
const router = express.Router();
const { Cart, User, Book } = require("../model/Models");
const fetchUser = require("../middleware/fetchUser");

// Add item to cart
router.post("/addtocart/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { title, quantity } = req.body;

        // Find the user's cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            cart = new Cart({ userId: userId, books: [] });
        }

        // Find the book details
        const book = await Book.findOne({ title: title });

        if (!book) {
            return res.status(404).json({ error: "Book not found." });
        }

        // Check if the book is already in the cart
        const existingBook = cart.books.find((item) => item.title === book.title);

        if (existingBook) {
            // If the book is already in the cart, update the quantity
            existingBook.quantity += quantity || 1; // Default to 1 if quantity is not provided
        } else {
            // If the book is not in the cart, add it
            cart.books.push({
                image: book.image,
                title: book.title,
                quantity: 1, // Default to 1 if quantity is not provided
                price: book.price,
            });
        }

        // Save the updated cart
        await cart.save();
        console.log('added')

        return res.status(200).json({ message: "Item added to cart successfully." });
    } catch (err) {
        console.error("Error adding item to cart: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
