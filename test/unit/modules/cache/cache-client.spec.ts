import { Cache } from 'cache-manager';
import { mock } from 'jest-mock-extended';
import CacheClient from '../../../../src/modules/cache/cache-client';
describe('CacheClient', () => {
  const cacheManager = mock<Cache>();
  const cacheClient = new CacheClient(cacheManager);
  const get = jest.spyOn(cacheManager, 'get');
  const set = jest.spyOn(cacheManager, 'set');

  it('get value', async () => {
    await cacheClient.getValue('key');
    expect(get).toHaveBeenCalledWith('key');
  });

  it('set value', async () => {
    await cacheClient.setValue('key', 'value');
    expect(set).toHaveBeenCalledWith('key', 'value');
  });
});
