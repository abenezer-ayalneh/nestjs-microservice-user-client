import { RecordSchema } from 'cirql';
import { z } from 'zod';

export const User = RecordSchema.extend({
  id: z.string(),
  name: z.optional(z.string()),
  email: z.string(),
  email_verified_at: z.optional(z.string()),
  password: z.optional(z.string()),
  plan: z.optional(z.number()),
  plan_expire_date: z.optional(z.string()),
  requested_plan: z.number().default(0),
  type: z.optional(z.string()),
  avatar: z.optional(z.string()),
  lang: z.optional(z.string()),
  mode: z.string().default('light'),
  created_by: z.number().default(0),
  default_pipeline: z.optional(z.number()),
  delete_status: z.number().default(1),
  is_active: z.number().default(1),
  remember_token: z.optional(z.string()),
  last_login_at: z.optional(z.date()),
  created_at: z.optional(z.string()),
  updated_at: z.optional(z.string()),
  active_status: z.boolean().default(false),
  dark_mode: z.boolean().default(false),
  messengerColor: z.string().default('#2180F3'),
  roles: z.optional(z.string().array()),
  permissions: z.optional(z.string().array()),
});
