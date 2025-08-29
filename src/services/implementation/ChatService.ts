import { IChatRepository } from "../../repositories/interface/IChatRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { IChatService } from "../interface/IChatService";
import { SaveMessageDTO } from "../../dto/SaveMessageDTO";
import { ChatMessages } from "../../enums/StatusCodes"




class ChatService implements IChatService {
  constructor(
    private readonly _chatRepository: IChatRepository,
    private readonly _userRepository: IUserRepository
  ) { }


  async saveMessage(data: SaveMessageDTO) {
    if (data.replyTo) {
      const originalMessage = await this._chatRepository.findMessageById(data.replyTo.messageId);
      if (!originalMessage) throw new Error(ChatMessages.ORIGINAL_MESSAGE_NOT_FOUND);
      if (originalMessage.roomId !== data.roomId) {
        throw new Error(ChatMessages.CANNOT_REPLY_TO_DIFFERENT_ROOM);
      }
    }

    return await this._chatRepository.saveMessage(data);
  }

  async getChatHistory(roomId: string) {
    return await this._chatRepository.getMessagesByRoomId(roomId);
  }
  async getChatHistoryForCreator(roomId: string) {
    return await this._chatRepository.getMessagesByRoomIdForCreator(roomId);
  }

  async getChatsForUser(userId: string) {
    return await this._chatRepository.getUniqueChats(userId);
  }
  async getChatsForCreator(creatorId: string) {
    return await this._chatRepository.getUniqueChatsForCreator(creatorId);
  }

  static generateRoomId(userId: string, creatorId: string) {
    const sortedIds = [userId, creatorId].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
  }

  async getUsersWhoMessagedCreator(creatorId: string) {
    const senderIds = await this._chatRepository.getUniqueSendersForCreator(creatorId);
    return await this._userRepository.getUsersByIds(senderIds);
  }
}

export default ChatService