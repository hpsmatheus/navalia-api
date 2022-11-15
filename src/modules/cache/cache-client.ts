import { Inject, CACHE_MANAGER, Injectable } from '@nestjs/common';
import { ICacheClient } from './cache-client.interface';
import { Cache } from 'cache-manager';

@Injectable()
export default class CacheClient implements ICacheClient {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  public async getValue(key: string): Promise<unknown | null> {
    const value = await this.cacheManager.get(key);
    return value;
  }

  public async setValue(key: string, value: unknown): Promise<void> {
    await this.cacheManager.set(key, value);
  }
}
