import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMachineDto {
  @IsNotEmpty({ message: 'O nome da máquina é obrigatório.' })
  @IsString({ message: 'O nome da máquina deve ser em texto.' })
  name: string;

  @IsNotEmpty({ message: 'O número de série é obrigatório.' })
  @IsString({ message: 'O número de série deve ser em texto.' })
  serialNumber: string;

  @IsNotEmpty({ message: 'A empresa é obrigatória.' })
  @IsUUID('4', { message: 'O companyId deve ser um UUID válido.' })
  companyId: string;
}