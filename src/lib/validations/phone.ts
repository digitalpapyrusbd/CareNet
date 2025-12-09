import { z } from 'zod';

// Bangladesh phone validation and normalization
// Accepts: +8801XXXXXXXXX or 01XXXXXXXXX
export const bangladeshPhoneSchema = z.string()
  .regex(/^(\+8801|01)\d{9}$/, 'Invalid Bangladesh phone number')
  .refine((phone) => {
    const cleaned = phone.startsWith('+880') ? phone.substring(4) : phone.substring(0);
    const prefix = cleaned.substring(0, 3); // e.g. '013'
    const validPrefixes = ['013', '014', '015', '016', '017', '018', '019'];
    return validPrefixes.includes(prefix);
  }, 'Unsupported operator');

export function normalizeBangladeshPhone(phone: string) {
  if (phone.startsWith('01')) return '+880' + phone.substring(1);
  return phone;
}

export const bangladeshPhone = z.preprocess((arg) => {
  if (typeof arg !== 'string') return arg;
  const trimmed = arg.trim();
  return normalizeBangladeshPhone(trimmed);
}, bangladeshPhoneSchema);

export default bangladeshPhone;
