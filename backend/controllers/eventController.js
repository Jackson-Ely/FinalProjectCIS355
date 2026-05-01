const asyncHandler = require('express-async-handler')

const Event = require('../model/eventModel')
const User = require('../model/userModel')

const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ user: req.user.id })
  res.status(200).json(events)
})

// create event
const setEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location } = req.body

  if (!title || !description || !date || !location) {
    res.status(400)
    throw new Error('Please add all fields: title, description, date, and location')
  }

  const event_created = await Event.create({
    title,
    description,
    date,
    location,
    user: req.user.id,
  })

  res.status(200).json(event_created)
})

// update event
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (!event) {
    res.status(400)
    throw new Error('Event not found')
  }

  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  if (event.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location,
    },
    { new: true }
  )

  res.status(200).json(updatedEvent)
})

// delete event
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)

  if (!event) {
    res.status(400)
    throw new Error('Event not found')
  }

  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  if (event.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await event.deleteOne()

  res.status(200).json({ message: `Deleted event ${req.params.id}` })
})

module.exports = {
  getEvents,
  setEvent,
  updateEvent,
  deleteEvent,
}