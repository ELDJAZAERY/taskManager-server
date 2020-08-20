import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../exceptions/httpException';
import { HttpStatusCode } from '../shared';

function validationMiddleware<T>(type: any): express.RequestHandler {
  return async (req, res, next): Promise<void> => {
    const errors: ValidationError[] = await validate(
      plainToClass(type, req.body)
    );
    if (errors.length > 0) {
      const message = errors
        .map((error: ValidationError) => Object.values(error.constraints))
        .join(', ');
      next(new HttpException(HttpStatusCode.BAD_REQUEST, message));
    } else {
      next();
    }
  };
}

export function queryValidationMiddleware<T>(
  type: any
): express.RequestHandler {
  return async (req, res, next): Promise<void> => {
    let query: any;
    query = req.query;

    if (query.limit) {
      query.limit = parseFloat(`${query.limit}`);
    }

    if (query.lat) {
      query.lat = parseFloat(`${query.lat}`);
    }

    if (query.long) {
      query.long = parseFloat(`${query.long}`);
    }

    const errors: ValidationError[] = await validate(plainToClass(type, query));
    if (errors.length > 0) {
      const message = errors
        .map((error: ValidationError) => Object.values(error.constraints))
        .join(', ');
      next(new HttpException(HttpStatusCode.BAD_REQUEST, message));
    } else {
      next();
    }
  };
}

export default validationMiddleware;
