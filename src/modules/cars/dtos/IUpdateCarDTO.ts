interface IUpdateCarDTO {
  id: string;
  name?: string;
  description?: string;
  daily_rate?: number;
  fine_amount?: number;
  specifications?: string[];
}

export { IUpdateCarDTO };
