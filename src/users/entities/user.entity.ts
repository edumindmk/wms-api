import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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

  @OneToMany(() => WorkSession, (workSession) => workSession.user)
  workSessions: WorkSession[];

  @ManyToOne(() => Company, (company) => company.users, { nullable: true })
  company: Company | null;

  @OneToMany(() => Company, (company) => company.owner)
  ownedCompanies: Company[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
