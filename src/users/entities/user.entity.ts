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
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../role.enum';
import { WorkSession } from 'src/work-sessions/entities/work-session.entity';
import { Company } from 'src/companies/entities/company.entity';

@Entity('users')
export class User {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Column()
  password: string;

  @ApiProperty({ enum: Role })
  @Column({ type: 'varchar' })
  role: Role;

  @ApiPropertyOptional({ type: () => Company })
  @OneToOne(() => Company, (company) => company.owner)
  ownedCompany: Company;

  @ApiPropertyOptional({ type: () => Company })
  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  @ApiHideProperty()
  @OneToMany(() => WorkSession, (workSession) => workSession.user)
  workSessions: WorkSession[];

  @ApiProperty({ type: String, format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @UpdateDateColumn()
  updatedAt: Date;
}
