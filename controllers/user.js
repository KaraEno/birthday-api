const User = require("../models/user");

const createUser = async (req, res) => {
  const { username, email, dob, timezone } = req.body;
  try {
    const userExist = await User.findOne({ email });

    if (userExist)
      return res.status(400).json({ message: "Email already exist" });
    const newUser = await User.create({
      username,
      email,
      dob,
      timezone,
    });
    return res.status(201).json({ user: newUser });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { createUser };
