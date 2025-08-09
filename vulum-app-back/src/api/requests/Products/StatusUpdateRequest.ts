import { IsNotEmpty } from 'class-validator';

export class StatusUpdateRequest {
  @IsNotEmpty()
  Status: string;
}
