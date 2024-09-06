import { Resend } from 'resend';

// console.log("hi");

export const resend = new Resend(process.env.RESEND_API_KEY);
