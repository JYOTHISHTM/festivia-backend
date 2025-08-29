import { Request, Response } from "express";
import { IChatService } from "../../services/interface/IChatService";
import { StatusCodes } from "../../enums/StatusCodes";
import { IChatController } from "../interface/IChatController";
import { ChatMessages } from "../../enums/StatusCodes";
import { generateRoomId } from "../../utils/chatUtils";



class ChatController implements IChatController {

  constructor(private readonly _chatService: IChatService) { }

  async getChatHistory(req: Request, res: Response) {
    const { roomId } = req.params;
    try {
      const messages = await this._chatService.getChatHistory(roomId);
      res.json(messages);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: ChatMessages.FAILED_TO_FETCH_MESSAGES });
    }
  }

  async getChatHistoryForCreator(req: Request, res: Response) {
    const { roomId } = req.params;
    try {
      const messages = await this._chatService.getChatHistoryForCreator(roomId);
      res.json(messages);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: ChatMessages.FAILED_TO_FETCH_MESSAGES });
    }
  }

  async getChatsForUser(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const chats = await this._chatService.getChatsForUser(userId);
      res.json(chats);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: ChatMessages.FAILED_TO_FETCH_CHATS });
    }
  }

  async getChatsForCreator(req: Request, res: Response) {
    const { creatorId } = req.params;
    try {
      const chats = await this._chatService.getChatsForCreator(creatorId);
      res.json(chats);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: ChatMessages.FAILED_TO_FETCH_CHATS });
    }
  }


  async initiateChat(req: Request, res: Response) {
    try {
      const { userId, creatorId } = req.body;
      if (!userId || !creatorId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: ChatMessages.MISSING_USER_OR_CREATOR_ID });
      }
      const roomId = generateRoomId(userId, creatorId);
      res.json({ roomId });
    } catch {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: ChatMessages.FAILED_TO_INITIATE_CHAT });
    }
  }


  async getUsersWhoMessagedCreator(req: Request, res: Response) {
    try {
      const creatorId = req.params.creatorId;
      const users = await this._chatService.getUsersWhoMessagedCreator(creatorId);
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ChatMessages.SERVER_ERROR });
    }
  }


}

export default ChatController