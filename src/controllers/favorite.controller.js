const Favorite = require('../models/favorite.model');

// COMPLETE - GET ALL FAVORITES
const getFavorites = async (req, res) => {
  await Favorite.find({}).exec((err, data) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    } else {
      res.status(200).json({
        result: data,
        message: "Success",
      });
    }
  });
}

// DONE - GET SINGLE FAVORITE by ID
const getManufacturer = async (req, res) => {
  await Favorite.find({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    } else {
      res.status(200).json({
        result: data,
        message: "Success",
      });
    }
  }).clone();
}

// TODO - GET MANUFACTURERS by QUERY PARAMS
// const getManufacturersByQueryParams = async (req, res) => {
// }

// DONE - CREATE SINGLE MANUFACTURER
const createManufacturer = async (req, res) => {
  const newManufacturer = new Favorite(req.body);
  await newManufacturer.save(err => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    } else {
      res.status(200).json({
        message: "Manufacturer created successfully!",
      });
    }
  });
};

// TODO - CREATE MULTIPLE MANUFACTURERS

// UPDATE SINGLE MANUFACTURER
const updateManufacturer = async (req, res) => {
  const result = await Favorite.findByIdAndUpdate(
    {
      _id: req.params.id
    },
    {
      $set: req.body
    },
    {
      new: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error!",
        });
      } else {
        res.status(200).json({
          message: "Manufacturer updated successfully!",
        });
      }
    }
  ).clone();
};

// TODO - UPDATE MULTIPLE MANUFACTURERS

// DONE - DELETE SINGLE MANUFACTURER
const deleteManufacturer = async (req, res) => {
  await Favorite.deleteOne(
    {
      _id: req.params.id
    },
    (err) => {
      if (err) {
        res.status(500).json({
          error: "There was a server side error!",
        });
      } else {
        res.status(200).json({
          message: "Manufacturer has been deleted Successfully!"
        });
      }
    }
  ).clone();
};

// DONE - DELETE ALL MANUFACTURERS
const deleteManufacturers = async (req, res) => {
  await Favorite.deleteMany({}, (err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    } else {
      res.status(200).json({
        message: "All manufacturers deleted successfully!",
      });
    }
  }).clone();
};

module.exports = {
  getManufacturers: getFavorites,
  getManufacturer,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
  deleteManufacturers,
};
