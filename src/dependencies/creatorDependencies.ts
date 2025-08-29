// src/dependencies/creatorDependencies.ts
import dotenv from 'dotenv';
import cloudinary from '../config/cloudinary';
import multer from 'multer';

import AuthService from "../services/implementation/AuthService";
import AuthRepository from "../repositories/implementation/AuthRepository";
import EventRepository from "../repositories/implementation/EventRepository";
import UserRepository from "../repositories/implementation/UserRepository";
import CreatorRepository from "../repositories/implementation/CreatorRepository";
import CreatorService from "../services/implementation/CreatorService";
import SubscriptionRepository from "../repositories/implementation/SubscriptionRepository";
import EventService from "../services/implementation/EventService";
import ProfileRepository from "../repositories/implementation/ProfileRepository";
import ProfileService from "../services/implementation/ProfileService";
import EventProfileRepository from "../repositories/implementation/EventProfileRepository";
import EventProfileService from "../services/implementation/EventProfileService";
import ChatRepository from "../repositories/implementation/ChatRepository";
import ChatService from "../services/implementation/ChatService";
import SubscriptionService from "../services/implementation/SubscriptionService";
import WalletRepository from "../repositories/implementation/WalletRepository";
import WalletService from "../services/implementation/WalletService";
import TicketRepository from "../repositories/implementation/TicketRepository";
import TicketService from "../services/implementation/TicketService";
import PasswordRepository from "../repositories/implementation/PasswordRepository";
import PasswordService from "../services/implementation/PasswordService";
import OtpService from "../services/implementation/OtpService";
import SeatLayoutRepository from "../repositories/implementation/SeatLayoutRepository";
import SeatLayoutService from "../services/implementation/SeatLayoutService";

import AuthController from "../controllers/implementation/AuthController";
import CreatorController from "../controllers/implementation/CreatorController";
import EventController from "../controllers/implementation/EventController";
import ProfileController from "../controllers/implementation/ProfileController";
import EventProfileController from "../controllers/implementation/EventProfileController";
import ChatController from "../controllers/implementation/ChatController";
import SubscriptionController from "../controllers/implementation/SubscriptionController";
import WalletController from "../controllers/implementation/WalletController";
import TicketController from "../controllers/implementation/TicketController";
import PasswordController from "../controllers/implementation/PasswordController";
import OtpController from "../controllers/implementation/OtpController";
import SeatLayoutController from "../controllers/implementation/SeatLayoutController";
import  {OtpRepository}  from "../repositories/implementation/OtpRepository";
import  {PasswordHasher} from "../utils/passwordHasher";
import  {TokenService}  from "../utils/tokenService";
import {  StripeService } from "../services/implementation/StripeService";

dotenv.config();

export const creatorDependencies = () => {
  const authRepository = new AuthRepository();
  const subscriptionRepository = new SubscriptionRepository();
  const eventRepository = new EventRepository();
  const userRepository = new UserRepository();
  const creatorRepository = new CreatorRepository();
  const profileRepository = new ProfileRepository(creatorRepository, userRepository);
  const eventProfileRepository = new EventProfileRepository();
  const chatRepository = new ChatRepository();
  const walletRepository = new WalletRepository();
  const ticketRepository = new TicketRepository();
  const passwordRepository = new PasswordRepository();
const otpRepository= new OtpRepository()
const tokenService=new TokenService()
const passwordHasher=new PasswordHasher()
const stripeService=new StripeService()


  const authService = new AuthService(userRepository, creatorRepository, authRepository,otpRepository,passwordHasher,tokenService);
  const creatorService = new CreatorService(creatorRepository);
  const eventService = new EventService(userRepository, eventRepository,ticketRepository);
  const profileService = new ProfileService(profileRepository);
  const eventProfileService = new EventProfileService(eventProfileRepository);
  const chatService = new ChatService(chatRepository,userRepository);
  const subscriptionService = new SubscriptionService(subscriptionRepository,stripeService);
  const walletService = new WalletService(walletRepository, ticketRepository,userRepository,creatorRepository);
  const ticketService = new TicketService(ticketRepository);
  const passwordService = new PasswordService(passwordRepository);
  const otpService = new OtpService(userRepository, creatorRepository, authRepository,otpRepository);
  const layoutRepo = new SeatLayoutRepository();
  const layoutService = new SeatLayoutService(layoutRepo);

  const authController = new AuthController(authService);
  const creatorController = new CreatorController(creatorService);
  const eventController = new EventController(eventService);
  const profileController = new ProfileController(profileService);
  const eventProfileController = new EventProfileController(eventProfileService);
  const chatController = new ChatController(chatService);
  const subscriptionController = new SubscriptionController(subscriptionService);
  const walletController = new WalletController(walletService);
  const ticketController = new TicketController(ticketService);
  const passwordController = new PasswordController(passwordService);
  const otpController = new OtpController(otpService);
  const seatLayoutController = new SeatLayoutController(layoutService);

  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  return {
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
  };
};
