const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        orders: [
            {
                orderId: mongoose.Schema.Types.ObjectId,
                items: [
                    {
                        title: String,
                        quantity: Number,
                        price: Number,
                    },
                ],
                orderDate: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    }
)

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    books: [
      {
        title: String,
        quantity: Number,
        price: Number,
        image: String,
      }
    ],
})

const bookSchema = new Schema({
    title: {
        type: String,
    },
    author: {
        type: String,
    },
    description: {
        type: String,
    },    
    price: {
        type: String,
    },
    genre: {
        type: String,
    },
    image: {
        type: String,
    },
    review: [{
        username: String,
        rating: Number,
        comment: String
    }],
    pdf: {
        type: String
    },
});

const chatSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        username: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Chat = mongoose.model('Chat', chatSchema);
const Book = mongoose.model('Book', bookSchema);
const Cart = mongoose.model('Cart', cartSchema);
const User = mongoose.model('User', userSchema);

module.exports = {Book, Cart, User, Chat};