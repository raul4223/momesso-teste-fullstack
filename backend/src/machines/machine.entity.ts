import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { Company } from '../companies/company.entity';

@Entity('machine')

export class Machine{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({unique: true})
    serialNumber: string;

    @Column()
    companyId: string;

    @ManyToOne(() => Company, (company) => company.machines, {
        onDelete: 'CASCADE',//deleta os registros filho automaticamente quando o registro PAI e deletado
    })

    @JoinColumn({name: 'companyId'})
    company: Company;

    @CreateDateColumn()
    createdAt: Date;
}