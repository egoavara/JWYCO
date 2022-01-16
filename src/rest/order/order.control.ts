import { Controller, Inject, Param, ParseIntPipe } from "@nestjs/common";
import { Body, Get, Post } from "@nestjs/common";
import { SQLTranactionService } from "../../database/sql.service";
import { Order } from "./dtos/create.dto";
import { OrderService } from "./order.service";

@Controller("order")
export class OrderController {
  @Inject() service!: OrderService;

  @Post("")
  async create(@Body() data: Order) {
    await this.service.transaction.insert("order", {
      from: data.from,
      to: data.to,
      value: data.value,
    });
    console.log(data)
    await this.service.transaction.commit();
  }

  @Post("create-rollback")
  async createRollback(@Body() data: Order) {
    await this.service.transaction.insert("order", {
      from: data.from,
      to: data.to,
      value: data.value,
    });
  }

  @Get()
  async all(): Promise<Order[]> {
    return this.service.transaction.select("order");
  }
  
  @Get("/above-eq/:pivot")
  async above(@Param("pivot", ParseIntPipe) pivot: number): Promise<Order[]> {
    return this.service.aboveEqualPivot(pivot);
  }
}
