const nodemailer = require('nodemailer');
require('dotenv').config();

const sendDueReminderEmail = async (studentEmail, studentName, paymentDetails) => {
    // let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true, 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS  
        }

        // host: "smtp.ethereal.email",
        // port: 587,
        // secure: false, 
        // auth: {
        //     user: testAccount.user, 
        //     pass: testAccount.pass,
        // },
    });

    const mailOptions = {
    from: `"PlaySchool Support" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: 'URGENT: Fee Payment Reminder', 
    html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; border: 1px solid #e0e0e0; border-radius: 12px; max-width: 600px;">
            <h2 style="color: #d32f2f; margin-top: 0;">Fee Payment Reminder</h2>
            <p>Dear <b>${studentName}</b>,</p>
            <p>This is a friendly reminder that your school fees are currently pending. Please ensure the payment is made as soon as possible to avoid any inconvenience.</p>
            
            <div style="background-color: #fff5f5; border: 1px solid #feb2b2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #2d3748; font-size: 16px;">Outstanding Payment Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 5px 0; color: #4a5568;"><b>Amount Due:</b></td>
                        <td style="padding: 5px 0;">₹${paymentDetails.amount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 0; color: #4a5568;"><b>Due Date:</b></td>
                        <td style="padding: 5px 0;">${new Date(paymentDetails.dueDate).toLocaleDateString()}</td>
                    </tr>
                </table>
            </div>

            <p>You can pay your dues online instantly by logging into your account in our website.</p>
            <p style="margin-top: 25px; font-size: 13px; color: #718096;">
                If you have already made the payment, please disregard this email. For any queries, feel free to contact the school administration.
            </p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #a0aec0; text-align: center;">
                PlaySchool Management System
            </p>
        </div>
    `
    };

    return await transporter.sendMail(mailOptions);

    // const info = await transporter.sendMail(mailOptions);
    // console.log("PREVIEW EMAIL HERE 👉:", nodemailer.getTestMessageUrl(info));
    // return info;
};

module.exports = { sendDueReminderEmail };