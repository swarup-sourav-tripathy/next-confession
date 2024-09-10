import mongoose , {Schema , Document} from "mongoose";


export interface Message extends Document{
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
})


export interface MessageReply extends Document {
    username: string;
    content: string;
    reply: string;
    createdAt: Date;
  }
  
  const MessageReplySchema: Schema<MessageReply> = new Schema({
    username:{
        type: String,
        required: true
    },
    content: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      required: true,
    },
    createdAt:{
      type: Date,
      required: true,
      default: Date.now
    }
  });


export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    message: Message[];
    
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true,        
    },
    email:{
        type: String,
        required: [true, "Username is required"],
        unique: true, 
        match: [/.+\@.+\..+/, 'please use a valid email address']
    },
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code Expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: false
    },
    message: [MessageSchema],
    
})

const UserModel = (mongoose.models.User as mongoose.Model<User> ) || mongoose.model<User>("User", UserSchema)
export const MessageReplyModel = (mongoose.models.MessageReply as mongoose.Model<MessageReply> ) || mongoose.model<MessageReply>("MessageReply", MessageReplySchema)


export default UserModel;


