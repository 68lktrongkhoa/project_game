
export const GenreValues = {
  Fiction: 'Fiction',
  NonFiction: 'NonFiction',
  Science: 'Science',
  History: 'History',
  Fantasy: 'Fantasy',
  Mystery: 'Mystery',
  SciFi: 'SciFi',
  Biography: 'Biography',
  Thriller: 'Thriller',
  Romance: 'Romance',
  Poetry: 'Poetry',
  Code: 'Code', 
} as const; 
export type BookGenre = typeof GenreValues[keyof typeof GenreValues];

export interface Book {
  id: number; 
  title: string;
  author: string;
  available: boolean;
  genre?: BookGenre;
  isbn?: string;
  totalCopies?: number;
}