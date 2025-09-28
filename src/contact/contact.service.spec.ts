```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const contactStub = (): Contact => ({
  id: 'some-uuid',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe('ContactService', () => {
  let service: ContactService;
  let repository: Repository<Contact>;

  const mockContactRepository = {
    create: jest.fn().mockImplementation((dto: CreateContactDto) => ({
      id: 'some-uuid',
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    save: jest.fn().mockImplementation((contact: Contact) => Promise.resolve(contact)),
    find: jest.fn().mockImplementation(() => Promise.resolve([contactStub()])),
    findOne: jest.fn().mockImplementation((id: string) => {
      if (id === 'some-uuid') {
        return Promise.resolve(contactStub());
      }
      return Promise.resolve(undefined);
    }),
    update: jest.fn().mockImplementation((id: string, dto: UpdateContactDto) => {
      if (id === 'some-uuid') {
        return Promise.resolve({
          affected: 1,
          raw: {},
          generatedMaps: [],
        });
      }
      return Promise.resolve({
        affected: 0,
        raw: {},
        generatedMaps: [],
      });
    }),
    delete: jest.fn().mockImplementation((id: string) => {
      if (id === 'some-uuid') {
        return Promise.resolve({
          affected: 1,
          raw: {},
        });
      }
      return Promise.resolve({
        affected: 0,
        raw: {},
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: getRepositoryToken(Contact),
          useValue: mockContactRepository,
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    repository = module.get<Repository<Contact>>(getRepositoryToken(Contact));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a contact', async () => {
      const createContactDto: CreateContactDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
      };

      const createdContact = await service.create(createContactDto);

      expect(mockContactRepository.create).toHaveBeenCalledWith(createContactDto);
      expect(mockContactRepository.save).toHaveBeenCalledWith(expect.objectContaining(createContactDto));
      expect(createdContact).toEqual(expect.objectContaining(createContactDto));
    });
  });

  describe('findAll', () => {
    it('should return all contacts', async () => {
      const contacts = await service.findAll();

      expect(mockContactRepository.find).toHaveBeenCalled();
      expect(contacts).toEqual([contactStub()]);
    });
  });

  describe('findOne', () => {
    it('should return a contact by id', async () => {
      const contact = await service.findOne('some-uuid');

      expect(mockContactRepository.findOne).toHaveBeenCalledWith('some-uuid');
      expect(contact).toEqual(contactStub());
    });

    it('should throw NotFoundException if contact is not found', async () => {
      jest.spyOn(mockContactRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findOne('non-existent-uuid')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a contact', async () => {
      const updateContactDto: UpdateContactDto = {
        firstName: 'Jane',
      };

      const result = await service.update('some-uuid', updateContactDto);

      expect(mockContactRepository.update).toHaveBeenCalledWith('some-uuid', updateContactDto);
      expect(result.affected).toEqual(1);
    });

    it('should throw NotFoundException if contact is not found', async () => {
      jest.spyOn(mockContactRepository, 'update').mockResolvedValue({
        affected: 0,
        raw: {},
        generatedMaps: [],
      });

      const updateContactDto: UpdateContactDto = {
        firstName: 'Jane',
      };

      await expect(service.update('non-existent-uuid', updateContactDto)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a contact', async () => {
      const result = await service.remove('some-uuid');

      expect(mockContactRepository.delete).toHaveBeenCalledWith('some-uuid');
      expect(result.affected).toEqual(1);
    });

    it('should throw NotFoundException if contact is not found', async () => {
      jest.spyOn(mockContactRepository, 'delete').mockResolvedValue({
        affected: 0,
        raw: {},
      });

      await expect(service.remove('non-existent-uuid')).rejects.toThrowError(NotFoundException);
    });
  });
});
```