const nodemailer = require("nodemailer");

const sendOtpMail = async (email, otp, type = "verify") => {
  try {
    console.log("MAIL_USER:", process.env.MAIL_USER);
    console.log("MAIL_PASS exists:", !!process.env.MAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("SMTP verified");

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "OTP Verification",
      html: `<h2>Your OTP is ${otp}</h2>`,
    });

    console.log("Mail sent:", info.messageId);

    return info;
  } catch (err) {
    console.error("Nodemailer Error:", err);
    throw err;
  }
};

module.exports = sendOtpMail;
