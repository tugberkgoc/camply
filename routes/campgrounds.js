/**
 * Campground is a router that contains restful services.
 *
 * @class routes-campground.js
 * @type {*|NodeJS}
 */

/**
 * Importing Express Library
 *
 * @property express
 * @type {Object}
 * @default "express"
 */
const express = require("express")

const router = express.Router()

const Campground = require("../models/campground")

const middleware = require("../middleware")

router.get("/", function (req, res) {
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err)
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  })
})

router.post("/", middleware.isLoggedIn, function (req, res) {
  const name = req.body.name
  const price = req.body.price
  const image = req.body.image
  const desc = req.body.description
  const author = {
    id: req.user._id,
    username: req.user.username
  }
  const newCampground = {name: name, price: price, image: image, description: desc, author: author}
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err)
    } else {
      //console.log(newlyCreated)
      res.redirect("/campgrounds")
    }
  })
})

router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new")
})

router.get("/:id", function (req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
    if (err) {
      console.log(err)
    } else {
      if (req.isAuthenticated()) {
        //console.log(foundCampground)
        var usernameofUser = req.user.username
        //console.log(usernameofUser);
        res.render("campgrounds/show", {campground: foundCampground, usernameofUser, usernameofUser});
      } else {
        //console.log(foundCampground)
        res.render("campgrounds/show", {campground: foundCampground, usernameofUser, usernameofUser});
      }
    }
  })
})

router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    res.render("campgrounds/edit", {campground: foundCampground})
  })
})

router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err) {
    if (err) {
      res.redirect("/campgrounds")
    } else {
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
})

router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds")
    } else {
      res.redirect("/campgrounds")
    }
  })
})

module.exports = router