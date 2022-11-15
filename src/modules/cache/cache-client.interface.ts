export interface ICacheClient {
  getValue(key: string): Promise<unknown | null>;
  setValue(key: string, value: unknown): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ICacheClient = Symbol('ICacheClient');
