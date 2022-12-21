const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;

const PlatformSchema = new Schema({
  links: Array,
  platform: Array,
  date: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("PlatformModel", PlatformSchema);
