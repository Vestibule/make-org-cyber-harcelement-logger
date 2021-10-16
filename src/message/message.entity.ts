import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: null })
  body?: string;

  @Column()
  receivedAt: Date;

  @Column()
  sender: string;

  @Column()
  app: string;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  constructor(partial: Partial<Message> = {}) {
    Object.assign(this, partial);
  }
}
