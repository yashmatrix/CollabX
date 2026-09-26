import "dotenv/config";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
// import projectRoutes from "./routes/projects.js";
// import { requireAuth } from "./middlewares/requireAuth.js";
import connectDB from "./db/index.js"


const app = express();
app.set("trust proxy", 1); // needed behind Render/Nginx for secure cookies

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded payloads (like HTML form data)

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
// app.use("/api/projects", requireAuth, projectRoutes);

app.get("/", (req, res) => {
  res.send("CollabX API is running...");
});

// --- Socket.io sharing the same session ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});

const wrap = (mw) => (socket, next) => mw(socket.request, {}, next);
io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
io.use((socket, next) =>
  socket.request.user ? next() : next(new Error("unauthorized"))
);

io.on("connection", (socket) => {
  const user = socket.request.user; // use for cursor name/color in presence
  console.log("connected:", user.displayName);
});

connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

