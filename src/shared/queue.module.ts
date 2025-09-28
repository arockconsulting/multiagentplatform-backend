```typescript
// src/shared/queue.module.ts
/**
 * @file Queue Module - Defines the Bull queue module for handling background tasks,
 *       such as sending emails.
 */

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailProcessor } from './processors/email.processor';

/**
 * QueueModule
 *
 * This module configures and provides the Bull queue for asynchronous task processing.
 * It imports the BullModule, configures it based on environment variables, and
 * registers the EmailProcessor to handle email sending tasks.
 */
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'email', // Name of the email queue
    }),
  ],
  providers: [EmailProcessor],
  exports: [BullModule], // Export BullModule to make it available in other modules
})
export class QueueModule {}
```