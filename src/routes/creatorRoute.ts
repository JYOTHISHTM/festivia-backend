// src/routes/creatorRoute.ts
import express from "express";
import { creatorDependencies } from "../dependencies/creatorDependencies";
import { authenticateToken } from "../middleware/creator/authMiddleware";
import checkBlocked from "../middleware/creator/checkBlocked";
import { PostUpload } from "../middleware/creator/PostUpload";
import { Readable } from "stream";

const router = express.Router();
const {
  authController,
  creatorController,
  eventController,
  profileController,
  eventProfileController,
  chatController,
  subscriptionController,
  walletController,
  ticketController,
  passwordController,
  otpController,
  seatLayoutController,
  cloudinary,
  upload
} = creatorDependencies();


//creatorController
router.get('/layout/:layoutId', creatorController.getReservedEvents.bind(creatorController));
router.post('/create-event', authenticateToken, upload.single('image'), creatorController.createEvent.bind(creatorController));
router.get("/me", (req, res) => creatorController.getCreator.bind(creatorController));

//otpController
router.post("/verify-otp", otpController.verifyOTP.bind(otpController));
router.post("/resend-otp", otpController.resendOTP.bind(otpController));
router.post("/send-otp", otpController.sendOtp.bind(otpController));
router.post("/verify-otp-forgot-password", otpController.verifyOtp.bind(otpController));

//eventController
router.get("/event/:id", eventController.getEventById.bind(eventController));
router.patch('/update-description/:id', eventController.updateDescription.bind(eventController));
router.patch('/toggle-list/:eventId', eventController.toggleListStatus.bind(eventController));
router.get("/events", eventController.getAllEvents.bind(eventController));
router.get('/all-listed-events/:creatorId', eventController.getAllListedEvents.bind(eventController));


//seatLayoutController
router.get('/layouts', seatLayoutController.getLayouts.bind(seatLayoutController));
router.post('/layouts/:creatorId', seatLayoutController.createLayout.bind(seatLayoutController));
router.get('/check-layouts/:creatorId', seatLayoutController.getLayoutsByCreatorId.bind(seatLayoutController));

//walletController
router.get('/wallet/:creatorId', walletController.getWalletForCreator.bind(walletController));
router.post('/wallet/add', walletController.addMoneyToCreator.bind(walletController));
router.post('/wallet/checkout-session', walletController.createCheckoutSessionForCreator.bind(walletController));

//ticketController
router.get("/ticket-summary", ticketController.getTicketSummary.bind(ticketController))
router.get('/ticket-users', ticketController.getUsersWhoBoughtTickets.bind(ticketController));


//chatController
router.get("/chat/:roomId", chatController.getChatHistoryForCreator.bind(chatController));
router.get("/chat/creator/:creatorId", chatController.getChatsForCreator.bind(chatController));
router.get('/:creatorId/messages/users', chatController.getUsersWhoMessagedCreator.bind(chatController));


//subscriptionController
router.patch('/cancel-subscription/:creatorId', subscriptionController.expireSubscription.bind(subscriptionController))
router.get('/subscription-history', authenticateToken, subscriptionController.getCreatorHistory.bind(subscriptionController));
router.post('/buy-using-wallet', authenticateToken, subscriptionController.buyUsingWallet.bind(subscriptionController));
router.get('/subscription', authenticateToken, subscriptionController.getCreatorSubscription.bind(subscriptionController));
router.get('/all-subscriptions', subscriptionController.getAllSubscriptionPlan.bind(subscriptionController));
router.post('/buy-subscription', subscriptionController.createSubscriptionCheckout.bind(subscriptionController));


//eventProfileController
router.get('/post-details/:id', eventProfileController.getPostDetails.bind(eventProfileController));
router.get("/event-profile-info", eventProfileController.getProfileInfo.bind(eventProfileController));
router.get("/all-posts", eventProfileController.getAllPost.bind(eventProfileController));
router.post("/update-event-profile", eventProfileController.updateProfileInfo.bind(eventProfileController));
router.post("/update-profile-image",upload.single("profileImage"),eventProfileController.updateProfileImage.bind(eventProfileController));
router.post("/create",PostUpload.fields([{ name: "mainImage", maxCount: 1 },{ name: "additionalImages", maxCount: 4 },]),
  eventProfileController.PostEvent.bind(eventProfileController)
);


//AuthController
router.post("/sign-up", authController.signUp.bind(authController));
router.post("/login", (req, res) => authController.login(req, res))
router.post("/refresh-token", authController.refreshToken.bind(authController));
router.post("/logout", (req, res) => authController.logout(req, res));


//ProfileController
router.get("/profile-data", authenticateToken, checkBlocked, profileController.getProfile.bind(profileController));
router.put("/update-profile", authenticateToken, checkBlocked, profileController.updateProfile.bind(profileController));


//passwordController
router.post("/reset-password", passwordController.resetPassword.bind(passwordController));


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
        readable._read = () => {};
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
