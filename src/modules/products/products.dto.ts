import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateProductsSchema = z.object({
  title: z.string(),
  subTitle: z.string().optional(),
});

// class is required for using DTO as a type
class CreateProductsDto extends createZodDto(CreateProductsSchema) {}
