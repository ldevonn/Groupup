const { check, query, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach((error) => (errors[error.path] = error.msg));

    const err = {
      message: "Bad Request",
      errors: errors,
    };

    return res.status(400).json(err);
  }

  next();
};

//query validation
const validateQueries = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Page must be greater than or equal to 1"),
  query("size")
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage("Size must be greater than or equal to 1"),
  query("name")
    .optional()
    .custom((value) => {
      if (Number(value)) {
        throw new Error("Name must be a string");
      }
      return true;
    }),
  query("type")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Type must be 'Online', or 'In Person"),
  query("startDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Start date must be a valid datetime"),
  handleValidationErrors,
];

//validate new event
const validateNewEvent = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),

  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),

  check("capacity")
    .exists({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("Capacity must be an integer"),

  check("price")
    .exists({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Price is invalid"),

  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),

  check("startDate")
    .custom((value, { req }) => {
      const startDate = new Date(value);
      const currentDate = new Date();
      return startDate > currentDate;
    })
    .withMessage("Start date must be in the future"),

  check("endDate")
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      return endDate > startDate;
    })
    .withMessage("End date is less than start date"),
  handleValidationErrors,
];

const pagination = function (queryPage, querySize) {
  let page;
  let size;

  //page
  if (queryPage) {
    if (!Number(queryPage)) {
      page = 1;
    } else {
      page = queryPage;
    }
  } else {
    page = 1;
  }
  //size
  if (querySize) {
    if (!Number(querySize)) {
      size = 20;
    } else {
      size = querySize;
    }
  } else {
    size = 20;
  }

  //calculation
  const limit = size;
  const offset = size * (page - 1);
  if (size == 0 || page == 0) {
    limit = null;
    offset = null;
  }

  return [limit, offset];
};

module.exports = {
  handleValidationErrors,
  validateQueries,
  validateNewEvent,
  pagination,
};
