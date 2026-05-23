import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateMachineDto {
  @IsOptional()
  @IsString({ message: 'O nome da máquina deve ser em texto.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'O número de série deve ser em texto.' })
  serialNumber?: string;

  @IsOptional()
  @IsUUID('4', { message: 'O companyId deve ser um UUID válido.' })
  companyId?: string;
}