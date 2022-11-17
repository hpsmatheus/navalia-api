import Product from '../typings/product/product.entity';
import { EntitySchema } from 'typeorm';

const ProductSchema = new EntitySchema<Product>({
  name: 'Product',
  target: Product,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },

    name: {
      type: String,
    },

    price: {
      type: Number,
    },

    createdAt: {
      type: Date,
      createDate: true,
    },

    updatedAt: {
      type: Date,
      updateDate: true,
    },
  },
});

export default ProductSchema;
