import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Category } from './Category';
import { Specification } from './Specification';

@Entity('cars')
@Unique('UQ_CarsUniques', ['license_plate'])
class Car {
  @PrimaryColumn()
  id: string = uuidv4();

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  daily_rate!: number;

  @Column('boolean')
  available = true;

  @Column()
  license_plate!: string;

  @Column()
  fine_amount!: number;

  @Column()
  brand!: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @Column()
  category_id!: string;

  @ManyToMany(() => Specification, (specification) => specification.cars, {
    eager: true,
  })
  @JoinTable({
    name: 'specifications_cars_cars', // with name cars_specifications_specifications dont need to set name
  })
  specifications?: Specification[];
  // @JoinTable({
  //   name: 'specifications_cars_cars',
  //   joinColumn: { name: 'carsId' },
  //   inverseJoinColumn: { name: 'specificationsId' },
  // })

  @CreateDateColumn()
  created_at?: Date = new Date();
}

export { Car };
