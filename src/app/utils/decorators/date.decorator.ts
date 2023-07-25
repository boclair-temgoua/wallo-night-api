import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Currency } from '../../../models';
import { config } from '../../../app/config';
import { HttpException, HttpStatus } from '@nestjs/common';

export const MatchDate = (
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsAfterNowConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'MatchDate' })
export class IsAfterNowConstraint implements ValidatorConstraintInterface {
  validate(date: Date, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return (
      new Date(date).getTime() > Date.now() &&
      new Date(relatedValue).getTime() > Date.now() &&
      new Date(date).getTime() > new Date(relatedValue).getTime()
    );
  }
  defaultMessage(args: ValidationArguments) {
    const [constraintProperty]: (() => any)[] = args.constraints;
    return `The ${constraintProperty} date cannot be greater than the ${args.property}`;
  }
}

/** **************************************************************************************************************** */

export const MatchValidationDate = (
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsAValidateNowConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'MatchValidationDate' })
export class IsAValidateNowConstraint implements ValidatorConstraintInterface {
  validate(endDate: Date, initialDate: ValidationArguments) {
    const [relatedPropertyName] = initialDate.constraints;
    const initialDateValue = (initialDate.object as any)[relatedPropertyName];
    return new Date(endDate).getTime() >= new Date(initialDateValue).getTime();
  }
  defaultMessage(initialDate: ValidationArguments) {
    const [constraintProperty]: (() => any)[] = initialDate.constraints;
    return `The ${constraintProperty} date cannot be greater than the ${initialDate.property}`;
  }
}

/** **************************************************************************************************************** */

export const validationAmount = (options: {
  amount: number;
  currency: Currency;
}) => {
  const { amount, currency } = options;

  const amountConvert = Number(amount) / currency?.amount;

  if (
    amountConvert < config.datasite.amount.minAmount ||
    amountConvert > config.datasite.amount.maxAmount
  )
    throw new HttpException(
      `The amount must be between ${
        config.datasite.amount.minAmount * currency?.amount
      } ${currency?.code} and ${
        config.datasite.amount.maxAmount * currency?.amount
      } ${currency?.code}`,
      HttpStatus.NOT_FOUND,
    );

  return { amountConvert };
};
