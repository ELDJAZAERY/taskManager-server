import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidationError,
  validate
} from 'class-validator';
import { plainToClass } from 'class-transformer';
import HttpException from '../../exceptions/httpException';
import HttpStatusCode from '../Enums/http.status.enum';

export default function InstanceOf(
  typeObj: any,
  validationOptions?: ValidationOptions
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'InstanceOf',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        async validate(value: any, args: ValidationArguments) {
          try {
            const errors: ValidationError[] = await validate(
              plainToClass(typeObj, value)
            );

            if (errors.length > 0) {
              const message = errors
                .map((error: ValidationError) =>
                  Object.values(error.constraints)
                )
                .join(', ');

              return Promise.reject(
                new HttpException(HttpStatusCode.BAD_REQUEST, message)
              );
            }

            return errors.length === 0;
          } catch (err) {
            validationOptions = {
              ...validationOptions,
              message: 'Invalid Params'
            };
            return false;
          }
        }
      }
    });
  };
}
