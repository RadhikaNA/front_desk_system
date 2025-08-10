import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    private dataSource: DataSource
  ) {
    // Seed admin user if none exists
    (async () => {
      const count = await this.users.count();
      if (count === 0) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const adminUser = this.users.create({
          username: 'admin',
          password: hashedPassword,
          role: 'staff',
        });
        await this.users.save(adminUser);
        console.log('Seeded admin user -> username: admin password: password123');
      }
    })();
  }

  async login(username: string, password: string): Promise<string | null> {
    const user = await this.users.findOneBy({ username });
    if (!user) return null;

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) return null;

    const token = jwt.sign(
      { sub: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );

    return token;
  }
}
