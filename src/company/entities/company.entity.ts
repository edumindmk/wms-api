import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @OneToMany(() => User, (user) => user.company)
    users: User[];

    @ManyToOne(() => User, (user) => user.companiesOwned)
    @JoinColumn()
    owner: User;
}
