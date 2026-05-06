export const OTP_TEMPLATE = (name, otp) => {
  return `
    <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: auto; padding: 40px; background: #080808; border: 1px solid rgba(57,255,20,0.1); border-radius: 20px; color: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #39FF14; font-size: 28px; margin: 0; font-family: 'Syne', sans-serif;">AuraPost</h1>
      </div>
      <h2 style="color: #fff; text-align: center; font-size: 22px;">Reset Your Password</h2>
      <p style="font-size: 16px; color: #8b87a8; line-height: 1.6;">Hello ${name || 'there'},</p>
      <p style="font-size: 16px; color: #8b87a8; line-height: 1.6;">We received a request to reset your password. Use the verification code below to proceed. This code is valid for 10 minutes.</p>
      
      <div style="text-align: center; margin: 40px 0;">
        <div style="display: inline-block; background: rgba(57,255,20,0.1); border: 1px solid #39FF14; padding: 15px 30px; border-radius: 12px;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #39FF14; font-family: monospace;">${otp}</span>
        </div>
      </div>
      
      <p style="font-size: 14px; color: #4a4870; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
        <p style="font-size: 12px; color: #4a4870;">&copy; 2025 AuraPost. The future of social automation.</p>
      </div>
    </div>
  `;
};

export const WELCOME_TEMPLATE = (name) => {
  return `
    <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: auto; padding: 40px; background: #080808; border: 1px solid rgba(57,255,20,0.1); border-radius: 20px; color: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #39FF14; font-size: 28px; margin: 0; font-family: 'Syne', sans-serif;">AuraPost</h1>
      </div>
      <h2 style="color: #fff; text-align: center; font-size: 24px;">Welcome to the Future, ${name}!</h2>
      <p style="font-size: 16px; color: #8b87a8; line-height: 1.6;">We're thrilled to have you on board. AuraPost is designed to help you dominate social media with AI-powered automation.</p>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #39FF14; color: #000; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">Go to Dashboard</a>
      </div>
      
      <p style="font-size: 14px; color: #4a4870; text-align: center;">Ready to start creating?</p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
        <p style="font-size: 12px; color: #4a4870;">&copy; 2025 AuraPost. All rights reserved.</p>
      </div>
    </div>
  `;
};
