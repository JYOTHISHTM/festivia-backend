//utils/mailer

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
    rejectUnauthorized: false, 
  },
    });
    const mailOptions = {
      from: `"FESTIVIA" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Failed to send email");
  }
};

// export const OTP_EMAIL_TEMPLATE = (otp: string) => ({
//   subject: "Your OTP Code",
//   message: `Your OTP is 444444: ${otp}`,
// });

export const OTP_EMAIL_TEMPLATE = (otp: string) => ({
  subject: "FESTIVIA - Your OTP Code",
  message: `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; text-align: center;">
    <div style="background-color: #ffffff; max-width: 500px; margin: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 30px;">
      
      <h2 style="color: #4CAF50; margin-bottom: 20px;">🔐 Verify Your Email</h2>
      
      <p style="font-size: 16px; color: #333;">Hello,</p>
      <p style="font-size: 16px; color: #333;">Use the following One-Time Password (OTP) to complete your verification:</p>
      
      <div style="margin: 25px 0;">
        <span style="font-size: 22px; font-weight: bold; letter-spacing: 4px; color: #000; background: #f4f4f4; padding: 12px 20px; border-radius: 6px; display: inline-block;">
          ${otp}
        </span>
      </div>

      <p style="font-size: 14px; color: #777;">⚠️ This OTP is valid for <b>1 minute</b>. Please do not share it with anyone.</p>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      
      <p style="font-size: 12px; color: #aaa;">If you didn’t request this, you can safely ignore this email.</p>
    </div>
  </div>
  `,
});


export const CREATOR_APPROVAL_EmailTemplates = {
  CREATOR_APPROVAL: (name: string) => ({
    subject: "Your Creator Account Has Been Approved!",
    message: `Hello ${name},\n\nYour request to become a creator has been approved.\n\nYou may now log in and start creating events!\n\nThank you,\nFestivia Team`
  }),
};


export const CREATOR_REJECTION_EmailTemplates = {
  CREATOR_REJECTION: (name: string, reason: string) => ({
    subject: "Your Creator Account Has Been Rejected",
    message: `Hello ${name},\n\nWe regret to inform you that your request to become a creator was rejected.\n\nReason: ${reason}\n\nIf you believe this was a mistake or have questions, please contact us.\n\nThank you,\nFestivia Team`
  })
};
