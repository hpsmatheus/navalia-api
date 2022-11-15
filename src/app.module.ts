import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ApiCacheModule from './modules/cache/cache.module';
import CartModule from './modules/cart/cart.module';
import ormconfig from './ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), ApiCacheModule, CartModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
