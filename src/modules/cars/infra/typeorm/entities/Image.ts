import {
  Column,
  CreateDateColumn,
  Entity,
  /* JoinColumn, ManyToOne, */ PrimaryColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
// import { Car } from './Car';

@Entity('images')
class Image {
  @PrimaryColumn()
  id: string = uuidv4();

  @Column()
  name!: string;

  // @ManyToOne(() => Car)
  // @JoinColumn({ name: 'car_id' })
  // car!: Car;

  @Column()
  car_id!: string;

  @CreateDateColumn()
  created_at?: Date = new Date();
}

export { Image };
