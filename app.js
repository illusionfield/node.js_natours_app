const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/api/v1/tours/', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// Version 2.0 for refactoring
// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app
// .route('/api/v1/tours/:id')
// .get(getTour)
// .patch(updateTour)
// .delete(deleteTour);

// app.route('/api/v1/users').get(getAllUsers).post(createUser);
// app
// .route('/api/v1/users/:id')
// .get(getUser)
// .patch(updateUser)
// .delete(deleteUser);

// Version 3.0 for refactoring the code for a better file structure
app.use('/api/v1/tours', tourRouter); // middleware
app.use('/api/v1/users', userRouter); // middleware

module.exports = app;
