import { IsNotEmpty } from 'class-validator';

export class StatusUpdateRequest {
  @IsNotEmpty()
  status: string;
}
