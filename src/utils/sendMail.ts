import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "@/models/userModels";

const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    const token = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "d0262418afb1f6",
        pass: "f734590cf4d3f2",
      },
    });

    const messageForVerify = `
    <p> Click <a href="${process.env.DOMAIN}/verifyemail?token=${token}">here</a> to verify your email 
    or copy paste the link below in yout browser.
    <br>
    ${process.env.DOMAIN}/verifyemail?token=${token}
    </br>
    </p>
    `;

    const messageForReset = `
    <p> Click <a href="${process.env.DOMAIN}/resetpassword?token=${token}">here</a> to reset your password
    or copy paste the link below in yout browser.
    <br>
    ${process.env.DOMAIN}/resetpassword?token=${token}
    </br>
    </p>
    `;

    const mailOptions = {
      from: "sanskarv2004@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: emailType === "VERIFY" ? messageForVerify : messageForReset,
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default sendMail;
