import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/companies/entities/company.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum AbsenceType {
    VACATION = 'vacation',
    SICK = 'sick',
}

export enum AbsenceStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

@Entity('absences')
export class Absence {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.absences)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ApiProperty({ type: () => Company })
    @ManyToOne(() => Company, (company) => company.absences)
    @JoinColumn({ name: 'companyId' })
    company: Company;

    @ApiProperty({ type: () => AbsenceType })
    @Column({ type: 'enum', enum: AbsenceType })
    type: AbsenceType;

    @ApiProperty({ type: String, format: 'date-time' })
    @Column()
    startDate: Date;

    @ApiProperty({ type: String, format: 'date-time' })
    @Column()
    endDate: Date;

    @ApiProperty({ type: () => AbsenceStatus })
    @Column({ type: 'enum', enum: AbsenceStatus })
    status: AbsenceStatus;

    @ApiProperty({ type: Number })
    @Column()
    totalDays: number;

    @ApiProperty({ type: String, format: 'date-time' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ type: String, format: 'date-time' })
    @UpdateDateColumn()
    updatedAt: Date;
}
