import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const users = await this.usersRepository.find({ where: { email } });
    if (users.length === 0) {
      return undefined;
    }

    return users[0];
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}
