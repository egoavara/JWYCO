import { Injectable, Inject, Scope } from "@nestjs/common";
import { SQLService, SQLTranactionService } from "../../database/sql.service";
import { Order } from "./dtos/create.dto";

@Injectable()
export class OrderService {
  @Inject() sql!: SQLService;
  @Inject() transaction!: SQLTranactionService;

  async aboveEqualPivot(pivot: number): Promise<Order[]> {
    const selres = await this.transaction.select("order");
    return selres.filter((v) => {
      return (v as Order).value >= pivot;
    });
  }
}
