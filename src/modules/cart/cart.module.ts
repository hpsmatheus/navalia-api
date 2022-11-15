import { Module } from '@nestjs/common';

import ApiCacheModule from '../cache/cache.module';
import ProductModule from '../product/product.module';
import CartController from './cart.controller';
import CartService from './cart.service';

@Module({
  imports: [ApiCacheModule, ProductModule],
  controllers: [CartController],
  providers: [CartService],
})
export default class CartModule {}
