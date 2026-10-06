import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from '@fastify/helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('KanbanEX-Bootstrap');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
    }),
  );

  // Security Headers
  await (app.register as any)(helmet, {
    contentSecurityPolicy: false,
  });

  // CORS configuration using Nest's built-in fastify cors wrapper
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-fedapay-event'],
  });

  // Global API prefix
  app.setGlobalPrefix('api/v1');

  // Input Validation and Transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('KanbanEX API - Expansion Ecosystem')
    .setDescription(
      'Spécification OpenAPI du SaaS de gestion de projets KanbanEX. Vues panoramiques Projects Overview, Kanban, Gantt, Calendar, FedaPay, et Super Admin.'
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 KanbanEX API démarrée sur http://localhost:${port}/api/v1`);
  logger.log(`📚 Documentation Swagger accessible sur http://localhost:${port}/api/docs`);
}

bootstrap();
