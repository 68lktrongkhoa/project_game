export enum BorrowStatus {
  BORROWED = 'BORROWED',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
  
}

export interface BorrowRecord {
  id: number;
  bookId: number;
  userId: number;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: BorrowStatus;
}