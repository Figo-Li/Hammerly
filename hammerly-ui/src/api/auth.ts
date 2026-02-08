type LoginReq = { email: string; password: string };
type RegisterReq = { firstName: string; lastName: string; email: string; password: string };

export type AuthResponse = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  token?: string;
};

const mockUser = {
  id: 'mock-user-001',
  firstName: 'User',
  lastName: '001',
  email: 'user001@hammerly.com',
  phone: '+1 1234567890',
  avatarImage: '/images/user.jpg',
  password: '123456789'
};

// ================= MOCK API =================
export async function loginApi(payload: LoginReq): Promise<AuthResponse> {
  await fakeDelay();
  return {
    user: mockUser,
  };
}

export async function registerApi(payload: RegisterReq): Promise<AuthResponse> {
  await fakeDelay();
  return {
    user: mockUser,
  };
}

function fakeDelay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''; // ex: http://localhost:3000

// export async function loginApi(payload: LoginReq): Promise<AuthResponse> {
//   const res = await fetch(`${API_BASE}/api/auth/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });

//   if (!res.ok) {
//     const msg = await safeMsg(res);
//     throw new Error(msg || 'Login failed');
//   }
//   return res.json();
// }

// export async function registerApi(payload: RegisterReq): Promise<AuthResponse> {
//   const res = await fetch(`${API_BASE}/api/auth/register`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });

//   if (!res.ok) {
//     const msg = await safeMsg(res);
//     throw new Error(msg || 'Register failed');
//   }
//   return res.json();
// }

// async function safeMsg(res: Response) {
//   try {
//     const data = await res.json();
//     return data?.message;
//   } catch {
//     return '';
//   }
// }
