/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { RabbitmqService } from '@myngapp/rabbitmq';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );


  const rabbit = app.get(RabbitmqService);

  await rabbit.consume('email_queue', async (data, ack, nack) => {
    try {
      await sendEmail(data);
      ack();
    } catch (e) {
      nack();
    }
  });

  console.log('✅ Consumer is running');
}

bootstrap();
