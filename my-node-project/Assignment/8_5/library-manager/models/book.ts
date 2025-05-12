export enum Genre {
  Fiction = "Fiction",
  Science = "Science",
  History = "History",
  Code = "Code",
  Fantasy = "Fantasy",
  Mystery = "Mystery",
  Biography = "Biography"
}

export interface Book {
  id: number;
  title: string;
  author: string;
  available: boolean; 
  genre?: Genre;
  isbn?: string;
  totalCopies?: number; 
}