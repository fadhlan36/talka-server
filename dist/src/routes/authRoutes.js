"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // middleware cek token
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware"); // middleware upload foto
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.post('/google-login', authController_1.googleLogin);
router.put('/edit-profile', authMiddleware_1.authenticate, uploadMiddleware_1.upload.single('photo_profile'), authController_1.editProfile);
exports.default = router;
