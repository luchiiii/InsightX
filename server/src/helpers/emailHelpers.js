const transport = require("./smtpTransport");
const { EMAIL_USER } = require("../config/index");

const sendOtpToUser = async (otp, email) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Verify Your Email - OTP",
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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          
          .brand-color {
            color: #667eea;
          }
          
          .brand-bg {
            background-color: #667eea;
          }
          
          .brand-border {
            border-color: #667eea;
          }
          
          .header h1 {
            font-size: 24px;
            margin-bottom: 8px;
            font-weight: 600;
            letter-spacing: -0.5px;
          }
          
          .header p {
            font-size: 14px;
            opacity: 0.9;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .greeting {
            font-size: 15px;
            color: #333;
            line-height: 1.6;
            margin-bottom: 25px;
          }
          
          .otp-section {
            background: #f9f9f9;
            border-left: 4px solid #667eea;
            padding: 25px;
            margin: 30px 0;
            border-radius: 4px;
          }
          
          .otp-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          
          .otp-code {
            font-size: 42px;
            font-weight: 700;
            color: #667eea;
            letter-spacing: 6px;
            font-family: 'Monaco', 'Courier New', monospace;
            text-align: center;
            margin: 15px 0;
            user-select: all;
            background: white;
            padding: 15px;
            border-radius: 4px;
          }
          
          .otp-validity {
            font-size: 12px;
            color: #999;
            text-align: center;
            margin-top: 12px;
          }
          
          .info-box {
            background: #f0f4ff;
            border-radius: 4px;
            padding: 16px;
            margin: 25px 0;
          }
          
          .info-box p {
            font-size: 13px;
            color: #555;
            margin: 10px 0;
            line-height: 1.6;
          }
          
          .info-box strong {
            color: #667eea;
            font-weight: 600;
          }
          
          .security-note {
            font-size: 12px;
            color: #d32f2f;
            font-weight: 600;
            margin-top: 15px;
          }
          
          .footer {
            background: #fafafa;
            padding: 25px 30px;
            border-top: 1px solid #eee;
            text-align: center;
          }
          
          .footer-text {
            font-size: 12px;
            color: #999;
            margin: 8px 0;
            line-height: 1.5;
          }
          
          .divider {
            height: 1px;
            background: #eee;
            margin: 15px 0;
          }
          
          @media (max-width: 600px) {
            .content {
              padding: 25px 20px;
            }
            
            .otp-code {
              font-size: 32px;
              letter-spacing: 4px;
            }
            
            .header h1 {
              font-size: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
            <p>Secure your InsightX account</p>
          </div>
          
          <div class="content">
            <p class="greeting">
              Hello,<br><br>
              Thank you for signing up with InsightX. Please verify your email address to activate your account using the verification code below.
            </p>
            
            <div class="otp-section">
              <div class="otp-label">Your Verification Code</div>
              <div class="otp-code">${otp}</div>
              <div class="otp-validity">This code will expire in 30 minutes</div>
            </div>
            
            <div class="info-box">
              <p><strong>Code Validity:</strong> This OTP expires in 30 minutes. Do not share it with anyone.</p>
              <p><strong>Security:</strong> InsightX will never ask for this code via email or phone.</p>
              <p><strong>Not You?</strong> If you didn't create this account, please ignore this email.</p>
              <p class="security-note">Keep this code confidential. Do not share it with anyone.</p>
            </div>
            
            <p style="font-size: 13px; color: #666; line-height: 1.6;">
              Enter this code in the verification field to complete your account setup and start using InsightX.
            </p>
          </div>
          
          <div class="footer">
            <div class="footer-text"><strong>Need Help?</strong> Contact us at support@insightx.com</div>
            <div class="divider"></div>
            <div class="footer-text">© 2024 InsightX. All rights reserved.</div>
            <div class="footer-text" style="font-size: 11px; margin-top: 10px;">
              This is an automated email. Please do not reply directly to this message.
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

const sendPasswordResetEmail = async (resetPasswordToken, email) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          
          .header h1 {
            font-size: 24px;
            margin-bottom: 8px;
            font-weight: 600;
            letter-spacing: -0.5px;
          }
          
          .header p {
            font-size: 14px;
            opacity: 0.9;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .greeting {
            font-size: 15px;
            color: #333;
            line-height: 1.6;
            margin-bottom: 25px;
          }
          
          .token-section {
            background: #f9f9f9;
            border-left: 4px solid #f5576c;
            padding: 25px;
            margin: 30px 0;
            border-radius: 4px;
          }
          
          .token-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          
          .token-code {
            font-size: 12px;
            font-weight: 600;
            color: #667eea;
            word-break: break-all;
            font-family: 'Monaco', 'Courier New', monospace;
            margin: 15px 0;
            user-select: all;
            background: white;
            padding: 12px;
            border-radius: 4px;
            line-height: 1.5;
          }
          
          .warning-box {
            background: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 16px;
            margin: 25px 0;
            border-radius: 4px;
          }
          
          .warning-box p {
            font-size: 13px;
            color: #e65100;
            margin: 8px 0;
            line-height: 1.6;
          }
          
          .warning-box strong {
            font-weight: 600;
          }
          
          .footer {
            background: #fafafa;
            padding: 25px 30px;
            border-top: 1px solid #eee;
            text-align: center;
          }
          
          .footer-text {
            font-size: 12px;
            color: #999;
            margin: 8px 0;
            line-height: 1.5;
          }
          
          .divider {
            height: 1px;
            background: #eee;
            margin: 15px 0;
          }
          
          @media (max-width: 600px) {
            .content {
              padding: 25px 20px;
            }
            
            .header h1 {
              font-size: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
            <p>Secure your InsightX account</p>
          </div>
          
          <div class="content">
            <p class="greeting">
              Hello,<br><br>
              We received a request to reset the password for your InsightX account. Use the reset token below to create a new password. This token is valid for 30 minutes.
            </p>
            
            <div class="token-section">
              <div class="token-label">Your Reset Token</div>
              <div class="token-code">${resetPasswordToken}</div>
            </div>
            
            <div class="warning-box">
              <p><strong>Token Validity:</strong> This reset token expires in 30 minutes.</p>
              <p><strong>Security:</strong> Never share this token with anyone. InsightX staff will never ask for it.</p>
              <p><strong>Not You?:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.</p>
            </div>
            
            <p style="font-size: 13px; color: #666; line-height: 1.6;">
              If you have any questions or need assistance, please contact our support team.
            </p>
          </div>
          
          <div class="footer">
            <div class="footer-text"><strong>Need Help?</strong> Contact us at support@insightx.com</div>
            <div class="divider"></div>
            <div class="footer-text">© 2024 InsightX. All rights reserved.</div>
            <div class="footer-text" style="font-size: 11px; margin-top: 10px;">
              This is an automated email. Please do not reply directly to this message.
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = { sendOtpToUser, sendPasswordResetEmail };
