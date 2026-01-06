export class CreateTransactionDto {
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
}
