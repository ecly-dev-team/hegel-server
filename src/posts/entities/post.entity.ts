import { Category } from 'src/categories/entities/category.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  abstract: string;

  @Column('text')
  content: string;

  @Column('date')
  createDate: Date;

  @Column('date', {
    nullable: true,
  })
  updateDate: Date;

  @JoinTable()
  @ManyToMany(() => Tag, (tag) => tag.posts, {
    cascade: true,
  })
  tags: Tag[];

  @ManyToOne(() => Category, (category) => category.posts)
  category: Category;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  author: User;
}
