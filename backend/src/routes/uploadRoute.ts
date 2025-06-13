import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "./cloudinary";
import { Readable } from "stream";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import path from "path";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const getResourceType = (filename: string): "image" | "raw" => {
  const ext = path.extname(filename).toLowerCase();
  const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
  return imageExts.includes(ext) ? "image" : "raw";
};

const getProductType = (ext: string): "template" | "ebook" => {
  if (ext === "zip") return "template";
  if (ext === "pdf") return "ebook";
  return "template";
};

router.post(
  "/upload",
  upload.single("image"),
  (req: Request, res: Response): void => {
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const originalName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname).slice(1).toLowerCase();
    const cleanName = originalName.replace(/\s+/g, "-").toLowerCase();

    const productType = getProductType(extension);

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "market-store",
        public_id: cleanName,
        resource_type: "auto",
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      },
      (
        err: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (err || !result) {
          res.status(500).json({ error: err?.message || "Unknown error" });
          return;
        }

        res.status(200).json({
          url: result.secure_url,
          name: originalName,
          format: extension.toUpperCase(),
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          type: productType,
        });
      }
    );

    Readable.from(file.buffer).pipe(stream);
  }
);

export default router;
