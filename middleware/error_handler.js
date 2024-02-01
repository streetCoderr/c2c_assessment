import { ZodError } from "zod";

export default function errorHandler (err, req, res, next) {
  let errMsg
  if (err instanceof ZodError) {
    let errMsgCons = [];
    err.issues.forEach(issue => {
      errMsgCons.push(issue.message)
    });
    errMsg = errMsgCons.join(" : ");
    err.statusCode = 400;
  }
  res.status(err.statusCode ?? 500).json({errorMessage: errMsg || err.message})
}
