const Tour = require('./../models/tourModel');

// const tours = JSON.parse(
//  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// 2) ROUTE HANDLERS
// exports.checkBody = (req, res, next) => {
//  if (!req.body.name || !req.body.price) {
//   return res.status(400).json({
//     status: 'fail',
//      message: 'Missing name or price',
//    });
//  }
//  next();
// };

exports.getAllTours = async (req, res) => {
  try {
    // Build the query, so we first make a copy
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    // find method going to return a query
    let query = Tour.find(JSON.parse(queryStr));

    // 3) Sorting
    if (req.query.sort) {
      // we cannot leave a space in URL, so instead we're gonna add a comma
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // if there is no query, the default is (createdAt)
      query = query.sort('-createdAt');
    }

    // 4) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join('');
      query = query.select(fields);
    } else {
      // if there is no query, the default is (- = not including, but excluding in the response, so except the "v" field)
      query = query.select('-__v');
    }

    // 5) Pagination
    // multiplying by one = from string will be a number
    // defining a default value
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    // if page 3 the results are: (21 - 30), meaning that we need to skip 20 results, that basically 2 * 10(limit), that is (3-1) * 10(limit)
    const skip = (page - 1) * limit;
    // page=2&limit=10, 1-10, page 1, 11-20, page 2
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      // if the number of documents that we skip is greater than the number of documents, that actually exists
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // Execute the query
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
  // it is a trick to convert string in the array to a number
  // const id = req.params.id * 1;
  // find the id in the array
  // const tour = tours.find((el) => el.id === id);
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({ id: newId }, req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
