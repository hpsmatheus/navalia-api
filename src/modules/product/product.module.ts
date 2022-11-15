import { Module } from '@nestjs/common';
import ProductService from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ProductSchema from 'src/schemas/product.schema';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSchema])],
  providers: [ProductService],
  exports: [ProductService],
})
export default class ProductModule {}
