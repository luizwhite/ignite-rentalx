import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { User } from './User';

@Entity('user_tokens')
class UserToken {
  @PrimaryColumn()
  id: string = uuidv4();

  @Column()
  user_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  refresh_token!: string;

  @Column()
  expires_date!: Date;

  @CreateDateColumn()
  created_at?: Date = new Date();
}

export { UserToken };
