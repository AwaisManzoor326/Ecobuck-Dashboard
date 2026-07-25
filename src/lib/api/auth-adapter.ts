import { User } from "../../types";
import { MOCK_USERS } from "../constants";
import { getStoredUser, setStoredUser } from "../storage";

export interface AuthAdapter {
  login(email: string, password: string, rememberMe?: boolean): Promise<User>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<User | null>;
}

export class MockAuthAdapter implements AuthAdapter {
  async login(email: string, password: string, _rememberMe = true): Promise<User> {
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 400));

    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = MOCK_USERS.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!matchedUser) {
      throw new Error("Invalid credentials. Please use demo accounts provided.");
    }

    if (!password || password.length < 3) {
      throw new Error("Password must be at least 3 characters.");
    }

    setStoredUser(matchedUser);
    return matchedUser;
  }

  async logout(): Promise<void> {
    await new Promise((res) => setTimeout(res, 150));
    setStoredUser(null);
  }

  async getCurrentSession(): Promise<User | null> {
    return getStoredUser();
  }
}

export const authAdapter = new MockAuthAdapter();
