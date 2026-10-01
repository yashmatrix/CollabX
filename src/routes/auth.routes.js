import { Router } from "express";
import passport from "passport";
import { upload } from "../middlewares/multer.middleware.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateAvatar,
    updateCoverImage,
} from "../controllers/user.controller.js";

const router = Router();
const CLIENT_URL = process.env.CLIENT_URL; // e.g. http://localhost:5173

// ─── Local auth ───────────────────────────────────────────────────────────────

// POST /auth/signup  – register + auto-login
router.post(
    "/signup",
    upload.fields([
        { name: "avatar", maxCount: 1 }
    ]),
    registerUser
);

// POST /auth/login  – local username/email + password login
router.post("/login", loginUser);

// POST /auth/logout
router.post("/logout", requireAuth, logoutUser);

// ─── Session / current user ───────────────────────────────────────────────────

// GET /auth/me  – returns the authenticated user or 401
router.get("/me", getCurrentUser);

// ─── Google OAuth ─────────────────────────────────────────────────────────────

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${CLIENT_URL}/login?error=1`,
    }),
    (req, res) => res.redirect(CLIENT_URL)
);

// ─── Profile updates (authenticated) ─────────────────────────────────────────

// PATCH /auth/avatar
router.patch("/avatar", requireAuth, upload.single("avatar"), updateAvatar);

export default router;