import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateConversationDto {
  @IsArray()
  participant_ids: string[];

  @IsString()
  type: string;
}

export class SendMessageDto {
  @IsString()
  conversation_id: string;

  @IsString()
  content: string;

  @IsArray()
  @IsOptional()
  attachment_urls?: string[];
}
