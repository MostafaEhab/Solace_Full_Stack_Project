const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const passport = require('passport');

// @route   POST api/users/register
// @desc    Register a new user
router.post('/register', UserController.register);

// @route   POST api/users/login
// @desc    Login an existing user and return an access token
router.post('/login', UserController.login);

// @route   POST api/users
// @desc    Return the user's profile
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  UserController.read
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  UserController.readById
);

// @route   POST api/users
// @desc    Login an existing user and return an access token
router.put(
  '/',
  passport.authenticate('jwt', { session: false }),
  UserController.update
);

// @route   DELETE api/users
// @desc    Delete an existing user
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  UserController.remove
);

router.get("/:id", passport.authenticate('jwt', {session: false}), UserController.getUser);


module.exports = router;
