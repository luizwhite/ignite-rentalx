import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Car } from './Car';

@Entity('specifications')
class Specification {
  @PrimaryColumn()
  id: string = uuidv4();

  @Column()
  name!: string;

  @Column()
  description!: string;

  @ManyToMany(() => Car, (car) => car.specifications)
  @JoinTable()
  cars?: Car[];

  @CreateDateColumn()
  created_at?: Date = new Date();
}

export { Specification };
