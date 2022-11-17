import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerResponse } from '../../core/swagger-response';
import AddProductToCartDto from '../../typings/cart/add-product.dto';
import RemoveProductFromCartDto from '../../typings/cart/remove-product.dto';
import TotalPriceResponse from '../../typings/cart/total-price.response';
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

  @Get('total-price/:userEmail')
  @ApiResponse(SwaggerResponse.Ok(TotalPriceResponse))
  @ApiResponse(SwaggerResponse.NotFound)
  public async getTotalPrice(
    @Param('userEmail') userEmail: string,
  ): Promise<TotalPriceResponse> {
    return this.cartService.calcTotalPrice(userEmail);
  }
}
