const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorhandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

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

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorhandler);

module.exports = app;
