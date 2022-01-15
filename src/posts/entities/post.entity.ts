import { Tag } from 'src/tags/entities/tag.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
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
  @ManyToMany(() => Tag, (tag) => tag.posts)
  tags: string[];
}