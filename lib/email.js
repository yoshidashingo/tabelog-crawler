import nodemailer from 'nodemailer';
import moment from 'moment';

const transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    port: 465,
    secure: true,
    auth: {
        user: "17705143392@163.com",
        pass: "PMRNXZBONACWFQAI",
    }
});

export default async function main(html) {
    const today = moment().utcOffset('+0900').format(`YYYY年MM月DD日`);
    await transporter.sendMail({
        from: '17705143392@163.com',
        to: ["tangshiqiangcn@gmail.com", "admin@sec9.co.jp"],
        subject: `${today}の新店舗`,
        html,
    });
    console.log("email sent");
}
