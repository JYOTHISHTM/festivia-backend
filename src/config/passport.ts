
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();

import AuthService from "../services/implementation/AuthService";
import UserRepository from "../repositories/implementation/UserRepository";
import CreatorRepository from "../repositories/implementation/CreatorRepository";
import AuthRepository from "../repositories/implementation/AuthRepository";
import  {OtpRepository}  from "../repositories/implementation/OtpRepository";
import  {PasswordHasher} from "../utils/passwordHasher";
import  {TokenService}  from "../utils/tokenService";

const userRepository = new UserRepository();
const creatorRepository = new CreatorRepository();
const authRepository = new AuthRepository();
const otpRepository= new OtpRepository()
const tokenService=new TokenService()
const passwordHasher=new PasswordHasher()
const authService = new AuthService(userRepository, creatorRepository, authRepository,otpRepository,passwordHasher,tokenService);


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_token, _refreshToken, profile, done) => {
      try {
        const user = await authService.findOrCreate(profile as any);

        if (!user) {
          return done(null, false);
        }

        done(null, user as Express.User);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

