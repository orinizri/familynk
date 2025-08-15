import nodemailer from "nodemailer";
import { MAIL_FROM, SMTP_URL } from "../config/env";
import { emailVerifyTemplate } from "../email/templates";

export const transporter = SMTP_URL
  ? nodemailer.createTransport(SMTP_URL)
  : nodemailer.createTransport({ jsonTransport: true }); // dev fallback

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  return transporter.sendMail({ from: MAIL_FROM, ...opts });
}

export async function sendVerificationEmail(to: string, link: string) {
  await sendMail({
    to,
    subject: "Verify your email",
    html: emailVerifyTemplate(link),
  });
}