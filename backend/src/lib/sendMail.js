const nodemailer = require("nodemailer");

const sendOtpMail = async (email, otp, type = "verify") => {
  try {
    console.log("MAIL_USER:", process.env.MAIL_USER);
    console.log("MAIL_PASS exists:", !!process.env.MAIL_PASS);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
    console.log("Starting SMTP verify");

    console.log("SMTP verified");
    console.log("Sending OTP to:", email);
    try {
      console.log("Sending mail");

      const info = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "OTP Verification",
        html: `<h2>Your OTP is ${otp}</h2>`,
      });

      console.log("Mail sent:", info.messageId);
    } catch (err) {
      console.error("FULL ERROR:", err);
      console.error("ERROR CODE:", err.code);
      console.error("ERROR RESPONSE:", err.response);
      console.error("ERROR MESSAGE:", err.message);
      throw err;
    }

    return info;
  } catch (err) {
    console.error("Nodemailer Error:", err);
    throw err;
  }
};

module.exports = sendOtpMail;
