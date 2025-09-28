```typescript
/**
 * src/database/seeds/initial-data.ts
 *
 * Seed para popular o banco de dados com dados iniciais.
 */

import { Seeder } from 'nestjs-seeder';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Importe as entidades que você deseja popular
import { User } from '../../users/entities/user.entity';
import { Role } from '../../auth/entities/role.entity';

/**
 * Classe que implementa o Seeder para popular o banco de dados.
 */
@Injectable()
export class InitialDataSeeder implements Seeder {
  /**
   * Construtor da classe.
   * @param userRepository Repositório da entidade User.
   * @param roleRepository Repositório da entidade Role.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * Método que executa o seed.
   * @returns Uma Promise que resolve quando o seed é concluído.
   */
  async seed(): Promise<any> {
    // Seed de Roles
    const roles = [
      { name: 'admin', description: 'Administrador do sistema' },
      { name: 'user', description: 'Usuário comum do sistema' },
    ];

    for (const roleData of roles) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
      }
    }

    // Seed de Usuários (exemplo com um usuário admin)
    const adminRole = await this.roleRepository.findOne({
      where: { name: 'admin' },
    });

    if (!adminRole) {
      console.error('Role "admin" não encontrada. Seed de usuários falhou.');
      return;
    }

    const adminUser = {
      email: 'admin@example.com',
      password: 'admin', // TODO: Hash this password before saving to production
      firstName: 'Admin',
      lastName: 'User',
      roles: [adminRole],
    };

    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminUser.email },
    });

    if (!existingAdmin) {
      const user = this.userRepository.create(adminUser);
      await this.userRepository.save(user);
    }

    console.log('Seed de dados iniciais concluído.');
  }

  /**
   * Método que apaga os dados do banco de dados.
   * @returns Uma Promise que resolve quando os dados são apagados.
   */
  async drop(): Promise<any> {
    await this.userRepository.delete({});
    await this.roleRepository.delete({});
  }
}
```