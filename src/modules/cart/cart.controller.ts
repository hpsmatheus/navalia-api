import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerResponse } from 'src/core/swagger-response';
import AddProductToCartDto from 'src/typings/cart/add-product.dto';
import RemoveProductFromCartDto from 'src/typings/cart/remove-product.dto';
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
    @Body() dto: AddProductToCartDto,
  ): Promise<void> {
    await this.cartService.addProduct(userEmail, dto);
  }

  @Patch('remove-product/:userEmail')
  @ApiResponse(SwaggerResponse.Ok())
  @ApiResponse(SwaggerResponse.NotFound)
  @ApiResponse(SwaggerResponse.InputValidationError)
  public async removeProduct(
    @Param('userEmail') userEmail: string,
    @Body() dto: RemoveProductFromCartDto,
  ): Promise<void> {
    await this.cartService.removeProduct(userEmail, dto);
  }
}
