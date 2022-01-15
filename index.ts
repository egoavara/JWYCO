import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const doc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle("app test").build()
  );
  SwaggerModule.setup("/doc", app, doc);
  await app.listen(3000);
}
bootstrap();
console.log(process.env)