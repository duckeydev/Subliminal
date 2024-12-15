const express = require("express");
const router = express.Router();

const User = require("../../database/mongodb/schema/User.js");

router.get("/", async (req, res) => {
  res.render("../views/index.ejs", {
    encryptKEY: global.config.web.encrypt_key,
  });
});

router.get("/login", async (req, res) => {
  if (req.session.token) {
    res.redirect("/dashboard");
  }
  res.render("../views/login.ejs", {
    encryptKEY: global.config.web.encrypt_key,
  });
});

router.get("/register", async (req, res) => {
  if (req.session.token) {
    res.redirect("/dashboard");
  }
  res.render("../views/register.ejs", {
    encryptKEY: global.config.web.encrypt_key,
  });
});

router.get("/verify/:codde", async (req, res) => {
  const mailList = require("../../database/mongodb/schema/verificationCodes.js");
  const coke = await mailList.findOne({ code: req.params.codde });
  if (!coke) {
    res.sendFile(__dirname + "../../views/fakeUrl.html");
    return;
  }
  const updatedUser = await User.findOneAndUpdate(
    { email: coke.verifies },
    { verified: true },
    { new: true, runValidators: true }
  );

  res.send(`
        
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Success</title>
    <link rel="stylesheet" href="/assets/css/tailwind.css">
</head>
<body class="h-full">
<main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div class="text-center">
      <p class="text-base font-semibold text-indigo-600">Success</p>
      <h1 class="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">Email verification</h1>
      <p class="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">You can login again, just go to the login tab again and close the modal popup!</p>
    </div>
  </main>
</body>
</html>`);
  updatedUser.save();
});

module.exports = router;
