import { Injectable, Scope } from "@nestjs/common";

export class MockSQL {
  store: Map<string, any[]> = new Map();
  public async select(from: string): Promise<any[]> {
    const v = this.store.get(from);
    if (v === undefined) {
      throw new Error("not found table");
    }
    return v;
  }
  public async create(tablename: string) {
    if (this.store.has(tablename)) {
      throw new Error("exist table");
    }
    this.store.set(tablename, []);
  }
  public async insert(into: string, value: any) {
    const v = this.store.get(into);
    if (v === undefined) {
      throw new Error("not found table");
    }
    v.push(value);
  }
}

@Injectable()
export class SQLService {
  constructor() {
    this.sql = new MockSQL();
  }
  public sql: MockSQL;
}

@Injectable({
  scope: Scope.REQUEST,
})
export class SQLTranactionService {
  constructor(private sql: SQLService) {}
  store: Map<string, any[]> = new Map();

  async insert(into: string, value: any) {
    if (!this.sql.sql.store.has(into)) {
      throw new Error("not exist table");
    }
    let v = this.store.get(into);
    if (v === undefined) {
      this.store.set(into, []);
      v = this.store.get(into);
    }
    v?.push(value);
  }

  async select(from: string): Promise<any[]> {
    return [
      ...(await this.sql.sql.select(from)),
      ...(this.store.get(from) ?? []),
    ];
  }

  async rollback() {
    this.store = new Map();
  }
  async commit() {
    for (const [k, targets] of this.store.entries()) {
      for (const target of targets) {
        await this.sql.sql.insert(k, target);
      }
    }
    this.store = new Map();
  }
}
