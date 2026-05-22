"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const followController_1 = require("../controllers/followController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// GET followers / following
router.get("/", authMiddleware_1.authenticate, followController_1.getFollows);
// FOLLOW
router.post("/", authMiddleware_1.authenticate, followController_1.followUser);
// UNFOLLOW
router.delete("/", authMiddleware_1.authenticate, followController_1.unfollowUser);
exports.default = router;
