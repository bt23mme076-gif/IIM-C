const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");
const { uploadBufferToGitHub } = require("../utils/githubUpload");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const section = req.body.section || "misc";
    const baseName = path.parse(req.file.originalname).name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    const fileName = `${baseName}-${Date.now()}.webp`;
    const githubPath = `images/${section}/${fileName}`;

    const buffer = await sharp(req.file.buffer)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const result = await uploadBufferToGitHub({
      buffer,
      path: githubPath,
      message: `upload ${githubPath}`,
    });

    res.json({
      success: true,
      cdnUrl: result.cdnUrl,
      githubPath: result.githubPath,
      fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Upload failed",
    });
  }
});

module.exports = router;