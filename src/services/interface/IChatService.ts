import { SaveMessageDTO } from "../../dto/SaveMessageDTO";

export interface IChatService {
  saveMessage(data: SaveMessageDTO): Promise<object>;
  getChatHistory(roomId: string): Promise<object[]>;
  getChatHistoryForCreator(roomId: string): Promise<object[]>;
  getChatsForUser(userId: string): Promise<object[]>;
  getChatsForCreator(creatorId: string): Promise<object[]>;
  getUsersWhoMessagedCreator(creatorId: string): Promise<object[]>;
}

