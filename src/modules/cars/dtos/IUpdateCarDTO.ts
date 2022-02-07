interface IUpdateCarDTO {
  id: string;
  name?: string;
  description?: string;
  available?: boolean;
  daily_rate?: number;
  fine_amount?: number;
  specifications?: string[];
}

export { IUpdateCarDTO };
