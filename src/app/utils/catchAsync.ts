import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync = (fn: RequestHandler) => {
    return (req: Request,res: Response,next:NextFunction) => {
      // console.log(req)
      Promise.resolve(fn(req,res,next)).catch(err => next(err))
    }
  }

export default catchAsync;