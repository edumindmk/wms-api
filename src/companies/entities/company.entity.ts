import { User } from 'src/users/entities/user.entity';
import { WorkSession } from 'src/work-sessions/entities/work-session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Absence } from 'src/absences/entities/absence.entity';

@Entity('companies')
export class Company {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ unique: true })
  name: string;

  @ApiProperty({ required: false, nullable: true })
  @Column({ nullable: true })
  address?: string;

  @ApiHideProperty()
  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @ApiHideProperty()
  @OneToMany(() => WorkSession, (workSession) => workSession.company)
  workSessions: WorkSession[];

  @ApiHideProperty()
  @OneToOne(() => User, (user) => user.ownedCompany)
  @JoinColumn()
  owner: User;

  @ApiHideProperty()
  @OneToMany(() => Absence, (absence) => absence.company, { nullable: true })
  absences: Absence[];

  @ApiProperty({ type: String, format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @UpdateDateColumn()
  updatedAt: Date;
}
