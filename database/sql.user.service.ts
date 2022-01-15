import { Body, Inject, Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { RedisService } from "./redis.service";
import { SQLService, SQLTranactionService } from "./sql.service";

@Injectable()
export class UserService {
  @Inject() sql!: SQLService;
  @Inject() redis!: RedisService;
  @Inject() transaction!: SQLTranactionService;

  async login(id: string, pw: string): Promise<string> {
    const findResult = (await this.sql.sql.select("user")).find((v) => {
      v.id === id && v.pw === pw;
    });
    if (findResult === undefined) {
      throw new Error("not exist user");
    }
    const token = `${Math.random()}`;
    await this.redis.redis.setValue(token, findResult);
    return token;
  }

  async register(id: string, pw: string) {
    for (const v of await this.sql.sql.select("user")) {
      if (v.id === id) {
        throw new Error("exist id");
      }
    }
    await this.sql.sql.insert("user", {
      id: id,
      pw: pw,
    });
  }
  async isExist(id: string): Promise<boolean> {
    for (const v of await this.sql.sql.select("user")) {
      if (v.id === id) {
        return true;
      }
    }
    return false;
  }
  async isLogin(id: string): Promise<boolean> {
    for (const token of await this.redis.redis.keys()) {
      if ((await this.redis.redis.getValue(token)).id === id) {
        return true;
      }
    }
    return false;
  }
  async logout(token: string) {
    if (!(await this.redis.redis.delValue(token))) {
      throw new Error("not published token");
    }
  }
  async myself(token: string): Promise<{ id: string }> {
    const v = await this.redis.redis.getValue(token);
    if (v === undefined) {
      throw new Error("unpublished token");
    }
    return v.id;
  }
}
