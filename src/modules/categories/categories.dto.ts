import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createProductsSchema = z.object({
  name: z.string().max(100),
  description: z.string(),
});

// class is required for using DTO as a type
export class CreateOrUpdateCategoriesUsDto extends createZodDto(
  createProductsSchema,
) {}
