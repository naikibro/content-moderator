import { IsString, IsNotEmpty } from 'class-validator';

export class ModerateTextDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
