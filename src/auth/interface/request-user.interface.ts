import { Role } from 'src/users/enum/role.enum';

export interface RequestUser {
  id: number;
  email: string;
  role: Role;
  name: string;
}
