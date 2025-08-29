import cloudinary from "../config/cloudinary";
import multer from "multer";

import AuthRepository from "../repositories/implementation/AuthRepository";
import EventRepository from "../repositories/implementation/EventRepository";
import UserRepository from "../repositories/implementation/UserRepository";
import CreatorRepository from "../repositories/implementation/CreatorRepository";
import ProfileRepository from "../repositories/implementation/ProfileRepository";
import EventProfileRepository from "../repositories/implementation/EventProfileRepository";
import ChatRepository from "../repositories/implementation/ChatRepository";
import WalletRepository from "../repositories/implementation/WalletRepository";
import TicketRepository from "../repositories/implementation/TicketRepository";
import PasswordRepository from "../repositories/implementation/PasswordRepository";

import AuthService from "../services/implementation/AuthService";
import EventService from "../services/implementation/EventService";
import ProfileService from "../services/implementation/ProfileService";
import EventProfileService from "../services/implementation/EventProfileService";
import ChatService from "../services/implementation/ChatService";
import WalletService from "../services/implementation/WalletService";
import PasswordService from "../services/implementation/PasswordService";
import OtpService from "../services/implementation/OtpService";
import UserService from "../services/implementation/UserService";

import AuthController from "../controllers/implementation/AuthController";
import EventController from "../controllers/implementation/EventController";
import ProfileController from "../controllers/implementation/ProfileController";
import EventProfileController from "../controllers/implementation/EventProfileController";
import ChatController from "../controllers/implementation/ChatController";
import WalletController from "../controllers/implementation/WalletController";
import PasswordController from "../controllers/implementation/PasswordController";
import OtpController from "../controllers/implementation/OtpController";
import UserController from "../controllers/implementation/UserController";
import { OtpRepository } from "../repositories/implementation/OtpRepository";
import { PasswordHasher } from "../utils/passwordHasher";
import { TokenService } from "../utils/tokenService";

export const userDependencies = () => {
  const authRepository = new AuthRepository();
  const eventRepository = new EventRepository();
  const userRepository = new UserRepository();
  const creatorRepository = new CreatorRepository();
  const profileRepository = new ProfileRepository(creatorRepository, userRepository);
  const eventProfileRepository = new EventProfileRepository();
  const chatRepository = new ChatRepository();
  const walletRepository = new WalletRepository();
  const ticketRepository = new TicketRepository();
  const passwordRepository = new PasswordRepository();
  const otpRepository = new OtpRepository()
  const tokenService = new TokenService()
  const passwordHasher = new PasswordHasher()

  const authService = new AuthService(userRepository, creatorRepository, authRepository, otpRepository, passwordHasher, tokenService);
  const eventService = new EventService(userRepository, eventRepository, ticketRepository);
  const profileService = new ProfileService(profileRepository);
  const eventProfileService = new EventProfileService(eventProfileRepository);
  const chatService = new ChatService(chatRepository, userRepository);
  const walletService = new WalletService(walletRepository, ticketRepository, userRepository, creatorRepository);
  const passwordService = new PasswordService(passwordRepository);
  const otpService = new OtpService(userRepository, creatorRepository, authRepository,otpRepository);
  const userService = new UserService(userRepository);

  const authController = new AuthController(authService);
  const eventController = new EventController(eventService);
  const profileController = new ProfileController(profileService);
  const eventProfileController = new EventProfileController(eventProfileService);
  const chatController = new ChatController(chatService);
  const walletController = new WalletController(walletService);
  const passwordController = new PasswordController(passwordService);
  const otpController = new OtpController(otpService);
  const userController = new UserController(userService);

  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  return {
    authController,
    eventController,
    profileController,
    eventProfileController,
    chatController,
    walletController,
    passwordController,
    otpController,
    userController,
    cloudinary,
    upload
  };
};
