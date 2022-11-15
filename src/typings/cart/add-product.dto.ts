import { IsInt, IsNumber, IsPositive } from 'class-validator';

export default class AddProductToCartDto {
  @IsNumber()
  productId: number;

  @IsPositive()
  @IsInt()
  quantity: number;
}
