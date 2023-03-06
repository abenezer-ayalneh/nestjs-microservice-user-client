import { RecordSchema } from 'cirql';
import { z } from 'zod';

export const Permission = RecordSchema.extend({
  id: z.string(),
  name: z.string(),
  description: z.optional(z.string()),
});
