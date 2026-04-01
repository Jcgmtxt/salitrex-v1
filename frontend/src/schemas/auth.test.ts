import { loginSchema } from './auth';

describe('loginSchema', () => {
  it('should validate correct email and password', () => {
    const result = loginSchema.safeParse({
      username: 'admin@salitrex.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email format', () => {
    const result = loginSchema.safeParse({
      username: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('username');
    }
  });

  it('should reject email without @', () => {
    const result = loginSchema.safeParse({
      username: 'adminemail.com',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = loginSchema.safeParse({
      username: 'admin@salitrex.com',
      password: '123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('password');
    }
  });

  it('should reject empty email', () => {
    const result = loginSchema.safeParse({
      username: '',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty password', () => {
    const result = loginSchema.safeParse({
      username: 'admin@salitrex.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing fields', () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBe(2);
    }
  });
});