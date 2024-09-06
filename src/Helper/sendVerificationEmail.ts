import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: '',
            to: email,
            subject: 'Mystry message | Verification code',
            react: VerificationEmail({username , otp: verifyCode}),
          });

        return {success: true, messages: 'Verification email send successfully'}
    } catch (emailError) {
        console.log("Error sending verification email",emailError);

        return {success: false, messages: 'Failed to send verification email'}
    }
}