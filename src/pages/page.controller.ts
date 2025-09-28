```typescript
// src/pages/page.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';

/**
 * Controller responsável por gerenciar as páginas.
 */
@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  /**
   * Cria uma nova página.
   * @param createPageDto Dados para criar a página.
   * @returns A página criada.
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createPageDto: CreatePageDto): Promise<Page> {
    return this.pageService.create(createPageDto);
  }

  /**
   * Lista todas as páginas.
   * @returns Uma lista de páginas.
   */
  @Get()
  async findAll(): Promise<Page[]> {
    return this.pageService.findAll();
  }

  /**
   * Busca uma página pelo ID.
   * @param id O ID da página a ser buscada.
   * @returns A página encontrada.
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Page> {
    return this.pageService.findOne(id);
  }

  /**
   * Atualiza uma página pelo ID.
   * @param id O ID da página a ser atualizada.
   * @param updatePageDto Dados para atualizar a página.
   * @returns A página atualizada.
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePageDto: UpdatePageDto,
  ): Promise<Page> {
    return this.pageService.update(id, updatePageDto);
  }

  /**
   * Remove uma página pelo ID.
   * @param id O ID da página a ser removida.
   * @returns Uma confirmação da remoção.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.pageService.remove(id);
  }
}
```