const Tour = require('./../models/tourModel');

// const tours = JSON.parse(
//  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// 2) ROUTE HANDLERS
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //  tours,
    // },
  });
};

exports.getTour = (req, res) => {
  // it is a trick to convert string in the array to a number
  const id = req.params.id * 1;
  // find the id in the array
  //const tour = tours.find((el) => el.id === id);
  //res.status(200).json({
  //  status: 'success',
  //  data: {
  //    tour,
  //  },
  //});
};

exports.createTour = (req, res) => {
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  res.status(201).json({
    status: 'success',
    // data: {
    //   tour: newTour,
    //  },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};