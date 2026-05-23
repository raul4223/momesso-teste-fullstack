import { TypeOrmModule } from '@nestjs/typeorm';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn} from 'typeorm';
import { Company } from '../companies/company.entity';
import { Role } from '../common/enums/role.enum';
import { Exclude } from 'class-transformer'

@Entity('user')

export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column({type: 'enum', enum: Role, default: Role.USER,})
    role: Role;

    @Column()
    companyId: string;

    //muitos Users em uma Company
    @ManyToOne(() => Company, (company) => company.users, {
        onDelete: 'CASCADE',//deleta os registros filho automaticamente quando o registro PAI e deletado
    } )

    @JoinColumn({name: 'companyId'})
    company: Company;

    @CreateDateColumn()
    createdAt: Date;
}