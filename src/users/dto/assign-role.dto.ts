import { IsEnum, IsInt, Min } from 'class-validator';
import { Role } from '../enum/role.enum';

export class AssignRoleDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsEnum(Role)
  role: Role;
}
