import { Role } from 'src/users/enum/role.enum';

export interface RequestUser {
  id: number;
  role: Role;
  name: string;
}
