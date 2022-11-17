import { MigrationInterface, QueryRunner } from 'typeorm';
import products from './data/product';

export class insertProducts1668649879221 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    products.map(async (product) => {
      await queryRunner.query(
        `INSERT INTO product(name, price) VALUES ('${product.name}', ${product.price})`,
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM product`);
  }
}
