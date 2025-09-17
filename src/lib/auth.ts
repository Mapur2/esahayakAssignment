import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  name: string;
}

// Simple demo authentication - in production, use proper auth like NextAuth.js
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user');
  
  if (!userCookie) {
    return null;
  }
  
  try {
    return JSON.parse(userCookie.value);
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

export async function login(email: string, name: string): Promise<User> {
  const user: User = {
    id: crypto.randomUUID(),
    email,
    name,
  };
  
  const cookieStore = await cookies();
  cookieStore.set('user', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  
  return user;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('user');
}
