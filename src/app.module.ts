import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { RESTAPIModule } from "./rest/restful.module";

@Module({
  imports: [DatabaseModule, RESTAPIModule],
})
export class AppModule {}
