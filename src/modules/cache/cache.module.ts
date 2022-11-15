import { CacheModule, Module } from '@nestjs/common';
import CacheClient from './cache-client';
import { ICacheClient } from './cache-client.interface';

const secondsInADay = 86400;

@Module({
  imports: [CacheModule.register({ ttl: secondsInADay })],
  providers: [{ provide: ICacheClient, useClass: CacheClient }],
  exports: [ICacheClient],
})
export default class ApiCacheModule {}
