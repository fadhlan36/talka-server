import { Router } from "express";
import {
  getThreads,
  createThread,
  toggleLike,
  getThreadById,
  getThreadsByUser,
} from "../controllers/threadController"; // ← tambah getThreadsByUser
import { authenticate } from "../middlewares/authMiddleware";
import upload from "../config/multer";
// import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.get("/", authenticate, getThreads);
router.post(
  "/",
  authenticate,
  upload.single("image"),
  //
  createThread,
);
router.post("/like", authenticate, toggleLike);
router.get("/user/:userId", authenticate, getThreadsByUser);
router.get("/:id", authenticate, getThreadById);

export default router;
