import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

export const sendOtpEmail = async(to: string, otp: string) => {
    const info = await transporter.sendMail({
        from: `"Notes App" <${process.env.SMTP_USER}>`,
        to,
        subject: "Your OTP code",
        text: `Your OTP for Notes App is ${otp}. It expires in ${Math.floor(Number(process.env.OTP_TTL_SECONDS ?? 300)/60)} minutes.`
  });
    return info;
}