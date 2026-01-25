const nodemailer = require("nodemailer");

const sendOtpMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS, 
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Your OTP Verification Code",
    html: `
      <h2>Campora OTP Verification</h2>
      <p>Your OTP is: <b style="font-size:18px;">${otp}</b></p>
      <p>This OTP will expire in 5 minutes.</p>
    `,
  });
};

module.exports = sendOtpMail;
