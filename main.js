require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());
// Access the image from the frontend with the url of then file
app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api/users", require("./Routes/user"));
// Item
app.use('/api/item', require("./Routes/item"))

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
