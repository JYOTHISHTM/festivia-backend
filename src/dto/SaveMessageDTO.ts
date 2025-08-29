//dto/SaveMessageDto

export interface ReplyToDTO {
  messageId: string;
  message: string;
  sender: string;
  mediaType?: string;
  mediaName?: string;
}

export interface SaveMessageDTO {
  roomId: string;
  sender: string;
  message: string;
  userId?: string;
  creatorId?: string;
  mediaType?: string;
  mediaUrl?: string;
  mediaName?: string;
  mediaSize?: number;
  replyTo?: ReplyToDTO;
}
