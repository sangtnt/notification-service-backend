import { Logger } from '@/shared/logger/services/app-logger.service';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export class KafkaRepository {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private logger: Logger,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.kafkaClient.connect();
      this.logger.log('Kafka Producer client connected successfully.');
    } catch (error) {
      this.logger.error(`Failed to connect Kafka Producer client: ${JSON.stringify(error)}`);
    }
  }

  async onApplicationShutdown(): Promise<void> {
    await this.kafkaClient.close();
    this.logger.log('Kafka Producer client closed.');
  }

  async sendMessage(topic: string, message: object, key?: string): Promise<Observable<object>> {
    this.logger.log(`Sending message to Kafka topic [${topic}] with key [${key || 'N/A'}]`);
    if (!this.kafkaClient['producer']) {
      this.logger.warn('Kafka producer not ready, attempting to connect...');
      await this.kafkaClient.connect();
    }
    return this.kafkaClient.emit(topic, { key, value: message });
  }
}
