const mongoose = require("mongoose");

const mobileBannerSchema = mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MobileBanner = mongoose.model("MobileBanner", mobileBannerSchema);
module.exports = MobileBanner;
