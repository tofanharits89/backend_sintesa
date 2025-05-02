import { validationResult } from "express-validator";

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const errorMessages = errors.array().map((error) => error.msg);
  res.status(400).json({ errors: errorMessages });
};

export default validationMiddleware;
