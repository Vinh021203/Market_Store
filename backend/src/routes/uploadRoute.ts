// import express, { Request, Response } from 'express';
// import multer from 'multer';
// import cloudinary from './cloudinary';
// import { Readable } from 'stream';
// import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
// import path from 'path';

// const router = express.Router();
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // ✨ Xác định loại file là image hay raw (cho Cloudinary)
// const getResourceType = (filename: string): 'image' | 'raw' => {
//   const ext = path.extname(filename).toLowerCase();
//   const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
//   return imageExts.includes(ext) ? 'image' : 'raw';
// };

// // ✨ Phân loại sản phẩm theo đuôi
// const getProductType = (ext: string): 'template' | 'ebook' => {
//   if (ext === 'zip') return 'template';
//   if (ext === 'pdf') return 'ebook';
//   return 'template'; // mặc định
// };

// router.post('/upload', upload.single('image'), (req: Request, res: Response): void => {
//   const file = req.file;

//   if (!file) {
//     res.status(400).json({ error: 'No file uploaded' });
//     return;
//   }

//   const originalName = path.parse(file.originalname).name;
//   const extension = path.extname(file.originalname).slice(1).toLowerCase(); // zip/pdf
//   const cleanName = originalName.replace(/\s+/g, '-').toLowerCase();

//   const resourceType = getResourceType(file.originalname); // image/raw
//   const productType = getProductType(extension); // template/ebook

//   const stream = cloudinary.uploader.upload_stream(
//     {
//       folder: 'market-store',
//       public_id: cleanName, // tên cố định không random
//       resource_type: resourceType,
//       use_filename: true,
//       unique_filename: false,
//       overwrite: true,
//     },
//     (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
//       if (err || !result) {
//         res.status(500).json({ error: err?.message || 'Unknown error' });
//         return;
//       }

//       res.status(200).json({
//         url: result.secure_url,
//         name: originalName,
//         format: extension.toUpperCase(), // ZIP hoặc PDF
//         size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
//         type: productType, // 👈 template hoặc ebook
//       });
//     }
//   );

//   Readable.from(file.buffer).pipe(stream);
// });

// export default router;

import express, { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from './cloudinary';
import { Readable } from 'stream';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import path from 'path';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Xác định loại file là image hay raw
const getResourceType = (filename: string): 'image' | 'raw' => {
  const ext = path.extname(filename).toLowerCase();
  const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
  return imageExts.includes(ext) ? 'image' : 'raw';
};

// ✅ Xác định loại sản phẩm dựa trên đuôi file
const getProductType = (ext: string): 'template' | 'ebook' => {
  if (ext === 'zip') return 'template';
  if (ext === 'pdf') return 'ebook';
  return 'template'; // mặc định
};

router.post('/upload', upload.single('image'), (req: Request, res: Response): void => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const originalName = path.parse(file.originalname).name;
  const extension = path.extname(file.originalname).slice(1).toLowerCase(); // zip/pdf
  const cleanName = originalName.replace(/\s+/g, '-').toLowerCase();
  const fullFilename = `${cleanName}.${extension}`;

  const resourceType = getResourceType(file.originalname); // image/raw
  const productType = getProductType(extension); // template/ebook

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: 'market-store',
      public_id: cleanName, // tên hiển thị
      resource_type: 'auto',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      filename_override: fullFilename, // ✅ để giữ đúng đuôi .zip hoặc .pdf
    },
    (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
      if (err || !result) {
        res.status(500).json({ error: err?.message || 'Unknown error' });
        return;
      }

      res.status(200).json({
        url: result.secure_url,
        name: originalName,
        format: extension.toUpperCase(), // ZIP hoặc PDF
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: productType,
      });
    }
  );

  Readable.from(file.buffer).pipe(stream);
});

export default router;
