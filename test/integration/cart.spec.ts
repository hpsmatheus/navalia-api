import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock } from 'jest-mock-extended';
import { ICacheClient } from '../../src/modules/cache/cache-client.interface';
import CartModule from '../../src/modules/cart/cart.module';
import ProductSchema from '../../src/schemas/product.schema';
import Product from '../../src/typings/product/product.entity';
import { Repository } from 'typeorm';
import AppFactory from '../mocks/core/app.builder';
import supertest from 'supertest';
import ProductBuilder from '../mocks/product.builder';
import AddProductToCartDto from '../../src/typings/cart/add-product.dto';
import Constants from '../constants';
import Cart from '../../src/typings/cart/cart.entity';
import { EErrorCode } from '../../src/core/error/error-code.enum';
import TotalPriceResponse from 'src/typings/cart/total-price.response';

jest.setTimeout(900000);

describe('Cart Integration Tests', () => {
  let app: INestApplication;
  const repository = mock<Repository<Product>>();
  const cacheClient = mock<ICacheClient>();
  const setValue = jest.spyOn(cacheClient, 'setValue');
  const mockProduct = new ProductBuilder().build();

  beforeEach(() => {
    repository.findOneBy.mockResolvedValueOnce(mockProduct);
  });

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [CartModule],
    })
      .overrideProvider(getRepositoryToken(ProductSchema))
      .useValue(repository)
      .overrideProvider(ICacheClient)
      .useValue(cacheClient)
      .compile();

    app = await AppFactory.build(testingModule);
  });
  describe('Add Product', () => {
    const dto: AddProductToCartDto = {
      productId: mockProduct.id,
      quantity: 1,
    };
    it('should /PATCH to add product', async () => {
      const expectedCart: Cart = {
        userEmail: Constants.anyEmail,
        products: [
          {
            id: mockProduct.id,
            price: mockProduct.price,
            quantity: dto.quantity,
          },
        ],
      };

      await supertest(app.getHttpServer())
        .patch(`/cart/add-product/${Constants.anyEmail}`)
        .send(dto);

      expect(setValue).toHaveBeenCalledWith(
        `cart-${Constants.anyEmail}`,
        expectedCart,
      );
    });

    it('should throw 400 to invalid input', async () => {
      const result = await supertest(app.getHttpServer()).patch(
        `/cart/add-product/${Constants.anyEmail}`,
      );
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.body.errorCode).toBe(EErrorCode.INPUT_VALIDATION_ERROR);
      expect(result.body.message).toStrictEqual(
        'errors occurred during input validation',
      );
      expect(result.body.data).toStrictEqual({
        errors: [
          'productId must be a number conforming to the specified constraints',
          'quantity must be an integer number',
        ],
      });
    });

    it('should throw formatted exception when unexpected error happens', async () => {
      jest.resetAllMocks();
      repository.findOneBy.mockImplementationOnce(() => {
        throw new Error('generic error');
      });

      const result = await supertest(app.getHttpServer())
        .patch(`/cart/add-product/${Constants.anyEmail}`)
        .send(dto);

      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.errorCode).toBe(EErrorCode.INTERNAL_SERVER_ERROR);
      expect(result.body.message).toStrictEqual('generic error');
      expect(result.body.data).toBeDefined();
    });
  });

  describe('Remove Product', () => {
    it('should /PATCH to remove product', async () => {
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

      cacheClient.getValue.mockResolvedValueOnce(existingCart);

      await supertest(app.getHttpServer())
        .patch(`/cart/remove-product/${Constants.anyEmail}`)
        .send({ productId: mockProduct.id });

      expect(setValue).toHaveBeenCalledWith(
        `cart-${Constants.anyEmail}`,
        expectedCart,
      );
    });

    it('should throw 400 to invalid input', async () => {
      const result = await supertest(app.getHttpServer()).patch(
        `/cart/remove-product/${Constants.anyEmail}`,
      );
      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.body.errorCode).toBe(EErrorCode.INPUT_VALIDATION_ERROR);
      expect(result.body.message).toStrictEqual(
        'errors occurred during input validation',
      );
      expect(result.body.data).toStrictEqual({
        errors: [
          'productId must be a number conforming to the specified constraints',
        ],
      });
    });

    it('should throw formatted exception when unexpected error happens', async () => {
      jest.resetAllMocks();
      repository.findOneBy.mockImplementationOnce(() => {
        throw new Error('generic error');
      });

      const result = await supertest(app.getHttpServer())
        .patch(`/cart/remove-product/${Constants.anyEmail}`)
        .send({ productId: mockProduct.id });

      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.errorCode).toBe(EErrorCode.INTERNAL_SERVER_ERROR);
      expect(result.body.message).toStrictEqual('generic error');
      expect(result.body.data).toBeDefined();
    });
  });

  describe('Calc total price', () => {
    it('should /GET cart total price', async () => {
      const existingCart: Cart = {
        userEmail: Constants.anyEmail,
        products: [
          {
            id: mockProduct.id,
            price: mockProduct.price,
            quantity: 3,
          },
        ],
      };

      const expectedResult: TotalPriceResponse = {
        cart: existingCart,
        priceWithoutDiscounts: mockProduct.price * 3,
        finalPrice: mockProduct.price * 2,
      };

      cacheClient.getValue.mockResolvedValueOnce(existingCart);

      const result = await supertest(app.getHttpServer()).get(
        `/cart/total-price/${Constants.anyEmail}`,
      );
      expect(result.body).toStrictEqual(expectedResult);
    });

    it('should throw formatted exception when unexpected error happens', async () => {
      jest.resetAllMocks();
      cacheClient.getValue.mockImplementationOnce(() => {
        throw new Error('generic error');
      });

      const result = await supertest(app.getHttpServer()).get(
        `/cart/total-price/${Constants.anyEmail}`,
      );

      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.body.errorCode).toBe(EErrorCode.INTERNAL_SERVER_ERROR);
      expect(result.body.message).toStrictEqual('generic error');
      expect(result.body.data).toBeDefined();
    });
  });
});
