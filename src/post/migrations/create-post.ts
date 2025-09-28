```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

/**
 * Migration responsável por criar a tabela `post`.
 */
export class CreatePost1678886400000 implements MigrationInterface {
  /**
   * Aplica a migration, criando a tabela `post`.
   * @param queryRunner O QueryRunner utilizado para executar as queries.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'post',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'excerpt',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['draft', 'published', 'archived'],
            default: "'draft'",
            isNullable: false,
          },
          {
            name: 'featuredImage',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  /**
   * Reverte a migration, removendo a tabela `post`.
   * @param queryRunner O QueryRunner utilizado para executar as queries.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('post');
  }
}
```
```typescript
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm';
import { slugify } from '../utils/slugify';

/**
 * Enum que define os possíveis status de um post.
 */
export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/**
 * Entidade que representa um post no banco de dados.
 */
@Entity('post')
export class Post {
  /**
   * ID do post (gerado automaticamente).
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Título do post.
   */
  @Column({ length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  /**
   * Slug do post (gerado a partir do título).
   */
  @Column({ length: 255, unique: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  slug: string;

  /**
   * Conteúdo do post.
   */
  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  content: string;

  /**
   * Resumo do post.
   */
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  excerpt?: string;

  /**
   * Status do post.
   */
  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  @IsEnum(PostStatus)
  status: PostStatus;

  /**
   * URL da imagem destacada do post.
   */
  @Column({ length: 255, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  featuredImage?: string;

  /**
   * Data de criação do post.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Data da última atualização do post.
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Hook que é executado antes de salvar ou atualizar o post.
   * Gera o slug a partir do título, caso ele não tenha sido definido.
   */
  @BeforeUpdate()
  beforeInsertOrUpdate() {
    if (!this.slug) {
      this.slug = slugify(this.title);
    } else {
      this.slug = slugify(this.slug);
    }
  }
}
```
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';

/**
 * Módulo responsável pela entidade Post.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
```
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

/**
 * Serviço responsável pela manipulação da entidade Post.
 */
@Injectable()
export class PostService {
  /**
   * Injeta o repositório de Post.
   * @param postRepository Repositório de Post.
   */
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  /**
   * Cria um novo post.
   * @param createPostDto Dados para a criação do post.
   * @returns O post criado.
   */
  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  /**
   * Busca todos os posts.
   * @returns Uma lista de posts.
   */
  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  /**
   * Busca um post pelo ID.
   * @param id ID do post a ser buscado.
   * @returns O post encontrado, ou undefined caso não exista.
   */
  async findOne(id: number): Promise<Post | undefined> {
    return this.postRepository.findOne({ where: { id } });
  }

  /**
   * Atualiza um post existente.
   * @param id ID do post a ser atualizado.
   * @param updatePostDto Dados para a atualização do post.
   * @returns O post atualizado.
   */
  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post | undefined> {
    await this.postRepository.update(id, updatePostDto);
    return this.findOne(id);
  }

  /**
   * Remove um post.
   * @param id ID do post a ser removido.
   * @returns void
   */
  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
```
```typescript
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto