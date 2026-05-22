"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const threadController_1 = require("../controllers/threadController"); // ← tambah getThreadsByUser
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authenticate, threadController_1.getThreads);
router.post('/', authMiddleware_1.authenticate, uploadMiddleware_1.upload.single('image'), threadController_1.createThread);
router.post('/like', authMiddleware_1.authenticate, threadController_1.toggleLike);
router.get('/user/:userId', authMiddleware_1.authenticate, threadController_1.getThreadsByUser);
router.get('/:id', authMiddleware_1.authenticate, threadController_1.getThreadById);
exports.default = router;
