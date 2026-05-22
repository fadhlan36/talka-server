"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const searchController_1 = require("../controllers/searchController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// GET /api/v1/search?keyword=...
router.get('/', authMiddleware_1.authenticate, searchController_1.searchUsers);
exports.default = router;
