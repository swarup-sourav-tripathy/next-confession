import { Message, MessageReply } from "@/model/User";

export interface ApiResponse{
    success: boolean;
    messages: string;
    isAcceptingMessage?: boolean;
    message?: Array<Message>
    messageReply?: Array<MessageReply>
}