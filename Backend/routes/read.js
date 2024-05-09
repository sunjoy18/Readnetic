const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const {Book} = require('../model/Models');
const { GridFSBucket } = require('mongodb');

mongoose.connect('mongodb://127.0.0.1:27017/readnetic');

// GridFS setup
let bucket;

mongoose.connection.once('open', () => {
  const db = mongoose.connection.db;
  bucket = new GridFSBucket(db, { bucketName: 'fs' });
  // console.log(bucket._filesCollection);
});


router.get('/getBooks', async(req, res) => {
  try{
    console.log("Trying to fetch books.")
    // Get all courses from the database and send them as a response
    const books = await Book.find();
    res.send(books);
  }catch(error){
    console.log("Error getting courses");
    res.status(500).json({message:"Server error"})
  }
})

// New API endpoint to retrieve a book by ID
router.get('/getBook/:id', async (req, res) => {
  try {
      const bookId = req.params.id;

      // Validate if the provided ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
          return res.status(400).json({ message: "Invalid book ID format" });
      }

      // Find the book by ID
      const book = await Book.findById(bookId);

      if (!book) {
          return res.status(404).json({ message: "Book not found" });
      }

      // Exclude pdf field or handle it based on your requirements
      // const { pdf, ...bookWithoutPdf } = book.toObject();

      // res.json(bookWithoutPdf);
      res.json(book);
  } catch (error) {
      console.error("Error getting book by ID:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/getPdf/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    
    if (!filename) {
      return res.status(404).send('Filename not found in URL');
    }
    
    console.log('Attempting to retrieve video with filename:', filename);
    const downloadStream = bucket.openDownloadStreamByName(filename);

    downloadStream.on('error', (error) => {
      console.error('Error retrieving PDF:', error);
      res.status(404).send('PDF not found');
    });

    res.setHeader('Content-Type', 'application/pdf');

    downloadStream.pipe(res);

  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;