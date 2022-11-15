import { ApiProperty } from '@nestjs/swagger';
import Cart from './cart.entity';

export default class TotalPriceResponse {
  @ApiProperty()
  cart: Cart;

  @ApiProperty()
  priceWithoutDiscounts: number;

  @ApiProperty()
  totalPrice: number;
}
