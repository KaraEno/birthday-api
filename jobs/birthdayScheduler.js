const cron = require("node-cron");
const User = require("../models/user");
const moment = require("moment-timezone");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendBirthdayEmail = async (user) => {
  const msg = {
    to: user.email,
    from: {
      email: process.env.EMAIL_USER,
      name: "Birthday App",
    },
    subject: "Happy Birthday 🎉",
    text: `Hi ${user.username}, happy birthday! Wishing you the best year ahead!`,
    html: `<p>Hi <strong>${user.username}</strong>, happy birthday! 🎂🎉<br/>Wishing you the best year ahead!</p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error sending birthday email:", error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

cron.schedule("0 7 * * *", async () => {
  try {
    const users = await User.find({});

    for (const user of users) {
      const localToday = moment().tz(user.timezone).format("MM-DD");
      const userBirthday = moment(user.dob).tz(user.timezone).format("MM-DD");

      if (localToday === userBirthday) {
        const lastYearSent = user?.lastBirthdayEmailSent
          ? moment(user.lastBirthdayEmailSent).tz(user.timezone).year()
          : null;
        const currentYear = moment().tz(user.timezone).year();

        if (lastYearSent !== currentYear) {
          await sendBirthdayEmail(user);
          try {
            await User.findByIdAndUpdate(user._id, {
              lastBirthdayEmailSent: new Date(),
            });
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
    console.log("Job started at:", new Date());
  } catch (err) {
    console.log("error checking birthdays", err);
  }
});
