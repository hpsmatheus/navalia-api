import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerResponse } from 'src/core/swagger-response';
import AddProductDto from 'src/typings/product/add-product.dto';
import CartService from './cart.service';

@ApiTags('Cart')
@Controller('cart')
export default class CartController {
  constructor(private readonly cartService: CartService) {}

  @Patch('add-product/:userEmail')
  @ApiResponse(SwaggerResponse.Ok())
  @ApiResponse(SwaggerResponse.NotFound)
  @ApiResponse(SwaggerResponse.InputValidationError)
  public async addProduct(
    @Param('userEmail') userEmail: string,
    @Body() dto: AddProductDto,
  ): Promise<void> {
    await this.cartService.addProduct(userEmail, dto);
  }
}
