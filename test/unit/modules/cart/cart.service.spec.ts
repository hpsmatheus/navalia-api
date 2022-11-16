import { mock } from 'jest-mock-extended';
import CartService from '../../../../src/modules/cart/cart.service';
import ProductBuilder from '../../../mocks/product.builder';
import { ICacheClient } from '../../../../src/modules/cache/cache-client.interface';
import ProductService from '../../../../src/modules/product/product.service';
import Constants from '../../../constants';
import Cart from '../../../../src/typings/cart/cart.entity';
import AddProductToCartDto from 'src/typings/cart/add-product.dto';

describe('CartsService', () => {
  const cacheClient = mock<ICacheClient>();
  const productService = mock<ProductService>();
  const service = new CartService(cacheClient, productService);

  const mockProduct = new ProductBuilder().build();
  const setValue = jest.spyOn(cacheClient, 'setValue');

  beforeEach(() => {
    productService.getById.mockResolvedValueOnce(mockProduct);
  });

  describe('Add product', () => {
    const addProductDto: AddProductToCartDto = {
      productId: mockProduct.id,
      quantity: 1,
    };

    const testAddProduct = async (
      existingCart: Cart,
      expectedCart: Cart,
    ): Promise<void> => {
      cacheClient.getValue.mockResolvedValueOnce(existingCart);

      await service.addProduct(Constants.anyEmail, addProductDto);
      expect(setValue).toHaveBeenCalledWith(
        `cart-${Constants.anyEmail}`,
        expectedCart,
      );
    };

    it('add new product to new cart', async () => {
      const expectedCart: Cart = {
        userEmail: Constants.anyEmail,
        products: [
          {
            id: mockProduct.id,
            price: mockProduct.price,
            quantity: addProductDto.quantity,
          },
        ],
      };
      await testAddProduct(null, expectedCart);
    });

    it('increse product quantity in existing cart', async () => {
      const existingCart: Cart = {
        userEmail: Constants.anyEmail,
        products: [
          {
            id: mockProduct.id,
            price: mockProduct.price,
            quantity: 1,
          },
        ],
      };

      const expectedCart: Cart = {
        userEmail: Constants.anyEmail,
        products: [
          {
            id: mockProduct.id,
            price: mockProduct.price,
            quantity: 2,
          },
        ],
      };

      await testAddProduct(existingCart, expectedCart);
    });
  });

  describe('Remove product', () => {
    const testRemoveProduct = async (
      existingCart: Cart,
      expectedCart: Cart,
      removeAll = false,
    ): Promise<void> => {
      cacheClient.getValue.mockResolvedValueOnce(existingCart);

      await service.removeProduct(Constants.anyEmail, {
        productId: mockProduct.id,
        removeAll,
      });
      expect(setValue).toHaveBeenCalledWith(
        `cart-${Constants.anyEmail}`,
        expectedCart,
      );
    };

    it('remove product from cart', async () => {
      const existingCart: Cart = {
        userEmail: Constants.anyEmail,
        products: [
          {
            id: mockProduct.id,
            price: mockProduct.price,
            quantity: 1,
          },
        ],
      };

      const expectedCart: Cart = {
        ...existingCart,
        products: [],
      };

      await testRemoveProduct(existingCart, expectedCart, true);
    });

    it('decrease product quantity', async () => {
      const existingCart: Cart = {
        userEmail: Constants.anyEmail,
        products: [
          {
            id: mockProduct.id,
            price: mockProduct.price,
            quantity: 2,
          },
        ],
      };

      const expectedCart: Cart = {
        ...existingCart,
        products: [
          {
            id: mockProduct.id,
            price: mockProduct.price,
            quantity: 1,
          },
        ],
      };

      await testRemoveProduct(existingCart, expectedCart);
    });
  });
});
