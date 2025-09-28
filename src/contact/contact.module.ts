```typescript
import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

/**
 * The ContactModule is responsible for handling contact form submissions.
 */
@Module({
  imports: [],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
```