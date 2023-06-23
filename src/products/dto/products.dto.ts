import { IsNotEmpty, IsOptional } from 'class-validator';

export class ProductsDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  image: string;
}
