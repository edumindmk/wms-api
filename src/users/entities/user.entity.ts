import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../role.enum';
import { WorkSession } from 'src/work-sessions/entities/work-session.entity';
import { Company } from 'src/companies/entities/company.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: Role;

  @OneToOne(() => Company, (company) => company.owner)
  ownedCompany: Company;

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  @OneToMany(() => WorkSession, (workSession) => workSession.user)
  workSessions: WorkSession[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
