```typescript
// src/content/content.module.ts
import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

/**
 * Módulo responsável por gerenciar o conteúdo da aplicação.
 */
@Module({
  imports: [],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
```