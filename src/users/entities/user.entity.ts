import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Role } from '../role.enum';
import { WorkSession } from 'src/work-sessions/entities/work-session.entity';
import { Company } from 'src/company/entities/company.entity';


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

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  @OneToMany(() => Company, (company) => company.owner)
  companiesOwned: Company[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
