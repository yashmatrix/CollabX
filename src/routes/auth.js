import { Router } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

const router = Router();
const CLIENT_URL = process.env.CLIENT_URL; // e.g. http://localhost:5173

// Signup
router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password || password.length < 8)
      return res
        .status(400)
        .json({ message: "Username and a password of 8+ chars required" });

    if (await User.findOne({ $or: [{ username }, { email }] }))
      return res.status(409).json({ message: "User already exists" });

    const user = await User.create({
      username,
      email,
      displayName: username,
      password: await bcrypt.hash(password, 12),
    });

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json({ id: user.id, username: user.username });
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: info?.message || "Login failed" });
    req.login(user, (err) =>
      err ? next(err) : res.json({ id: user.id, username: user.username })
    );
  })(req, res, next);
});

// Google
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

// Current user
router.get("/me", (req, res) =>
  req.isAuthenticated()
    ? res.json(req.user)
    : res.status(401).json({ message: "Not logged in" })
);

// Logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.sendStatus(204);
    });
  });
});

export default router;