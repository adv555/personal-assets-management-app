import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsExist', async: true })
@Injectable()
export default class IsExist implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0];
    const pathToProperty = validationArguments.constraints[1];

    const exists = await this.dataSource.getRepository(repository).count({
      where: {
        [pathToProperty ? pathToProperty : validationArguments.property]:
          pathToProperty ? value?.[pathToProperty] : value,
      },
    });

    return Boolean(exists);
  }
}
