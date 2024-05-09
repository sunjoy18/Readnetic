const express = require("express");
const router = express.Router();
const {Book} = require("../model/Models");

router.post("/addreview", async (req, res) => {
    try {
        console.log(req.body)
        const title = req.body.title;
        const username = req.body.username;
        const rating = req.body.rating; // No need to trim for numbers
        const comment = req.body.comment.trim();

        let book = await Book.findOne({ title: title });

        if (book) {
            await Book.findOneAndUpdate(
                { title: title },
                {
                    $push: {
                        review: {
                            username: username,
                            rating: rating,
                            comment: comment,
                        },
                    },
                },
                { new: true }
            );

            return res.status(200).json({ message: "Review added successfully." });
        } else {
            return res.status(404).json({ error: "Book does not exist." });
        }
    } catch (err) {
        console.log("Error adding review: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
