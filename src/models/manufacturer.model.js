const mongoose = require('mongoose');

const manufacturerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      default:
        "https://i.ibb.co/QKdm1pQ/png-transparent-user-profile-default-computer-icons-network-video-recorder-avatar-cartoon-maker-blue.png",
    },
  },
  {
    timestamps: true,
  }
);

const Manufacturer = mongoose.model("Manufacturer", manufacturerSchema);
module.exports = Manufacturer;
