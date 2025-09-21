const cron = require("node-cron");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const moment = require("moment-timezone");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBirthdayEmail = async (user) => {
  await transporter.sendMail({
    from: `"Birthday App" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Happy Birthday 🎉",
    text: `Hi ${user.username}, happy birthday! Wishing you the best year ahead!`,
  });
};

cron.schedule("0 7 * * *", async () => {
  try {
    const users = await User.find({});

    for (const user of users) {
      const localToday = moment().tz(user.timezone).format("MM-DD");
      const userBirthday = moment(user.dob).format("MM-DD");

      if (localToday === userBirthday) {
        const lastYearSent = user.lastBirthdayEmailSent
          ? moment(user.lastBirthdayEmailSent).tz(user.timezone).year()
          : null;
        const currentYear = moment().tz(user.timezone).year();

        if (lastYearSent !== currentYear) {
          await sendBirthdayEmail(user);

          await User.findByIdAndUpdate(user._id, {
            lastBirthdayEmailSent: new Date(),
          });
        }
      }
    }
    console.log("Job started at:", new Date());
  } catch (err) {
    console.log("error checking birthdays", err);
  }
});
