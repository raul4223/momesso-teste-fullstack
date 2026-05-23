import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import { User } from '../users/user.entity';
import { Machine } from '../machines/machine.entity';

@Entity('company')
export class Company {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({unique: true})
    cnpj: string

    @CreateDateColumn()
    createdAt: Date;

    //relacionamento: uma empresa tem varios usuarios
    @OneToMany(() => User, (user) => user.company)
    users: User[];

    //relacionamento: uma empresa pode ter varias maquinas
    @OneToMany(() => Machine, (machine) => machine.company)
    machines: Machine[];
}
  
