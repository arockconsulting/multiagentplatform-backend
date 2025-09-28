```typescript
// src/pages/page.module.ts

import { Module } from '@nestjs/common';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './page.entity';

/**
 * Módulo para gerenciar as páginas.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Page])],
  controllers: [PageController],
  providers: [PageService],
  exports: [PageService],
})
export class PageModule {}
```