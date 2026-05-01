const mongoose = require('mongoose')

const eventSchema = mongoose.Schema(
  {
    // relationship field
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    // event fields
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    date: {
      type: String,
      required: [true, 'Please add a date'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
  },

  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Event', eventSchema)