const advancedResult = (schema, child) => async (req, res, next) => {
  let query;

  let reqQuery = { ...req.query };
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1;
  const skip = (page - 1) * limit;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await schema.countDocuments();

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const removeList = ["select", "sort", "page", "limit"];
  removeList.forEach((elem) => delete reqQuery[elem]);

  reqQuery = JSON.stringify(reqQuery).replaceAll(
    /\b(gte|gt|lte|lt|in)\b/g,
    (match) => `$${match}`
  );

  query = schema.find(JSON.parse(reqQuery)).populate(child);

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  if (req.query.sort) {
    const fields = req.query.sort.split(",").join(" ");
    query = query.sort(fields);
  }
  if (req.query.page) {
    query = query.skip(startIndex);
  }
  if (req.query.limit) {
    query = query.limit(limit);
  }

  const results = await query;

  res.advancedResult = {
    success: true,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResult;
