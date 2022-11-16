import { mock } from 'jest-mock-extended';
import Product from '../../../../src/typings/product/product.entity';
import { Repository } from 'typeorm';
import ProductService from '../../../../src/modules/product/product.service';
import Constants from '../../../constants';
import ProductBuilder from '../../../mocks/product.builder';
import ApiException from '../../../../src/core/error/api-exception';

describe('ProductsService', () => {
  const repository = mock<Repository<Product>>();
  const service = new ProductService(repository);

  it('should return a product by id', async () => {
    const mockProduct = new ProductBuilder().build();
    const findOneBy = repository.findOneBy.mockResolvedValueOnce(mockProduct);

    const result = await service.getById(Constants.anyNumber);
    expect(result).toStrictEqual(mockProduct);
    expect(findOneBy).toHaveBeenCalledWith({ id: Constants.anyNumber });
  });

  it('should return not found when product does not exist', async () => {
    repository.findOneBy.mockResolvedValueOnce(null);
    await expect(service.getById(Constants.anyNumber)).rejects.toThrow(
      ApiException.notFound('Product'),
    );
  });
});
