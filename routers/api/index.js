const express = require("express");
const router = express.Router();

const Guild = require("../../database/mongodb/schema/Guild");
const User = require("../../database/mongodb/schema/User");

router.post("/debuggie", async (req, res) => {
  console.log(req.body.key);
  if (req.body.key != global.config.web.debug.presetKey) {
    res.json({ message: "fail" });
    return;
  } else {
    res.json({
      message: "skibidi",
    });
    req.session.save(() => {
      req.debugKey = req.body.key;
    });
    return;
  }
  if (req.body.key != process.env.key) {
    res.json({ message: "fail" });
    return;
  } else {
    res.json({
      message: "skibidi",
    });
    req.session.save(() => {
      req.debugKey = req.body.key;
    });
    return;
  }
});

router.post("/login", async (req, res) => {
  if (!req.body.username) {
    res.json({ type: "error", message: "You forgot your username." });
    return;
  };

  if (!req.body.password) {
    res.json({ type: "error", message: "You forgot your password." });
    return;
  };  

  if (req.body.username == global.config.web.admin.username &&  atob(req.body.password.toString().replace(global.config.web.encrypt_key,"")) == global.config.web.admin.password) {
    res.json({ type: "success", message: "You are logged in." });
    req.session.token = btoa(req.body.password).toString().replace("==", global.config.web.encrypt_key) 
    req.session.save()

    return; 
  }

  const user = User.findOne({ name: req.body.username})
  if (user.password != atob(req.body.password.toString().replace(global.config.web.encrypt_key,""))) {
    res.json({ type: "error", message: "Incorrect name or password." });
    return;
  };

  res.json({ type: "success", message: "You are logged in." });
  req.session.token = btoa(password).toString.replace("==", global.config.web.encrypt_key)
  req.session.save()
});

module.exports = router;
