import nodemailer from 'nodemailer';

const sendEmail = async (options: { email: String; subject: String; message: String; }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        const mailOption : {} = {
            from: "Dhrumisha Rakholiya <dhumi02@gmail.com>",
            to: options.email,
            subject: options.subject,
            text: options.message,
        }

        await transporter.sendMail(mailOption);

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to send email')
    }
}
export default sendEmail;

