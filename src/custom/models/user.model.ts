import { RecordSchema } from 'cirql';
import { z } from 'zod';

export const User = RecordSchema.extend({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  email_verified_at: z.string().optional(),
  password: z.string(),
  plan: z.number().optional(),
  plan_expire_date: z.string().optional(),
  requested_plan: z.number().optional(),
  type: z.string().optional(),
  avatar: z.string().optional(),
  lang: z.string().optional(),
  mode: z.string().optional(),
  created_by: z.number().optional(),
  default_pipeline: z.number().optional(),
  delete_status: z.number().optional(),
  is_active: z.boolean().optional(),
  remember_token: z.string().optional(),
  last_login_at: z.date().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  active_status: z.number().optional(),
  dark_mode: z.number().optional(),
  messenger_color: z.string().optional(),
});
