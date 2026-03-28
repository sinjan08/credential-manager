export const templates = {
  welcome: `
  <div style="margin:0;padding:0;background:#f5f7fb;font-family:Segoe UI,Arial,sans-serif;">
    <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:24px;text-align:center;color:#fff;">
        <h1 style="margin:0;font-size:22px;font-weight:600;">Email Verification</h1>
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        <p style="font-size:15px;color:#333;">Hi {{name}},</p>
        
        <p style="font-size:15px;color:#555;line-height:1.6;">
          Thanks for getting started. To complete your verification, please use the one-time password (OTP) below.
        </p>

        <!-- OTP Box -->
        <div style="text-align:center;margin:30px 0;">
          <div style="
            display:inline-block;
            padding:16px 28px;
            font-size:30px;
            font-weight:700;
            letter-spacing:8px;
            color:#4f46e5;
            background:#eef2ff;
            border-radius:10px;
          ">
            {{otp}}
          </div>
        </div>

        <p style="font-size:14px;color:#666;text-align:center;">
          This OTP is valid for <strong>10 minutes</strong>.
        </p>

        <p style="font-size:14px;color:#777;line-height:1.6;margin-top:25px;">
          If you didn’t request this, you can safely ignore this email. No further action is required.
        </p>

        <p style="font-size:14px;color:#333;margin-top:25px;">
          Cheers,<br/>
          <strong>The Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="padding:16px;text-align:center;background:#f9fafb;font-size:12px;color:#999;">
        This is an automated message. Please do not reply.
      </div>
    </div>
  </div>
  `,

  forgot: `
  <div style="margin:0;padding:0;background:#f5f7fb;font-family:Segoe UI,Arial,sans-serif;">
    <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#ef4444,#dc2626);padding:24px;text-align:center;color:#fff;">
        <h1 style="margin:0;font-size:22px;font-weight:600;">Password Reset</h1>
      </div>

      <!-- Body -->
      <div style="padding:30px;">
        <p style="font-size:15px;color:#333;">Hi {{name}},</p>
        
        <p style="font-size:15px;color:#555;line-height:1.6;">
          We received a request to reset your password. Use the OTP below to proceed securely.
        </p>

        <!-- OTP Box -->
        <div style="text-align:center;margin:30px 0;">
          <div style="
            display:inline-block;
            padding:16px 28px;
            font-size:30px;
            font-weight:700;
            letter-spacing:8px;
            color:#dc2626;
            background:#fee2e2;
            border-radius:10px;
          ">
            {{otp}}
          </div>
        </div>

        <p style="font-size:14px;color:#666;text-align:center;">
          This OTP will expire in <strong>10 minutes</strong>.
        </p>

        <p style="font-size:14px;color:#777;line-height:1.6;margin-top:25px;">
          If you didn’t request a password reset, please ignore this email. Your account remains secure.
        </p>

        <p style="font-size:14px;color:#333;margin-top:25px;">
          Regards,<br/>
          <strong>Support Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="padding:16px;text-align:center;background:#f9fafb;font-size:12px;color:#999;">
        This is an automated message. Please do not reply.
      </div>
    </div>
  </div>
  `
};