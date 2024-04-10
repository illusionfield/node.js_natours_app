class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Build the query, so we first make a copy
    // 1) Filtering
    // This was the first option
    // const queryObj = { ...req.query };
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    // find method going to return a query
    // let query = Tour.find(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 3) Sorting
    if (this.queryString.sort) {
      // we cannot leave a space in URL, so instead we're gonna add a comma
      const sortBy = req.query.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // if there is no query, the default is (createdAt)
      this.query = this.query.sort('-createdAt');
    }

    // return the entire object, so we chain the methods together
    return this;
  }

  limitFields() {
    // 4) Field limiting
    if (this.queryString.fields) {
      const fields = req.query.fields.split(',').join('');
      this.query = this.query.select(fields);
    } else {
      // if there is no query, the default is (- = not including, but excluding in the response, so except the "v" field)
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // 5) Pagination
    // multiplying by one = from string will be a number
    // defining a default value
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    // if page 3 the results are: (21 - 30), meaning that we need to skip 20 results, that basically 2 * 10(limit), that is (3-1) * 10(limit)
    const skip = (page - 1) * limit;
    // page=2&limit=10, 1-10, page 1, 11-20, page 2
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
