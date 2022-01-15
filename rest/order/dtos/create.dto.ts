import { ApiProperty } from "@nestjs/swagger";

export class Order {
  @ApiProperty()
  from!: string;
  @ApiProperty()
  to!: string;
  @ApiProperty()
  value!: number;
}
