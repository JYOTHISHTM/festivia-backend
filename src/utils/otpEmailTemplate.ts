//src/utils/otptemplate

export const OTP_EMAIL_TEMPLATE = (otp: string) => ({
  subject: "FESTIVIA - Your OTP Code",
  message: `
    <div style="
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        padding: 20px;
        text-align: center;
    ">
      <div style="
          background-color: #ffffff;
          max-width: 500px;
          margin: auto;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 20px;
      ">
        <h1 style="color: #6C63FF; margin-bottom: 10px;">FESTIVIA</h1>
        <p style="font-size: 16px; color: #333;">
          Your One-Time Password (OTP) for verification is:
        </p>
        <h2 style="
            font-size: 28px;
            color: #000;
            background-color: #f0f0f0;
            padding: 10px 20px;
            display: inline-block;
            border-radius: 6px;
            letter-spacing: 4px;
        ">
          ${otp}
        </h2>
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          This OTP will expire in 10 minutes. Do not share it with anyone.
        </p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #aaa;">
          © ${new Date().getFullYear()} FESTIVIA. All rights reserved.
        </p>
      </div>
    </div>
  `,
});
