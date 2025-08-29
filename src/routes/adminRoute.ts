import { Router } from "express";
import { authenticateToken } from "../middleware/admin/authMiddleware";
import { initializeAdminControllers } from "../dependencies/adminDependencies";

const router = Router();
const {
  adminController,
  adminUserController,
  adminCreatorController,
  eventController,
  subscriptionController,
  adminSubscriptionController
} = initializeAdminControllers();

//adminUserController
router.get("/users", adminUserController.getUsers.bind(adminUserController));
router.put("/toggle-block/:userId", authenticateToken, adminUserController.blockUser.bind(adminUserController));


//adminCreatorController
router.put("/approve-creator/:creatorId", adminCreatorController.approveCreator.bind(adminCreatorController));
router.get("/creators", adminCreatorController.getCreatorsbySearch.bind(adminCreatorController));
router.get("/pending-creators", adminCreatorController.getPendingCreators.bind(adminCreatorController));
router.put("/reject-creator/:creatorId", adminCreatorController.rejectCreator.bind(adminCreatorController));
router.get("/creator-status/:creatorId", adminCreatorController.getCreatorStatus.bind(adminCreatorController));
router.put("/creator-reapply/:id", adminCreatorController.reapplyCreator.bind(adminCreatorController));
router.get("/creator", adminCreatorController.getCreators.bind(adminCreatorController));
router.put("/toggle-block-creator/:creatorId", authenticateToken, adminCreatorController.blockCreator.bind(adminCreatorController));

//adminController
router.get("/dashboard", adminController.getDashboardData.bind(adminController));
router.post("/login", adminController.login.bind(adminController));
router.post("/logout", adminController.logout.bind(adminController));



//subscriptionController
router.get("/subscriptions-history", subscriptionController.getSubscriptionHistory.bind(subscriptionController));

//adminSubscriptionController
router.get("/all-subscriptions", adminSubscriptionController.getSubscriptionPlan.bind(adminSubscriptionController));
router.post("/create-subscription", adminSubscriptionController.createSubscription.bind(adminSubscriptionController));
router.delete("/delete-subscription/:id", adminSubscriptionController.deleteSubscription.bind(adminSubscriptionController));

//eventController
router.get("/public-events", eventController.getAllEvents.bind(eventController));

export default router;



