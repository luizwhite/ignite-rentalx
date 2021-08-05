import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
@Unique('UQ_UsersUniques', ['email'])
class User {
  @PrimaryColumn()
  id: string = uuidv4();

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  driver_license!: string;

  @Column('boolean')
  isAdmin = false;

  @Column({ nullable: true, type: 'varchar' })
  avatar: string | null = null;

  @CreateDateColumn()
  created_at!: Date;
}

export { User };
