import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  // Configure RabbitMQ microservice
  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://guest:guest@host.docker.internal:5672'], // This works on Windows/Mac
  //     queue: 'my_queue',
  //     queueOptions: {
  //       durable: false,
  //     },
  //     noAck: false,
  //     prefetchCount: 1,
  //   },
  // });

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'cats_queue',
      queueOptions: {
        durable: false
      },
    },
  });

  // app.setGlobalPrefix(globalPrefix);


  // Start all microservices

  // Start the main app
  const port = process.env.PORT || 3000;
  await app.listen();
  Logger.log(
    `🚀 Application is running on: rabbit microservice is running`
  );
}

bootstrap();
