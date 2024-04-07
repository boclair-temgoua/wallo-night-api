import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateOrUpdateConversationsDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organizationToId: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class CreateMessageConversationsDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  fkConversationId: string;
}

export class GetMessageConversationsDto {
  @IsNotEmpty()
  @IsString()
  fkConversationId: string;
}
