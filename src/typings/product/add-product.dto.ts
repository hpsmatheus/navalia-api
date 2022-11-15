import { IsInt, IsNumber, IsPositive } from 'class-validator';

export default class AddProductDto {
  @IsNumber()
  productId: number;

  @IsPositive()
  @IsInt()
  quantity: number;
}
