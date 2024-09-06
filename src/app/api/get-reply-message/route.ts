import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !user) {
      return Response.json(
        { success: false, messages: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const allRepliedMessages = await UserModel.aggregate([
      {$match: {_id: userId}},
      {$unwind: '$messageReply'},
      {$sort: {'messageReply.createdAt': -1}},
      {$group: {_id: '$_id',messageReply: {$push: '$messageReply'}}}
  ]).exec()

  // console.log(allRepliedMessages);  
  console.log(allRepliedMessages[0].messageReply);  

    if (!allRepliedMessages) {
      return Response.json(
        { messages: "No replied message for this user", success: true },
        { status: 201 }
      );
    }
    return Response.json(
      {
        messages: "Message fetched successfully",
        message: allRepliedMessages[0].messageReply,
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