const transport = require("./smtpTransport");
const { EMAIL_USER } = require("../config/index");

const sendOtpToUser = async (otp, email) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "🔐 Verify Your Email - OTP Inside",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .container {
            max-width: 500px;
            width: 100%;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          
          .header h1 {
            font-size: 28px;
            margin-bottom: 8px;
            font-weight: 700;
          }
          
          .header p {
            font-size: 14px;
            opacity: 0.9;
          }
          
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          
          .welcome-text {
            font-size: 16px;
            color: #333;
            margin-bottom: 30px;
            line-height: 1.6;
          }
          
          .otp-box {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 12px;
            padding: 30px 20px;
            margin: 30px 0;
            border: 2px solid #667eea;
          }
          
          .otp-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
            font-weight: 600;
          }
          
          .otp-code {
            font-size: 48px;
            font-weight: 800;
            color: #667eea;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            margin: 15px 0;
            user-select: all;
          }
          
          .otp-subtext {
            font-size: 13px;
            color: #999;
            margin-top: 15px;
          }
          
          .info-box {
            background: #f0f4ff;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 25px 0;
            border-radius: 6px;
            text-align: left;
          }
          
          .info-box p {
            font-size: 13px;
            color: #555;
            margin: 8px 0;
            line-height: 1.5;
          }
          
          .info-box strong {
            color: #667eea;
          }
          
          .footer {
            background: #f9f9f9;
            padding: 25px 30px;
            border-top: 1px solid #eee;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          
          .footer p {
            margin: 5px 0;
            line-height: 1.6;
          }
          
          .security-badge {
            display: inline-block;
            margin: 20px 0 0 0;
            padding: 8px 12px;
            background: #e8f5e9;
            border: 1px solid #4caf50;
            border-radius: 6px;
            font-size: 12px;
            color: #2e7d32;
            font-weight: 600;
          }
          
          .button-wrapper {
            margin: 30px 0;
          }
          
          .action-text {
            font-size: 14px;
            color: #666;
            margin: 20px 0;
          }
          
          @media (max-width: 600px) {
            .container {
              border-radius: 8px;
            }
            
            .content {
              padding: 25px 20px;
            }
            
            .otp-code {
              font-size: 36px;
              letter-spacing: 4px;
            }
            
            .header h1 {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Email Verification</h1>
            <p>Secure your account with a one-time code</p>
          </div>
          
          <div class="content">
            <p class="welcome-text">
              Hello! We're excited to have you join us. To complete your account setup, please verify your email address.
            </p>
            
            <div class="otp-box">
              <div class="otp-label">Your Verification Code</div>
              <div class="otp-code">${otp}</div>
              <div class="otp-subtext">This code will expire in <strong>30 minutes</strong></div>
            </div>
            
            <p class="action-text">
              Enter this code in the verification field to activate your account.
            </p>
            
            <div class="info-box">
              <p><strong>⏱️ Code Validity:</strong> This OTP expires in 30 minutes</p>
              <p><strong>🔒 Security:</strong> Never share this code with anyone</p>
              <p><strong>❌ Didn't Request?:</strong> Ignore this email if you didn't create an account</p>
            </div>
            
            <div class="security-badge">✓ 100% Secure & Encrypted</div>
          </div>
          
          <div class="footer">
            <p><strong>Need Help?</strong> Contact our support team at okwuosaoluchi95@gmail.com</p>
            <p>© 2024 InsightX. All rights reserved.</p>
            <p style="margin-top: 15px; font-size: 11px;">
              This is an automated email. Please do not reply directly to this message.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
        reject(error);
      } else {
        console.log("OTP sent successfully");
        resolve(info);
      }
    });
  });
};

//send password reset email
const sendPasswordResetEmail = async (resetPasswordToken, email) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "🔑 Reset Your Password",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            padding: 20px;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .container {
            max-width: 500px;
            width: 100%;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          
          .header h1 {
            font-size: 28px;
            margin-bottom: 8px;
            font-weight: 700;
          }
          
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          
          .welcome-text {
            font-size: 16px;
            color: #333;
            margin-bottom: 25px;
            line-height: 1.6;
          }
          
          .token-box {
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            border-radius: 12px;
            padding: 25px 20px;
            margin: 30px 0;
            border: 2px solid #f5576c;
          }
          
          .token-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
            font-weight: 600;
          }
          
          .token-code {
            font-size: 14px;
            font-weight: 700;
            color: #f5576c;
            word-break: break-all;
            font-family: 'Courier New', monospace;
            margin: 15px 0;
            user-select: all;
            background: white;
            padding: 12px;
            border-radius: 6px;
          }
          
          .warning-box {
            background: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin: 25px 0;
            border-radius: 6px;
            text-align: left;
          }
          
          .warning-box p {
            font-size: 13px;
            color: #e65100;
            margin: 5px 0;
          }
          
          .footer {
            background: #f9f9f9;
            padding: 25px 30px;
            border-top: 1px solid #eee;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          
          .footer p {
            margin: 5px 0;
            line-height: 1.6;
          }
          
          @media (max-width: 600px) {
            .container {
              border-radius: 8px;
            }
            
            .content {
              padding: 25px 20px;
            }
            
            .header h1 {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Password Reset</h1>
            <p>Reset your account password securely</p>
          </div>
          
          <div class="content">
            <p class="welcome-text">
              We received a request to reset your password. Use the token below to create a new password for your account.
            </p>
            
            <div class="token-box">
              <div class="token-label">Your Reset Token</div>
              <div class="token-code">${resetPasswordToken}</div>
            </div>
            
            <div class="warning-box">
              <p><strong>⚠️ Important:</strong> This token expires in 30 minutes</p>
              <p><strong>🔒 Security:</strong> Never share this token with anyone</p>
              <p><strong>❌ Didn't Request?:</strong> Ignore this email. Your password is still secure.</p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Need Help?</strong> Contact our support team at okwuosaoluchi95@gmail.com</p>
            <p>© 2024 InsightX. All rights reserved.</p>
            <p style="margin-top: 15px; font-size: 11px;">
              This is an automated email. Please do not reply directly to this message.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending password reset email:", error);
        reject(error);
      } else {
        console.log("Password reset email sent successfully");
        resolve(info);
      }
    });
  });
};

module.exports = { sendOtpToUser, sendPasswordResetEmail };