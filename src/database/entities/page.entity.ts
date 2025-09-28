```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

/**
 * Represents a Page entity in the database.
 */
@Entity('pages')
export class Page {
  /**
   * The unique identifier for the page.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The title of the page.
   * @example "About Us"
   */
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  /**
   * The slug of the page, used for URL routing.
   * @example "about-us"
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  slug: string;

  /**
   * The content of the page, stored as text.
   */
  @Column({ type: 'text' })
  @IsOptional()
  @IsString()
  content: string;

  /**
   * The date and time when the page was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * The date and time when the page was last updated.
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
```