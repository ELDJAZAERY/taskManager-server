import {
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum
} from 'class-validator';

export enum ORDER {
  ASC = 'ASC',
  DESC = 'DESC'
}

export class PaginationFilter {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  pageSize?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  pageNumber?: number;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  orderBy: string;

  @IsOptional()
  @IsEnum(ORDER)
  order: ORDER;
}

export interface PaginateObj<T> {
  totalItems: Number;

  totalPage: Number;

  pageSize: Number;

  pageNumber: Number;

  keyword: string;

  items: T[];

  metaData?: any;
}

export default PaginationFilter;
