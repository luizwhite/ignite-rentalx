import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { User } from '@modules/accounts/infra/typeorm/entities/User';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

@Entity('rentals')
class Rental {
  @PrimaryColumn()
  id: string = uuidv4();

  @Column()
  start_date: Date = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    new Date().getHours(),
    new Date().getMinutes(),
    0,
    0
  );

  @Column({ nullable: true, type: 'timestamp' })
  end_date: Date | null = null;

  @Column()
  expected_return_date!: Date;

  @Column({ nullable: true, type: 'numeric' })
  total!: number | null;

  @ManyToOne(() => Car)
  @JoinColumn({ name: 'car_id' })
  car!: Car;

  @Column()
  car_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  user_id!: string;

  @CreateDateColumn()
  created_at?: Date = new Date();

  @UpdateDateColumn()
  updated_at?: Date = new Date();
}

export { Rental };
