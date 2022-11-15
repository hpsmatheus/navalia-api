import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export default class RemoveProductFromCartDto {
  @IsNumber()
  productId: number;

  @IsBoolean()
  @IsOptional()
  removeAll?: boolean;
}
