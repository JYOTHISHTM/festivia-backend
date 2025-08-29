import AdminController from "../controllers/implementation/AdminController";
import AdminService from "../services/implementation/AdminService";
import UserRepository from "../repositories/implementation/UserRepository";
import CreatorRepository from "../repositories/implementation/CreatorRepository";
import AdminRepository from "../repositories/implementation/AdminRepository";
import EventController from "../controllers/implementation/EventController";
import SubscriptionController from "../controllers/implementation/SubscriptionController";
import AdminUserController from "../controllers/implementation/AdminUserController";
import AdminUserService from "../services/implementation/AdminUserService";
import EventRepository from "../repositories/implementation/EventRepository";
import EventService from "../services/implementation/EventService";
import SubscriptionRepository from "../repositories/implementation/SubscriptionRepository";
import SubscriptionService from "../services/implementation/SubscriptionService";
import AdminCreatorController from "../controllers/implementation/AdminCreatorController";
import AdminCreatorService from "../services/implementation/AdminCreatorService";
import AdminSubscriptionController from "../controllers/implementation/AdminSubscriptionController";
import AdminSubscriptionService from "../services/implementation/AdminSubscriptionService";
import TicketRepository from "../repositories/implementation/TicketRepository";
import {  StripeService } from "../services/implementation/StripeService";

export const initializeAdminControllers = () => {
  const userRepository = new UserRepository(); 
  const creatorRepository = new CreatorRepository();
  const adminRepository = new AdminRepository();
  const eventRepository = new EventRepository();
  const subscriptionRepository = new SubscriptionRepository();
const ticketRepository=new TicketRepository()
const stripeService=new StripeService()
  const adminUserService = new AdminUserService(userRepository);
  const adminCreatorService = new AdminCreatorService( creatorRepository, adminRepository);
  const eventService = new EventService(userRepository, eventRepository,ticketRepository);
  const subscriptionService = new SubscriptionService(subscriptionRepository,stripeService);
  const adminService = new AdminService(userRepository, creatorRepository, adminRepository);
  const adminSubscriptionService = new AdminSubscriptionService(adminRepository);

  const adminController = new AdminController(adminService); 
  const eventController = new EventController(eventService);
  const subscriptionController = new SubscriptionController(subscriptionService);
  const adminUserController = new AdminUserController(adminUserService); 
  const adminCreatorController = new AdminCreatorController(adminCreatorService);
  const adminSubscriptionController = new AdminSubscriptionController(adminSubscriptionService);

  return {
    adminController,
    adminUserController,
    adminCreatorController,
    eventController,
    subscriptionController,
    adminSubscriptionController
  };
};
