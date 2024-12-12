import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @IsNotEmpty()
    name: string;

   
}