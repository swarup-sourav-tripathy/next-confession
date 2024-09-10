import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import { MessageReply } from "@/model/User";
import mongoose from "mongoose";
import UserModel from "@/model/User";
import { MessageReplyModel } from "@/model/User";

export async function POST(
  request: Request, {params}:{params:{messageid: string}}
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  // console.log(session);
  // console.log(user);

  // const userName = user.username
  // console.log(userName);
  

  if (!session || !user) {
    return Response.json(
      { success: false, messages: "Not authenticated" },
      { status: 401 }
    );
  }
  try {
    const { reply , userId} = await request.json();
    // console.log(reply);
    console.log(userId);

    const _user = await UserModel.findById(userId);
    const userName = _user?.username
    console.log(userName);
    
    
    const messageId = params.messageid;
    console.log(messageId);
    
    const targetedMessage = await UserModel.findOne(
      { "message._id": messageId },
      { "message.$": 1 }
    );

    console.log(targetedMessage);
    
    const repliedMessage = targetedMessage?.message[0];
    console.log(repliedMessage);
    

    const newReply = new MessageReplyModel({
     username: userName,
      content: repliedMessage?.content,
      reply,
      createdAt: new Date()
    }) as unknown as  MessageReply;

    const response = await newReply.save()
    console.log(response);
        

    return Response.json(
      { messages: "Replied successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error repling message:", error);
    return Response.json(
      { messages: "Error repling message", success: false },
      { status: 500 }
    );
  }
}

