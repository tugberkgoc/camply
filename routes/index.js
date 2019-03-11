const express = require("express")

const router = express.Router()

const passport = require("passport")

const User = require("../models/user")

const Campground = require("../models/campground")

router.get("/", function (req, res) {
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err)
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds})
    }
  })
})

router.get("/register", function (req, res) {
  res.render("register")
})

router.post("/register", function (req, res) {
  const newUser = new User({username: req.body.username})
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message)
      return res.render("register")
    } else {
      passport.authenticate("local")(req, res, function () {
        req.flash("success", "Welcome to YeldCamp" + user.username)
        res.redirect("/campgrounds")
      })
    }
  })
})

router.get("/login", function (req, res) {
  res.render("login")
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failueRedirect: "/login"
  }), function (req, res) {
})

router.get("/logout", function (req, res) {
  req.logout()
  req.flash("success", "Logged you out")
  res.redirect("/campgrounds")
})

module.exports = router