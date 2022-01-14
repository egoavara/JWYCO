import {
  Body,
  Controller,
  Get,
  Injectable,
  Module,
  Post,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ApiProperty, DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

@Injectable()
class DatabaseService {
  data: string[] = [];
  push(d: string) {
    this.data.push(d);
  }
  all(): string[] {
    return this.data;
  }
}
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
class DatabaseModule {}

@Injectable()
class CatService {
  constructor(private db: DatabaseService) {}
  newCat(cat: string) {
    this.db.push(`cat(${cat})`);
  }
  allCat(): string[] {
    return this.db.all().map((v, i) => `${i} : ${v}`);
  }
}

class DTONewCat {
  @ApiProperty()
  name!: string;
}

@Controller("cat")
class CatController {
  constructor(private catService: CatService) {}
  @Post("/new-cat")
  newCat(@Body() cat: DTONewCat) {
    this.catService.newCat(cat.name);
  }
  @Get("all-cat")
  allCat(): string[] {
    return this.catService.allCat();
  }
}

@Module({
  imports: [DatabaseModule],
  controllers: [CatController],
  providers: [CatService],
})
class CatModule {}

const bootstcap = async () => {
  const app = await NestFactory.create(CatModule);
  const doc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle("test cat").build()
  );
  SwaggerModule.setup("/api", app, doc);
  await app.listen(3000);
};
bootstcap();
