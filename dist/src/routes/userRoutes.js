"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/suggested', authMiddleware_1.authenticate, userController_1.getSuggestedUsers); // ← HARUS sebelum /:username
router.get('/:username', authMiddleware_1.authenticate, userController_1.getUserByUsername);
exports.default = router;
