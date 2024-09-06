import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request){
    await dbConnect()

    const {username , content} = await request.json()
    // console.log(username);
    // console.log(content);
    try {
        const user = await UserModel.findOne({username}).exec()
        if (!user) {
            return Response.json(
                {
                    success: false,
                    messages: "User not found"
                },
                {status: 404}
            )
        }
        // console.log(user);
        

        //is user accepting the messages
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    messages: "User not accepting the messages"
                },
                {status: 403}
            )
        }

        const newMessage = {content , createdAt: new Date()}
        // console.log(newMessage);
        
        user.message.push(newMessage as Message)
        await user.save()
        // console.log(user);

        return Response.json(
            {
                success: true,
                messages: "Message sent sucessfully"
            },
            {status: 201}
        )
    } catch (error) {
        console.log("Error adding messages",error);

        return Response.json(
            {
                success: false,
                messages: "Internal server error"
            },
            {status: 500}
        )
        
    }

}