export class MockRedis {
  store: Map<string, any> = new Map();
  async getValue(key: string): Promise<any> {
    return this.store.get(key);
  }
  async setValue(key: string, value: any) {
    this.store.set(key, value);
  }
  async delValue(key: string): Promise<boolean> {
    return this.store.delete(key);
  }
  async keys(): Promise<Array<string>> {
    return [...this.store.keys()];
  }
}
export class RedisService {
  constructor() {
    this.redis = new MockRedis();
  }
  public redis: MockRedis;
}
