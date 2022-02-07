interface ICreateRentalDTO {
  id?: string;
  end_date?: Date | null;
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

export { ICreateRentalDTO };
