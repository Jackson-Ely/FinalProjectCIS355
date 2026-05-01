const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../model/userModel')

// ─────────────────────────────────────────────
// @desc    Register a new user
// @route   POST /api/users/
// @access  Public
// ─────────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body

  // Must have name and password. Must have at least one of email or username.
  if (!name || !password || (!email && !username)) {
    res.status(400)
    throw new Error('Please add a name, password, and either an email or username')
  }

  // Check for duplicates
  if (email) {
    const emailExists = await User.findOne({ email })
    if (emailExists) {
      res.status(400)
      throw new Error('A user with that email already exists')
    }
  }

  if (username) {
    const usernameExists = await User.findOne({ username })
    if (usernameExists) {
      res.status(400)
      throw new Error('A user with that username already exists')
    }
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    name,
    username: username || undefined, // don't save the field at all if not provided
    email: email || undefined,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// ─────────────────────────────────────────────
// @desc    Login — accepts email OR username
// @route   POST /api/users/login/
// @access  Public
// ─────────────────────────────────────────────
const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body

  if (!identifier || !password) {
    res.status(400)
    throw new Error('Please provide a username or email and a password')
  }

  const user = await User.findOne({ email: identifier }) || await User.findOne({ username: identifier })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email, username } = await User.findById(req.user.id)
  res.status(200).json({ id: _id, name, email, username })
})

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

module.exports = { registerUser, loginUser, getMe }