import { Injectable } from '@nestjs/common';
import Product from '../../typings/product/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import ApiException from '../../core/error/api-exception';

@Injectable()
export default class ProductService {
  constructor(
    @InjectRepository(Product) private readonly repository: Repository<Product>,
  ) {}

  public async getById(id: number): Promise<Product> {
    const product = await this.repository.findOneBy({ id });
    if (product) return product;

    throw ApiException.notFound('Product');
  }
}
