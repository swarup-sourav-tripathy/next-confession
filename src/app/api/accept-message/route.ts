import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();
    // console.log("ok");
    
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  // console.log(session);
  // console.log(user);
  

  if (!session || !session.user) {
    return Response.json(
      { success: false, messages: 'Not authenticated' },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  // console.log(userId);
  
  const { acceptMessages } = await request.json();
  // console.log(acceptMessages); 

  try {
    // Update the user's message acceptance status
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    // console.log(updatedUser);
    

    if (!updatedUser) {
      // User not found
      return Response.json(
        {
          success: false,
          messages: 'Unable to find user to update message acceptance status',
        },
        { status: 404 }
      );
    }

    // Successfully updated message acceptance status
    return Response.json(
      {
        success: true,
        messages: 'Message acceptance status updated successfully',
        updatedUser,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating message acceptance status:', error);
    return Response.json(
      { success: false, messages: 'Error updating message acceptance status' },
      { status: 500 }
    );
  }
}


export async function GET(request: Request) {
  // Connect to the database
  await dbConnect();

  // Get the user session
  const session = await getServerSession(authOptions);
  const user:User = session?.user as User;
  
  // console.log(session);
  // console.log(user);

  // Check if the user is authenticated
  if (!session || !user) {
    return Response.json(
      { success: false, messages: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Retrieve the user from the database using the ID
    const foundUser = await UserModel.findById(user._id);
    // console.log(foundUser);
    

    if (!foundUser) {
      // User not found
      return Response.json(
        { success: false, messages: 'User not found' },
        { status: 404 }
      );
    }

    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error retrieving message acceptance status:', error);
    return Response.json(
      { success: false, messages: 'Error retrieving message acceptance status' },
      { status: 500 }
    );
  }
}