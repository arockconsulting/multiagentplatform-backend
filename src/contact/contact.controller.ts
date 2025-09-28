```typescript
import { Controller, Post, Body, ValidationPipe, UsePipes, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactService } from './contact.service';
import { ApiCreatedResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

/**
 * Controlador para lidar com submissões do formulário de contato.
 * @class ContactController
 */
@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  /**
   * Endpoint para receber e processar dados do formulário de contato.
   * @param {CreateContactDto} createContactDto - Os dados do formulário de contato a serem processados.
   * @returns {Promise<void>} - Uma promessa que resolve quando o email é enviado com sucesso.
   * @throws {BadRequestException} - Se a validação dos dados falhar.
   * @throws {InternalServerErrorException} - Se ocorrer um erro ao enviar o email.
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enviar mensagem de contato' })
  @ApiCreatedResponse({ description: 'Mensagem de contato enviada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos.' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao enviar mensagem de contato.' })
  async create(@Body() createContactDto: CreateContactDto): Promise<void> {
    await this.contactService.create(createContactDto);
  }
}
```