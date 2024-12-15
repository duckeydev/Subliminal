const express = require("express");
const router = express.Router();

const Guild = require("../../database/mongodb/schema/Guild");
const User = require("../../database/mongodb/schema/User");
const db = require("../../database/quickdb/init.js");

const fs = require("fs");
const path = require("path");

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

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.json({
      type: "error",
      message: `You forgot something 👀.`,
    });
    return;
  }

  const decryptedPassword = atob(
    password.replace(global.config.web.encrypt_key, "")
  );

  const findUserPleaseIdontKnowAnymoreWhyItsSoLONG = await User.findOne({
    slug: username,
  }); // prevent same slugs to make it so peoples files wont be visible to others with that same username, this is a really long explanation for some reason /shrug ???
  if (findUserPleaseIdontKnowAnymoreWhyItsSoLONG) {
    res.json({
      type: "error",
      message: `Someone already has this username`,
    });
    return;
  }
  if (username.toString().length > 12) {
    res.json({
      type: "error",
      message: `Username is too long!`,
    });
    return;
  }

  const CreateThyNewUser = new User({
    name: username,
    password: decryptedPassword,
    slug: username,
    apikey: global.strGen(15),
    email: email,
    token: password,
    verified: false,
  });

  CreateThyNewUser.save();
  res.json({
    type: "success",
    message: `Successfully created a new user!`,
  });
  return;
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.json({
      type: "error",
      message: `You forgot your ${!username ? "email" : "password"}.`,
    });
    return;
  }

  const decryptedPassword = atob(
    password.replace(global.config.web.encrypt_key, "")
  );

  if (
    username === global.config.web.admin.username &&
    decryptedPassword === global.config.web.admin.password
  ) {
    req.session.token = btoa(password).replace(
      "=",
      global.config.web.encrypt_key
    );
    await req.session.save();
    res.json({ type: "success", message: "You are logged in." });
    return;
  }

  const user = await User.findOne({ email: username });

  if (!user || user.password !== decryptedPassword) {
    res.json({ type: "error", message: "Incorrect username or password." });
    return;
  }

  req.session.token = user.token;
  await req.session.save();
  res.json({ type: "success", message: "You are logged in." });
});

const CheckAuth = require("../../utilities/authcheck.js");

router.get("/user/info/@me", CheckAuth, async (req, res) => {
  const UD = await User.findOne({ token: req.session.token });
  res.json(UD);
});

router.post("/isThisDudeVerified", async (req, res) => {
  const UD = await User.findOne({ email: req.body.email });
  res.json({ message: UD.verified });
});

router.post("/verifyEm", async (req, res) => {
  const UD = await User.findOne({ email: req.body.email });
  const mailList = require("../../database/mongodb/schema/verificationCodes.js");
  const randString = global.strGen(50);

  if (UD.verified == true) {
    res.json({ message: "nah" });
  } else {
    global.mailer.sendMail({
      from: '"Noreply Plez" <noreply@ambrosia.gg>',
      to: req.body.email, // list of receivers
      subject: "Email Verification ✔", // Subject line
      text:
        `Someone requested a verification code? Heres the url btw: ${global.config.web.url}/verify/` +
        randString, // plain text body
    });
    new mailList({ verifies: req.body.email, code: randString }).save();
  }

  res.json({ message: "land ho" });
});

router.patch("/user/edit/@me", CheckAuth, async (req, res) => {
  const { name, email, username } = req.body;
  const ud = await User.findOne({ token: req.session.token });
  const updatedUser = await User.findOneAndUpdate(
    { token: req.session.token },
    { name, email, slug: username },
    { new: true, runValidators: true }
  );

  updatedUser.save();

  fs.rename(
    path.join(__dirname, `../../uploads/@${ud.slug}/`),
    path.join(__dirname, `../../uploads/@${username}/`),
    (err) => {
      if (err) throw err;
    }
  );

  res.json({ type: "success", message: "Successfully updated your account!" });
});

router.patch("/user/edit/@me/password", CheckAuth, async (req, res) => {
  function isBase64(str) {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  const { password, cp } = req.body;
  const ud = await User.findOne({ token: req.session.token });
  if (cp != ud.password) {
    return res
      .status(404)
      .json({ type: "error", message: "Incorrect current password" });
  }

  try {
    const decodedPassword = atob(
      password.toString().replace(global.config.web.encrypt_key, "")
    );

    const updatedUser = await User.findOneAndUpdate(
      { token: req.session.token },
      { password: decodedPassword },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ type: "error", message: "User not found" });
    }

    res.json({
      type: "success",
      message: "Successfully updated your account!",
    });
    req.session.destroy();
  } catch (error) {
    res.status(500).json({
      type: "error",
      message:
        "An error occurred while updating your account | " + error.message,
      error: error.message,
    });
  }
});

router.post("/upload", CheckAuth, async (req, res) => {
  const UD = await User.findOne({ token: req.session.token });
  const UPLOAD_DIR = path.join(__dirname, `../../uploads/@${UD.slug}/`);

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(400)
      .json({ message: "no files were uploaded", type: "error" });
  }

  const uploadedFile = req.files.file;
  const uploadPath = path.join(UPLOAD_DIR, uploadedFile.name.toString().replace(" ", "-"));

  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({
      message: "File uploaded successfully",
      type: "success",
      path: uploadPath,
    });
  });
});

function getFilesInFolder(folderPath) {
  return fs.readdirSync(folderPath).filter((file) => {
    return fs.statSync(path.join(folderPath, file)).isFile();
  });
}

router.get("/file/viewIncrement", async (req, res) => {
  db.add(btoa(req.query.url) + "_views", 1);
  res.json({ message: "toilet" });
});

router.get("/user/files", CheckAuth, async (req, res) => {
  try {
    // Retrieve user based on session token
    const user = await User.findOne({ token: req.session.token });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const UPLOAD_DIR = path.join(__dirname, "../../uploads/@" + user.slug);

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      fs.mkdirSync(path.join(UPLOAD_DIR, "pastes"), { recursive: true });
    }
    const allFiles = getFilesInFolder(UPLOAD_DIR);
    const files = allFiles.filter((file) => file !== "avatar");

    const fileData = await Promise.all(
      files.map(async (file) => {
        const views = (await db.get(user.slug + "_" + file + "_views")) || 0;
        return {
          name: file,
          fullPath: path.join(`uploads/@${user.slug}`, file),
          views,
        };
      })
    );

    return res.json({
      success: true,
      message: "Files retrieved successfully",
      data: {
        userSlug: user.slug,
        files: fileData,
      },
    });
  } catch (error) {
    console.error("Error fetching user files:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching files",
      error: error.message,
    });
  }
});

router.post("/upload/avatar", CheckAuth, async (req, res) => {
  const UD = await User.findOne({ token: req.session.token });
  const UPLOAD_DIR = path.join(__dirname, "../../uploads/@" + UD.slug);

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    fs.mkdirSync(UPLOAD_DIR + "/pastes", { recursive: true });
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(400)
      .json({ message: "no files were uploaded", type: "error" });
  }

  const uploadedFile = req.files.file;
  const uploadPath = path.join(UPLOAD_DIR, "avatar");

  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({
      message: "File uploaded successfully",
      type: "success",
      path: uploadPath,
    });
  });
});

router.get("/user/stats", CheckAuth, async (req, res) => {
  try {
    const UD = await User.findOne({ token: req.session.token });
    const directoryPath = path.join(__dirname, `../../uploads/@${UD.slug}/`);
    const info = getDirectoryInfo(directoryPath);

    const UPLOAD_DIR = path.join(__dirname, "../../uploads/@" + UD.slug);

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      fs.mkdirSync(path.join(UPLOAD_DIR, "pastes"), { recursive: true });
    }

    const allFiles = getFilesInFolder(UPLOAD_DIR);
    const files = allFiles.filter((file) => file !== "avatar");

    const data = {
      files: files.map((file) => ({
        name: file,
        fullPath: path.join(`uploads/@${UD.slug}`, file),
      })),
    };

    // Use Promise.all to wait for all async operations
    const viewsArray = await Promise.all(
      data.files.map(async (fd) => {
        const views = await db.get(UD.slug + "_" + fd.name + "_views");
        return parseInt(views || 0, 10);
      })
    );

    // Calculate total views
    const totalViews = viewsArray.reduce((acc, curr) => acc + curr, 0);

    res.json({
      totalSize: info.totalSize,
      fileCount: info.fileCount,
      totalViews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
