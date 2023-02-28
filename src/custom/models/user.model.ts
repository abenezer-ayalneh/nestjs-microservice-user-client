import { RecordSchema } from 'cirql';
import { z } from 'zod';

export const User = RecordSchema.extend({
  id: z.string(),
  name: z.string().nullable().default(null),
  email: z.string(),
  email_verified_at: z.string().nullable().default(null),
  password: z.string().nullable().default(null),
  plan: z.number().nullable().default(null),
  plan_expire_date: z.string().nullable().default(null),
  requested_plan: z.number().nullable().default(0),
  type: z.string().nullable().default(null),
  avatar: z.string().nullable().default(null),
  lang: z.string().nullable().default(null),
  mode: z.string().nullable().default('light'),
  created_by: z.number().nullable().default(0),
  default_pipeline: z.number().nullable().default(null),
  delete_status: z.number().nullable().default(1),
  is_active: z.boolean().nullable().default(true),
  remember_token: z.string().nullable().default(null),
  last_login_at: z.date().nullable().default(null),
  created_at: z.string().nullable().default(null),
  updated_at: z.string().nullable().default(null),
  active_status: z.number().nullable().default(0),
  dark_mode: z.number().nullable().default(0),
  messenger_color: z.string().nullable().default('#2180F3'),
});
