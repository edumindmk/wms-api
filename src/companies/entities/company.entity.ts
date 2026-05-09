import { User } from "src/users/entities/user.entity";
import { WorkSession } from "src/work-sessions/entities/work-session.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    address?: string;
    
    @OneToMany(() => User, (user) => user.company)
    users: User[];

    @OneToMany(() => WorkSession, (workSession) => workSession.company)
    workSessions: WorkSession[];

    @OneToOne(() => User, (user) => user.ownedCompany)
    @JoinColumn()
    owner: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
