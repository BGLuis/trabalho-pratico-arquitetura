import { IsString, IsNotEmpty, IsEmail, IsDateString, IsPhoneNumber, Length, IsNumberString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  birthDate: string;

  @IsNumberString()
  @Length(11, 11)
  cpf: string;

  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullAddress: string;
}
