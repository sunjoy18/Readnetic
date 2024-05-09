const express = require("express");
const router = express.Router();
const { Book } = require("../model/Models");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const stream = require("stream");
const mongoose = require("mongoose");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function getFileExtension(filename) {
    const extension = /(?:\.([^.]+))?$/.exec(filename)[1];
    return extension ? extension.toLowerCase() : null;
}

const uploadFileToGridFS = async (filename, fileBuffer) => {
    try {
        console.log("Received Pdf:", filename);
        const db = mongoose.connection.db;
        const bucket = new GridFSBucket(db, { bucketName: "fs" });

        const uploadStream = bucket.openUploadStream(filename);
        const readableStream = stream.Readable.from([fileBuffer]);

        readableStream.pipe(uploadStream);

        await new Promise((resolve, reject) => {
            uploadStream.on("finish", resolve);
            uploadStream.on("error", reject);
        });

        console.log("Pdf uploaded to GridFS");
    } catch (error) {
        console.error("Error uploading Pdf to GridFS:", error);
        throw error;
    }
};

router.post("/add", upload.single("pdf"), async (req, res) => {
    try {
        const { title, author, genre, description, price, image } = req.body;

        const existingBook = await Book.findOne({ title });

        if (existingBook) {
            return res.status(400).json({ error: "Book already exists." });
        }

        const pdf = req.file;
        const fileBuffer = pdf.buffer;
        const filename = pdf.originalname;

        await Book.create({
            title: title,
            author: author,
            genre: genre,
            description: description,
            price: price,
            image: image,
            pdf: filename,
        });

        await uploadFileToGridFS(filename, fileBuffer);

        console.log("Book added successfully");
        return res.status(201).json({ message: "Book added successfully" });
    } catch (error) {
        console.error("Error adding book:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
