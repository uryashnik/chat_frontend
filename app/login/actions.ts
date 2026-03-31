'use server';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;

export interface LoginState {
  errors?: {
    login?: string;
    password?: string;
    general?: string;
  };
  success?: boolean;
  login?: string;
  password?: string;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const login = (formData.get('login') as string) ?? '';
  const password = (formData.get('password') as string) ?? '';

  const errors: NonNullable<LoginState['errors']> = {};

  if (!login.trim()) {
    errors.login = 'Login is required';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!PASSWORD_REGEX.test(password)) {
    errors.password =
      'Password must contain at least one uppercase letter and one special character !@#$%^&*';
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { errors: { general: data?.message ?? 'Invalid credentials' } };
    }

    return { success: true };
  } catch {
    return { errors: { general: 'Unable to connect to server. Please try again.' }, login, password  };
  }
}
