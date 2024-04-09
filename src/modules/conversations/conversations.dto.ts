import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateOrUpdateConversationsDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organizationToId: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  enableSendEmail: boolean;
}

export class CreateMessageConversationsDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  fkConversationId: string;

  @IsNotEmpty()
  @IsBoolean()
  enableSendEmail: boolean;
}

export class GetMessageConversationsDto {
  @IsNotEmpty()
  @IsString()
  fkConversationId: string;
}
