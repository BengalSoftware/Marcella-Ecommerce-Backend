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
    slug: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: 'https://i.ibb.co/Kys7p3C/brand.webp'
    },
  },
  {
    timestamps: true,
  }
);

const Manufacturer = mongoose.model("Manufacturer", manufacturerSchema);
module.exports = Manufacturer;
