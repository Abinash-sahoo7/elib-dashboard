export interface Author {
  _id: string;
  name: string;
}

export interface Book {
  _id: string;
  title: string;
  author: Author;
  genere: string;
  coverImage: string;
  file: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
