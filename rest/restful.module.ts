import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { OrderController } from "./order/order.control";
import { OrderService } from "./order/order.service";
import { UserController } from "./user/user.control";

@Module({
  imports: [DatabaseModule],
  providers: [OrderService],
  controllers: [OrderController, UserController],
})
export class RESTAPIModule {}
