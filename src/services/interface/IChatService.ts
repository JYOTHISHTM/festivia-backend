import { SaveMessageDTO } from "../../dto/SaveMessageDTO";

export interface IChatService {
  saveMessage(data:SaveMessageDTO): Promise<any>; 

  getChatHistory(roomId: string): Promise<any[]>;

  getChatHistoryForCreator(roomId: string): Promise<any[]>;

  getChatsForUser(userId: string): Promise<any[]>;

  getChatsForCreator(creatorId: string): Promise<any[]>;

  getUsersWhoMessagedCreator(creatorId: string): Promise<any[]>;

}
