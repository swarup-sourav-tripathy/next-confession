import dbConnect from "@/lib/dbConnect";
import { MessageReplyModel } from "@/model/User";
import mongoose from "mongoose";
import { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(request: Request ,
 {params}:{params:{username: string}}
) {
  await dbConnect();
  try {
    const username = params.username
    const allRepliedMessages = await MessageReplyModel.find({username: username})

  console.log(allRepliedMessages);  
  // console.log(allRepliedMessages[0]);  

    if (!allRepliedMessages) {
      return Response.json(
        { messages: "No replied message for this user", success: true },
        { status: 201 }
      );
    }
    return Response.json(
      {
        messages: "Message fetched successfully",
        message: allRepliedMessages,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching message:", error);
    return Response.json(
      { messages: "Error fetching message", success: false },
      { status: 401 }
    );
  }
}