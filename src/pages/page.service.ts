```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from './page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

/**
 * Serviço responsável por gerenciar as páginas.
 */
@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
  ) {}

  /**
   * Cria uma nova página.
   * @param createPageDto Dados para criar a página.
   * @returns A página criada.
   */
  async create(createPageDto: CreatePageDto): Promise<Page> {
    const page = this.pageRepository.create(createPageDto);
    return this.pageRepository.save(page);
  }

  /**
   * Busca todas as páginas.
   * @returns Uma lista de todas as páginas.
   */
  async findAll(): Promise<Page[]> {
    return this.pageRepository.find();
  }

  /**
   * Busca uma página pelo ID.
   * @param id O ID da página a ser buscada.
   * @returns A página encontrada.
   * @throws NotFoundException Se a página não for encontrada.
   */
  async findOne(id: number): Promise<Page> {
    const page = await this.pageRepository.findOneBy({ id });
    if (!page) {
      throw new NotFoundException(`Page with ID "${id}" not found`);
    }
    return page;
  }

  /**
   * Atualiza uma página existente.
   * @param id O ID da página a ser atualizada.
   * @param updatePageDto Os dados para atualizar a página.
   * @returns A página atualizada.
   * @throws NotFoundException Se a página não for encontrada.
   */
  async update(id: number, updatePageDto: UpdatePageDto): Promise<Page> {
    const page = await this.findOne(id); // Garante que a página existe
    this.pageRepository.merge(page, updatePageDto);
    return this.pageRepository.save(page);
  }

  /**
   * Remove uma página.
   * @param id O ID da página a ser removida.
   * @returns void
   * @throws NotFoundException Se a página não for encontrada.
   */
  async remove(id: number): Promise<void> {
    const page = await this.findOne(id); // Garante que a página existe
    await this.pageRepository.remove(page);
  }
}
```