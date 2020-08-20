import {
  ValidationOptions,
  ValidationArguments,
  Validator,
  validate,
  registerDecorator
} from 'class-validator';

import { plainToClass } from 'class-transformer';

export default function IsArrayOfInstancesOf(
  className: any,
  validationOptions?: ValidationOptions
) {
  if (!validationOptions) {
    validationOptions = {};
  }

  if (!validationOptions.message) {
    validationOptions.message = 'Value must be an array';
  }

  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsArrayOfInstancesOf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      async: true,
      validator: {
        // https://github.com/typestack/class-validator/issues/83
        async validate(
          value: any,
          args: ValidationArguments
        ): Promise<boolean> {
          const validator = new Validator();
          if (!validator.isArray(value)) {
            return false;
          }

          const items = value;

          async function validateItem(item: any): Promise<boolean> {
            const object = plainToClass(className, item);
            const errors = await validate(object);

            return !errors.length;
          }

          const validations = await Promise.all(items.map(validateItem));

          // If there is at least one false, it is not valid
          return validations.filter(isValidated => !isValidated).length === 0;
        }
      }
    });
  };
}
