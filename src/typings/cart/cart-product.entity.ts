import { OmitType } from '@nestjs/swagger';
import Product from '../product/product.entity';

export default class CartProduct extends OmitType(Product, [
  'name',
  'createdAt',
  'updatedAt',
]) {
  quantity: number;
}
