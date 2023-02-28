import { RecordSchema } from 'cirql';
import { z } from 'zod';

export const Role = RecordSchema.extend({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});
