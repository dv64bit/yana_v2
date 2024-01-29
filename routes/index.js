var express = require("express");
var router = express.Router();
const userModel = require("./users");
const subModel = require("./subscribers");
const contactModel = require("./contact");
const passport = require("passport");
const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));

router.get("/", function (req, res) {
  res.render("index", { currentPage: "/", user: req.user });
});

router.get("/services", function (req, res) {
  res.render("services", { currentPage: "/services", user: req.user });
});

router.get("/contact", function (req, res) {
  res.render("contact", { currentPage: "/contact", user: req.user });
});

router.get("/register", function (req, res) {
  res.render("register", {
    currentPage: "/register",
    user: req.user,
  });
});

router.get("/login", function (req, res) {
  res.render("login", {
    currentPage: "/register",
    error: req.flash("error"),
    user: req.user,
  });
});

router.get("/about", function (req, res) {
  res.render("about", { currentPage: "/about", user: req.user });
});

router.get("/thanks", function (req, res) {
  res.render("thanks", { currentPage: "/thanks", user: req.user });
});

router.get("/subservice", isLoggedIn, function (req, res) {
  res.render("subservice", { currentPage: "/subservice", user: req.user });
});

router.get("/editProfile", isLoggedIn, async function (req, res) {
  const loggedInUser = await userModel.findOne({
    username: req.session.passport.user,
  });
  res.render("editProfile", {
    loggedInUser,
    currentPage: "/subservice",
    user: req.user,
  });
});

router.get("/profile", isLoggedIn, async function (req, res) {
  const loggedInUser = await userModel.findOne({
    username: req.session.passport.user,
  });
  console.log(loggedInUser);
  res.render("profile", {
    currentPage: "/profile",
    loggedInUser,
    user: req.user,
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/profile",
    failureFlash: true,
  }),
  function (req, res, next) {}
);

router.post("/register", async function (req, res) {
  // Continue with registration if the user doesn't exist
  const userData = new userModel({
    username: req.body.username,
    name: req.body.fullName,
    email: req.body.email,
  });

  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post("/registerMail", async function (req, res) {
  const subData = await subModel.create({
    email: req.body.email,
  });
  await subData.save();
  res.redirect("/thanks");
});

router.post("/contactedUser", async function (req, res) {
  const userContact = await contactModel.create({
    name: req.body.name,
    email: req.body.email,
    contact: req.body.tel,
  });
  await userContact.save();
  res.redirect("/thanks");
});

router.post("/editProfile", async function (req, res) {
  const loggedInUser = await userModel.findOneAndUpdate(
    {
      username: req.session.passport.user,
    },
    {
      contact: req.body.contact,
      location: req.body.location,
      language: req.body.language,
      about: req.body.about,
      description: req.body.description,
    },
    {
      new: true,
    }
  );
  await loggedInUser.save();
  console.log(loggedInUser);
  res.redirect("/profile");
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
