import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { SQLService, SQLTranactionService } from "./sql.service";
import { UserService } from "./sql.user.service";

@Module({
  providers: [RedisService, SQLService, SQLTranactionService, UserService],
  exports: [RedisService, SQLService, SQLTranactionService, UserService],
})
export class DatabaseModule implements OnModuleInit {
  @Inject()
  sql!: SQLService;
  async onModuleInit() {
    return Promise.all([
      this.sql.sql.create("order"),
      this.sql.sql.create("user"),
    ]);
  }
}
