import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from '@base/infrastructure/abstracts/EntityBase';

@Entity({ name: 'roles' })
export class Role extends EntityBase {
  @PrimaryGeneratedColumn('increment')
  RoleId: number;

  @Column()
  RoleName: string;
}
