export interface Books {
  books: Book[]
}

export interface Book {
  id: string
  title: string
  author: Author
  content: string
  tags: Tag[]
  timestamp: number
}

export interface Tag {
  key: string
  value: string
}

export interface Author {
  id: string
  name: string
  wallet: string
  bookCount: number
}
