const mongoose = require("mongoose");

const mongoUri = "mongodb://127.0.0.1:27017/readnetic";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = { connectToMongo };