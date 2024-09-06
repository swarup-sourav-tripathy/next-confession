import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    // console.log("ok");
    // console.log(user);
    // console.log(session);
    
    if(!session || !user){
        return Response.json(
            {
                success: false,
                messages: "Not Authenticated"
            },
            {status: 401}
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    // console.log(userId);
    
    try {
        const user = await UserModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: '$message'},
            {$sort: {'message.createdAt': -1}},
            {$group: {_id: '$_id',message: {$push: '$message'}}}
        ]).exec()
        // console.log(user);
         

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    messages: "No anonymus messages"
                },
                {status: 404}
            )
        }

        // console.log(user[0].message);

        return Response.json(
            {
                success: true,
                message: user[0].message
            },
            {status: 200}
        )

    } catch (error) {
        console.log("An unexpected error occured: ",error);
        return Response.json(
            {
                success: false,
                messages: "Not authentication"
            },
            {status: 500}
        )
    }
}