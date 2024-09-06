"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "./ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import dayjs from 'dayjs'
import { Textarea } from "./ui/textarea";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useState } from "react";


type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}


export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    const { toast } = useToast()
    const { data: session } = useSession();
    const user : User = session?.user as User;
    const [reply, setReply] = useState("")

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            toast({
                title: response.data.messages
            })
            onMessageDelete(message._id)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.messages ?? 'Failed to delete message',
                variant: 'destructive',
            });
        }
    }

    const onSubmit = async() => {
        try {
            const response = await axios.post<ApiResponse>(
                `/api/reply-message/${message._id}`, {
                  reply,
                  userId: user._id
                }
              );
              console.log(response);
              toast({
                title: response.data?.messages || "Error in reply message",
              });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.messages ?? 'Failed to send messsage',
                variant: 'destructive',
            });
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>{message.content}</CardTitle>
                <CardDescription className="my-3 py-5">{dayjs(message.createdAt).format('MMM DD, YYYY hh:mm A')}</CardDescription>
                <div className="w-7 h-7 flex ">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>

                            <Button variant="destructive"><X className="w-5 h-5 " /></Button>

                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    message and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>

                            <Button className="mx-3" variant="default">Answer</Button>

                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you want to reply?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This reply will stored in "Reply" page where sender can find his/her reply!
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                           
                           <AlertDialogFooter className="flex flex-wrap flex-col">
                                <Textarea
                                    value={reply} onChange={(e) => setReply(e.target.value)}
                                    placeholder="Write your reply..."
                                    className="resize-none"

                                />
                                <div className="relative top-3 left-5 ">
                                <AlertDialogCancel className="h-15">Cancel</AlertDialogCancel>
                                <AlertDialogAction className="mx-4 h-15" onClick={onSubmit}>Send</AlertDialogAction>
                                </div>
                            </AlertDialogFooter>
                           
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <CardContent>
            </CardContent>

        </Card>

    );
}

