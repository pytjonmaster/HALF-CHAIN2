const getVerificationEmailTemplate = (name, verificationLink) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Our Platform!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
      <a href="${verificationLink}" 
         style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
      <p>Best regards,<br>Your Team</p>
    </div>
  `;
};

const getPasswordResetTemplate = (name, resetLink) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      <a href="${resetLink}" 
         style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p>Best regards,<br>Your Team</p>
    </div>
  `;
};

module.exports = {
  getVerificationEmailTemplate,
  getPasswordResetTemplate
}; 