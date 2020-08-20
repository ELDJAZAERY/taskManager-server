/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import HttpException from '../exceptions/httpException';
import { HttpStatusCode } from '../shared';

export default (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { body, url, query } = req;
  if (err.status) {
    (err as any).url = url;
    (err as any).query = query;
    (err as any).body = body;
  }
  logger.log('error', '', err);
  res
    .status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
    .send(err.message ? err.message : err);
};
