const nodemailer = require("nodemailer");

const sendOtpMail = async (email, otp, type = "verify") => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const isReset = type === "reset";
  const subject = isReset ? "Campora Password Reset Code" : "Your OTP Verification Code";
  const heading = isReset ? "Campora Password Reset" : "Campora OTP Verification";
  const message = isReset
    ? "Your password reset code is:"
    : "Your OTP is:";

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject,
    html: `
      <h2>${heading}</h2>
      <p>${message} <b style="font-size:18px;">${otp}</b></p>
      <p>This code will expire in 5 minutes.</p>
    `,
  });
};

module.exports = sendOtpMail;
