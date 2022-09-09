import createHttpError from "http-errors"

export const adminOnlyMiddleware = (req, res, next) => {
  if (req.user.role === "Host") {
    next()
  } else {
    next(createHttpError(403, "Host Only Endpoint!"))
  }
}