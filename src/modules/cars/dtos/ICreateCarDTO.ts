import { Specification } from '../infra/typeorm/entities/Specification';

interface ICreateCarDTO<T = string | Specification> {
  name: string;
  description: string;
  daily_rate: number;
  license_plate: string;
  fine_amount: number;
  brand: string;
  category_id: string;
  specifications?: T[];
}

export { ICreateCarDTO };
