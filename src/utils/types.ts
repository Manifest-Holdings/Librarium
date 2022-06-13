export interface Books {
  books: Book[]
}

export interface Book {
  id: string
  title: string
  author: Author
  content: string
  tags: string[]
  timestamp: number
}

export interface Author {
  id: string
  name: string
  wallet: string
  bookCount: number
}
