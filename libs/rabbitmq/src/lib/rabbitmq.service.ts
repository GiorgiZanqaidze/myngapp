import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqplib from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit {
  private channel!: amqplib.Channel;


  async onModuleInit() {
    const connection = await amqplib.connect('amqp://localhost');
    this.channel = await connection.createChannel();
    await this.channel.assertQueue('email_queue', { durable: true });
  }

  async send(queue: string, data: unknown) {
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
  }

  async consume(queue: string, handler: (data: any, ack: () => void, nack: () => void) => Promise<void>) {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, async (msg: any) => {
      if (!msg) return;
      const data = JSON.parse(msg.content.toString());

      try {
        await handler(data, () => this.channel.ack(msg), () => this.channel.nack(msg));
      } catch (err) {
        console.error('Consumer error:', err);
        this.channel.nack(msg);
      }
    });
  }
}
