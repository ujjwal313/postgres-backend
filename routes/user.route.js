//importing modules
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../database");
const jwt = require("../utils/jwt");
const userAuth = require("../middleware/userAuth");
const User = db.user;

//sign-up
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const saveData = { email: email, password: hashed };

    const userExists = await User.findAll({
      where: {
        email: email,
      },
    });

    if (userExists.length > 0) {
      return res.status(200).send({
        status: true,
        message: "You are Already Registered. Please Login to Proceed.",
      });
    }

    const data = await User.create(saveData);

    return res.status(201).send({
      status: true,
      message: "User Signup Successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, msg: error.message });
  }
});

//sign-in
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await Admin.findAll({
      where: { email: email },
    });

    if (userExists.length == 0) {
      return res
        .status(401)
        .send({ status: false, message: `Incorrect Email` });
    }

    const validPassword = await bcrypt.compare(
      password,
      userExists[0].dataValues.password
    );

    if (!validPassword) {
      return res
        .status(401)
        .send({ status: false, message: "Invalid password" });
    }

    const token = await jwt.createToken(
      userExists[0].dataValues.name,
      userExists[0].dataValues.email,
      userExists[0].dataValues.mobile
    );
    res.header("Authorization", token);

    return res.status(200).send({
      status: true,
      message: "Login Successful",
      data: { data: userExists[0].dataValues, token },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, msg: error.message });
  }
});

//get user details
router.get("/userDetails/:email", userAuth, async (req, res) => {
  try {
    const email = req.params.email;

    const user = await User.findAll({
      where: {
        email: email,
      },
    });

    return res.status(200).send({
      status: true,
      message: "User Data fetched sucessfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
});

//update details
router.put("/update/:id", userAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, name, mobile } = req.body;

    let user = await User.findAll({
      where: { id: userId },
    });

    if (user.length == 0) {
      res.status(404).send({ status: false, message: "User not found" });
      return;
    }

    const updatedUser = await User.update(
      { name: name, mobile: mobile, email: email },
      {
        where: { id: userId },
      }
    );

    res.status(200).send({
      status: true,
      message: "Details updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, msg: error.message });
  }
});

module.exports = router;
