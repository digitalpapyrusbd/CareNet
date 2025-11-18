import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions, Algorithm } from 'jsonwebtoken';

// Security configuration
export const SECURITY_CONFIG = {
  // Password requirements
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    saltRounds: 12,
  },
  
  // JWT configuration
  jwt: {
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
    algorithm: 'HS256',
    issuer: 'caregiver-platform',
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // Limit each IP to 100 requests per windowMs
    authRequests: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // Limit auth attempts to 5 per windowMs
    },
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3, // Limit password reset to 3 per hour
    },
  },
  
  // Session configuration
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  },
  
  // CORS configuration
  cors: {
    origin: process.env.NEXT_PUBLIC_CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
  },
  
  // File upload security
  fileUpload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    virusScan: process.env.NODE_ENV === 'production',
  },
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const { minLength, maxLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars } = SECURITY_CONFIG.password;
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  
  if (password.length > maxLength) {
    errors.push(`Password must not exceed ${maxLength} characters`);
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Phone number validation for Bangladesh
export const validateBangladeshPhone = (phone: string): boolean => {
  // Remove any spaces, dashes, or parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check for Bangladesh format: +8801[3-9]\d{8}
  const bangladeshRegex = /^\+8801[3-9]\d{8}$/;
  
  return bangladeshRegex.test(cleanPhone);
};

// Generate secure random token
export const generateSecureToken = (length = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate OTP
export const generateOTP = (length = 6): string => {
  const digits = '0123456789';
  let OTP = '';
  
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * digits.length)];
  }
  
  return OTP;
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SECURITY_CONFIG.password.saltRounds);
  return bcrypt.hash(password, salt);
};

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Generate JWT tokens
export const generateTokens = (userId: string, userRole: string): { accessToken: string; refreshToken: string } => {
  const payload = {
    userId,
    role: userRole,
    type: 'access',
  };
  
  const accessTokenOptions: SignOptions = {
    expiresIn: SECURITY_CONFIG.jwt.accessTokenExpiry as string,
    algorithm: SECURITY_CONFIG.jwt.algorithm as Algorithm,
    issuer: SECURITY_CONFIG.jwt.issuer,
  };
  
  const refreshTokenOptions: SignOptions = {
    expiresIn: SECURITY_CONFIG.jwt.refreshTokenExpiry as string,
    algorithm: SECURITY_CONFIG.jwt.algorithm as Algorithm,
    issuer: SECURITY_CONFIG.jwt.issuer,
  };
  
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'fallback-secret',
    accessTokenOptions
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    refreshTokenOptions
  );
  
  return { accessToken, refreshToken };
};

// Verify JWT token
export const verifyToken = (token: string, isRefreshToken = false): any => {
  try {
    const secret = isRefreshToken
      ? process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret'
      : process.env.JWT_SECRET || 'fallback-secret';
    
    return jwt.verify(token, secret, {
      algorithms: [SECURITY_CONFIG.jwt.algorithm as jwt.Algorithm],
      issuer: SECURITY_CONFIG.jwt.issuer,
    });
  } catch (error) {
    return null;
  }
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Generate CSRF token
export const generateCSRFToken = (): string => {
  return generateSecureToken(32);
};

// Validate file upload
export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
  const { maxFileSize, allowedMimeTypes } = SECURITY_CONFIG.fileUpload;
  
  if (file.size > maxFileSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${maxFileSize / (1024 * 1024)}MB`,
    };
  }
  
  if (!allowedMimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not allowed',
    };
  }
  
  return { isValid: true };
};

// Rate limiter implementation
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private windowMs: number,
    private maxRequests: number
  ) {}
  
  isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const timestamps = this.requests.get(key)!;
    
    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);
    
    // Check if under the limit
    if (validTimestamps.length >= this.maxRequests) {
      return false;
    }
    
    // Add current timestamp and update
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    
    return true;
  }
  
  reset(key?: string): void {
    if (key) {
      this.requests.delete(key);
    } else {
      this.requests.clear();
    }
  }
}

// Create rate limiters for different use cases
export const authRateLimiter = new RateLimiter(
  SECURITY_CONFIG.rateLimit.authRequests.windowMs,
  SECURITY_CONFIG.rateLimit.authRequests.maxRequests
);

export const generalRateLimiter = new RateLimiter(
  SECURITY_CONFIG.rateLimit.windowMs,
  SECURITY_CONFIG.rateLimit.maxRequests
);

export const passwordResetRateLimiter = new RateLimiter(
  SECURITY_CONFIG.rateLimit.passwordReset.windowMs,
  SECURITY_CONFIG.rateLimit.passwordReset.maxRequests
);