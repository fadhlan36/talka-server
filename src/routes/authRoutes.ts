import { Router } from "express";
// import { register, login, googleLogin, editProfile } from '../controllers/authController';
import {
  login,
  register,
  googleLogin,
  editProfile,
} from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware"; // middleware cek token
import upload from "../config/multer";
// import { upload } from "../middlewares/uploadMiddleware"; // middleware upload foto

const router = Router();

router.get("/", authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Test successfully",
  });
});
router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);

router.put(
  "/edit-profile",
  authenticate,
  upload.single("photo_profile"),
  editProfile,
);

export default router;
