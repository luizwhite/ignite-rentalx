import { Expose } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import uploadConfig from '@config/upload';

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

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) return null;

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.API_URL}/files/${uploadConfig.avatarFolderName}/${this.avatar}`;
      case 'amazonS3':
        return `https://${uploadConfig.config.amazonS3.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadConfig.avatarFolderName}/${this.avatar}`;
      default:
        return null;
    }
  }

  avatar_url!: string;

  @CreateDateColumn()
  created_at!: Date;
}

export { User };
