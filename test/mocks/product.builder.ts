import Constants from '../constants';
import Product from '../../src/typings/product/product.entity';

export default class ProductBuilder {
  private product: Product;

  constructor() {
    this.product = {
      id: Constants.anyNumber,
      name: Constants.anyString,
      price: Constants.anyNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  public build(): Product {
    return this.product;
  }
}
