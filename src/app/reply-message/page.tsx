"use client"

import ReplyCard from "@/components/ReplyCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

interface Message {
    content: string;
    reply: string;
}


const ReplyBox = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession();
    const fetchALlMessage = useCallback(
        async (refresh: boolean = false) => {
            try {
                setLoading(true)
                const response = await axios.get<ApiResponse>(`/api/get-reply-message/`);
                const newMessages: any = response.data.message
                setMessages(newMessages);
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast({
                    title: 'Error',
                    description:
                        axiosError.response?.data.messages ?? 'Failed to fetch messages',
                    variant: 'destructive',
                });
                console.log(error);
            } finally {
                setLoading(false)
            }
        }, [session]
    )

    useEffect(() => {
        fetchALlMessage()
    }, [fetchALlMessage])

    return (
        <>
            <>
                <div className="flex justify-center items-center flex-wrap ">
                    {loading ?
                        <div className="flex flex-wrap flex-row justify-around my-3">
                            <div className="flex flex-col mx-10"> 
                                <Skeleton className="w-[550px] h-[125px] rounded m-3" />
                                <Skeleton className="w-[550px] h-[125px] rounded m-3" />
                                <Skeleton className="w-[550px] h-[125px] rounded m-3" />
                                <Skeleton className="w-[550px] h-[125px] rounded m-3" />
                            </div>
                            <div className="flex flex-col">  
                                <Skeleton className="w-[550px] h-[125px] rounded m-3" />
                                <Skeleton className="w-[550px] h-[125px] rounded m-3" />
                                <Skeleton className="w-[550px] h-[125px] rounded m-3" />
                                <Skeleton className="w-[550px] h-[125px] rounded m-3" />
                            </div>
                        </div>
                        :
                        messages.length > 0 ? (
                            messages.map((message, index) => (
                                <ReplyCard key={index} question={message?.content} answer={message?.reply} />
                            ))
                        ) : (
                            <>
                                <div className="flex items-center justify-center h-screen">
                                    <div className="text-gray-500 dark:text-gray-400 text-2xl font-medium">
                                        <span className="inline-block animate-[typing_2s_steps(20)_infinite]">No Replied Messages</span>
                                    </div>
                                </div>
                            </>
                        )}
                </div>
            </>

        </>
    );
}

export default ReplyBox