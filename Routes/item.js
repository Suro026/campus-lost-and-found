const express = require("express");
const router = express.Router();
const Item = require("../Models/Item");
const upload = require("../Middleware/upload");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// Helper: Auth Middleware
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // If needed
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Create Item with optional image upload
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const {
      status,
      location,
      title,
      description,
      category,
      email,
      phone,
      detailsPrivate,
    } = req.body;

    const item = new Item({
      status,
      location,
      title,
      description,
      category,
      email,
      phone,
      detailsPrivate,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create item error:", err);
    res.status(400).json({ message: "Error creating item" });
  }
});

// Get all Items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error("Get items error:", err);
    res.status(500).json({ message: "Error fetching items" });
  }
});

// Get single Item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    console.error("Get item error:", err);
    res.status(500).json({ message: "Error fetching item" });
  }
});

// Update Item
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      status: req.body.status,
      location: req.body.location,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      email: req.body.email,
      phone: req.body.phone,
      detailsPrivate: req.body.detailsPrivate,
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update item error:", err);
    res.status(400).json({ message: "Error updating item" });
  }
});

// Delete Item
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ message: "Error deleting item" });
  }
});

module.exports = router;