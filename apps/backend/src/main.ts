import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全域 API 路由前綴
  app.setGlobalPrefix('api');

  // 全域 ValidationPipe，自動驗證 DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自動移除未在 DTO 定義的欄位
      transform: true, // 自動轉型（例如字串轉數字）
    }),
  );

  // CORS（如果前端與後端不在同一 domain）
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Swagger API 文檔配置（僅非 production 環境）
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('SymbolERP API')
      .setDescription('SymbolERP 後端 API 文檔')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: '輸入 JWT token（從 /api/auth/login 取得）',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Authentication', '認證相關 API')
      .addTag('Users', '員工管理 API')
      .addTag('Modules', '模組控制 API')
      .addTag('LIFF', 'LINE LIFF API')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    console.log(
      `📚 Swagger UI: http://localhost:${process.env.PORT ?? 3001}/docs`,
    );
  }

  await app.listen(process.env.PORT ?? 3001);
  console.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT ?? 3001}`,
  );
  console.log(
    `📡 API endpoints: http://localhost:${process.env.PORT ?? 3001}/api`,
  );
}
bootstrap();
