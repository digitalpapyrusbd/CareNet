declare module 'speakeasy' {
  export interface GenerateSecretOptions {
    name: string;
    issuer?: string;
    length?: number;
  }

  export interface GenerateSecretResult {
    ascii: string;
    hex: string;
    base32: string;
    qr_code_ascii?: string;
    qr_code_hex?: string;
    qr_code_base32?: string;
    google_auth_qr?: string;
    otpauth_url?: string;
  }

  export interface TotpOptions {
    secret: string;
    encoding?: 'ascii' | 'hex' | 'base32' | 'base64';
    time?: number;
    step?: number;
    window?: number;
    counter?: number;
    digits?: number;
    algorithm?: 'sha1' | 'sha256' | 'sha512';
    issuer?: string;
    label?: string;
  }

  export function generateSecret(options: GenerateSecretOptions): GenerateSecretResult;
  export function totp(options: TotpOptions): string;
  export function verifyDelta(options: TotpOptions & { token: string }): { delta: number } | null;
  export function verify(options: TotpOptions & { token: string }): boolean;
}
