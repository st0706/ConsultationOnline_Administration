import nodemailer from "nodemailer";

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const smtp = {
  service: process.env.NEXT_PUBLIC_SMTP_SERVICE,
  host: process.env.NEXT_PUBLIC_SMTP_HOST,
  port: Number(process.env.NEXT_PUBLIC_SMTP_PORT),
  user: process.env.NEXT_PUBLIC_SMTP_USER,
  password: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
  from: process.env.NEXT_PUBLIC_SMTP_FROM
};

const transporter = nodemailer.createTransport({
  service: smtp.service,
  host: smtp.host,
  port: smtp.port,
  secure: false,
  auth: {
    user: smtp.user,
    pass: smtp.password
  }
});

export const sendEmail = async (data: EmailData) => {
  if (smtp.host !== "") {
    return;
  }

  const emailDefaults = {
    from: smtp.from
  };

  await transporter.sendMail({ ...emailDefaults, ...data });
};
