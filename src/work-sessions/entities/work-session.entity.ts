import { Company } from 'src/companies/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('work_sessions')
export class WorkSession {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @Column()
  startAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @Column()
  endAt: Date;

  @ApiPropertyOptional({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.workSessions)
  user: User;

  @ApiProperty({ type: () => Company })
  @ManyToOne(() => Company, (company) => company.workSessions)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ApiProperty({ type: String, format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @UpdateDateColumn()
  updatedAt: Date;
}
