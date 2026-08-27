import { Router } from "express";
import { userDependencies } from "../dependencies/userDependencies";
import { authenticateToken } from "../middleware/user/authMiddleware";
import CheckUserBlocked from "../middleware/user/CheckUserBlocked";
import { Readable } from "stream";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { RequestHandler } from "express";



const router = Router();
const {
  authController,
  eventController,
  ticketController,
  profileController,
  eventProfileController,
  chatController,
  walletController,
  passwordController,
  otpController,
  userController,
  cloudinary,
  upload
} = userDependencies();



router.get("/tickets/:id",ticketController.getTicketById.bind(ticketController));

router.get('/layout/:layoutId', userController.getLayoutAndEvent.bind(userController));
router.get('/:userId/tickets', userController.getUserTickets.bind(userController));
router.post("/:userId/tickets/:ticketId/cancel", userController.cancelUserTicket.bind(userController));
router.get("/profile-data", authenticateToken, CheckUserBlocked as RequestHandler, userController.getUser.bind(userController));


router.post("/verify-otp", otpController.verifyOTP.bind(otpController));
router.post("/resend-otp", otpController.resendOTP.bind(otpController));
router.post("/send-otp", otpController.sendOtp.bind(otpController));
router.post("/verify-otp-forgot-password", otpController.verifyOtp.bind(otpController));
router.post("/reset-password", passwordController.resetPassword.bind(passwordController));



router.post('/wallet-ticket-booking', walletController.bookTicketWithWalletController.bind(walletController));
router.put('/location', authenticateToken, eventController.updateLocation.bind(eventController));
router.get('/events-by-location', authenticateToken, eventController.getEventsNearUser.bind(eventController));
router.get("/chat/:roomId", chatController.getChatHistory.bind(chatController));
router.get("/chat/user/:userId", chatController.getChatsForUser.bind(chatController));
router.post('/events/book-ticket/:userId', eventController.bookEvent.bind(eventController));
router.get("/available-private-event-creators", eventProfileController.getAllPrivateCreatorsProfile.bind(eventProfileController))
router.get("/event-profile-info", eventProfileController.getProfileInfo.bind(eventProfileController));
router.get("/all-posts", eventProfileController.getAllPost.bind(eventProfileController));
router.get('/post-details-page/:id', eventProfileController.getPostDetails.bind(eventProfileController));


//AuthController
router.post("/register", authController.signUp.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/refresh-token", authController.refreshToken.bind(authController));
router.get("/logout", authController.logout.bind(authController));

//EventController
router.get('/public-events', eventController.getAllEvents.bind(eventController));
router.get('/event/:id', eventController.getEventById.bind(eventController));
router.get('/event-types', eventController.getEventType.bind(eventController));
router.get('/home-events', eventController.getHomeEvents.bind(eventController));

//ProfileController
router.put("/update-profile", authenticateToken, CheckUserBlocked as RequestHandler, profileController.updateProfile.bind(profileController) as RequestHandler)

//Wallet Controller
router.post('/wallet/add', walletController.addMoney.bind(walletController));
router.get('/wallet/:userId', walletController.getWallet.bind(walletController));
router.post('/wallet/checkout-session', walletController.createCheckoutSession.bind(walletController));
router.put('/change-password', authenticateToken, passwordController.changePassword.bind(passwordController))








router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL || "https://festivia-event-management.vercel.app"}/user/login?error=oauth_failed` }),
  async (req, res) => {
    try {
      const user: any = req.user;

      if (!user || !user._id) {
        return res.redirect(`${process.env.FRONTEND_URL || "https://festivia-event-management.vercel.app"}/user/login?error=oauth_failed`);
      }

      if (user.isBlocked) {
        return res.redirect(`${process.env.FRONTEND_URL || "https://festivia-event-management.vercel.app"}/user/login?error=blocked`);
      }

      const jwtSecret = process.env.JWT_SECRET!;
      const refreshSecret = process.env.JWT_REFRESH_SECRET!;

      const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1h" });
      const refreshToken = jwt.sign({ id: user._id }, refreshSecret, { expiresIn: "15d" });

      await User.findByIdAndUpdate(user._id, { refreshToken });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 24 * 60 * 60 * 1000,
      });

      const frontendUrl = process.env.FRONTEND_URL || "https://festivia-event-management.vercel.app";
      res.redirect(`${frontendUrl}/user/oauth-success?token=${token}`);
    } catch (err) {
      console.error("Google callback error:", err);
      const frontendUrl = process.env.FRONTEND_URL || "https://festivia-event-management.vercel.app";
      res.redirect(`${frontendUrl}/user/login?error=oauth_failed`);
    }
  }
);

router.get("/oauth-user", async (req, res) => {
  try {
    let userId: string | null = null;

    const authHeader = req.headers.authorization;
    const tokenFromHeaderOrQuery = (authHeader && authHeader.startsWith("Bearer "))
      ? authHeader.split(" ")[1]
      : (req.query.token as string);

    if (tokenFromHeaderOrQuery) {
      const jwtSecret = process.env.JWT_SECRET;
      if (jwtSecret) {
        try {
          const decoded = jwt.verify(tokenFromHeaderOrQuery, jwtSecret) as { id: string };
          userId = decoded.id;
        } catch (e) {
          console.warn("OAuth token verification failed from query/header:", e);
        }
      }
    }

    if (!userId) {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        const refreshSecret = process.env.JWT_REFRESH_SECRET;
        if (refreshSecret) {
          try {
            const decoded = jwt.verify(refreshToken, refreshSecret) as { id: string };
            userId = decoded.id;
          } catch (e) {
            console.warn("OAuth refresh token verification failed from cookie:", e);
          }
        }
      }
    }

    if (!userId) {
      return res.status(401).json({ message: "No refresh token or access token found" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account is blocked" });
    }

    const jwtSecret = process.env.JWT_SECRET!;
    const refreshSecret = process.env.JWT_REFRESH_SECRET!;

    const newAccessToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1h" });
    const newRefreshToken = jwt.sign({ id: user._id }, refreshSecret, { expiresIn: "15d" });

    await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        wallet: user.wallet,
        location: user.location,
        isVerified: user.isVerified,
        isBlocked: user.isBlocked,
        googleId: user.googleId,
      },
      token: newAccessToken,
    });
  } catch (error) {
    console.error("OAuth user fetch error:", error);
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});



router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log("Uploading file:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const streamUpload = (buffer: Buffer): Promise<any> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'chat_media',
            resource_type: 'auto'
          },
          (error, result) => {
            if (result) {
              console.log("Cloudinary upload successful:", result.secure_url);
              resolve(result);
            } else {
              console.error("Cloudinary upload error:", error);
              reject(error);
            }
          }
        );

        const readable = new Readable();
        readable._read = () => { };
        readable.push(buffer);
        readable.push(null);
        readable.pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      mediaType: req.file.mimetype.startsWith('image/') ? 'image' :
        req.file.mimetype.startsWith('video/') ? 'video' : 'file',
      mediaName: req.file.originalname,
      mediaSize: req.file.size
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({
      error: 'Failed to upload file to Cloudinary',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});



export default router;
