import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../enum/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.GUEST,
  })
  role: Role;

  @Column()
  password: string;
}
