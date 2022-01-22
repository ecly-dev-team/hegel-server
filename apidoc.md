# api doc

## Global Interfaces

### Tag

```ts
{
  name: string,
  id: number,
}
```

### Category

```ts
{
  name: string,
  id: number,
}
```

### Post

```ts
{
  id: string,
  title: string,
  abstract: string,
  createDate: string,
  updateDate: string,
  tags: Tag[],
  category: Category[],
}
```

## Posts Module

### GET /posts

```ts
Post[]
```

### GET /posts/:id

```ts
Post
```

### DEL /posts/:id

### CREATE /posts

```ts
{
  title: string,
  abstract: string,
  content: string,
  createDate: Date, 
  updateDate?: Date, 
  tags?: string[],
  category: number
}
```

### GET /posts/count

```ts
{
  count: number
}
```

### PATCH /posts/:id

```ts
{
  title?: string,
  abstract?: string,
  content?: string,
  createDate?: Date, 
  updateDate: Date, 
  tags?: string[],
  category?: number
}
```