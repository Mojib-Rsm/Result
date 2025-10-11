import { z } from 'zod';

export const formSchema = z.object({
  exam: z.string().min(1, 'পরীক্ষা নির্বাচন আবশ্যক।'),
  year: z.string().min(1, 'বছর নির্বাচন আবশ্যক।'),
  board: z.string().min(1, 'বোর্ড নির্বাচন আবশ্যক।'),
  roll: z.string().min(1, 'রোল নম্বর আবশ্যক।'),
  reg: z.string().min(1, 'রেজিস্ট্রেশন নম্বর আবশ্যক।'),
  captcha: z.string().min(1, 'ক্যাপচা আবশ্যক।'),
});

// This is a new type that extends the original form schema with the cookie
export const formSchemaWithCookie = formSchema.extend({
    cookie: z.string().optional(),
});
