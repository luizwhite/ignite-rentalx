import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('categories')
class Category {
  @PrimaryColumn()
  id: string = uuidv4();

  @Column()
  name!: string;

  @Column()
  description!: string;

  @CreateDateColumn()
  created_at!: Date;
}

export { Category };
