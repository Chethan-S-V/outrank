import { hashPassword, verifyPassword } from "./admin";

export interface AdminAccount {
  id: string;
  username: string;
  email: string;
  role: "super_admin" | "moderator" | "auditor";
  passwordHash: string;
  createdAt: string;
}

// Global active store of created admins
const activeAdmins: AdminAccount[] = [
  {
    id: "admin-root",
    username: "admin",
    email: "security@outrank.io",
    role: "super_admin",
    passwordHash: hashPassword("admin@123"),
    createdAt: new Date().toISOString(),
  },
];

export function listAdmins(): Array<Omit<AdminAccount, "passwordHash">> {
  return activeAdmins.map(({ passwordHash, ...rest }) => rest);
}

export function createAdminAccount({
  username,
  email,
  password,
  role = "moderator",
}: {
  username: string;
  email: string;
  password: string;
  role?: "super_admin" | "moderator" | "auditor";
}): Omit<AdminAccount, "passwordHash"> {
  const normUser = username.trim().toLowerCase();
  const existing = activeAdmins.find((a) => a.username.toLowerCase() === normUser);
  if (existing) {
    throw new Error(`Admin with username '${username}' already exists.`);
  }

  const newAdmin: AdminAccount = {
    id: `admin-${Date.now()}`,
    username: username.trim(),
    email: email.trim().toLowerCase(),
    role,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  activeAdmins.push(newAdmin);

  const { passwordHash, ...safeAdmin } = newAdmin;
  return safeAdmin;
}

export function verifyAdminAccountCredentials(username: string, password: string): boolean {
  const normUser = username.trim().toLowerCase();
  const admin = activeAdmins.find(
    (a) => a.username.toLowerCase() === normUser || a.email.toLowerCase() === normUser
  );
  if (!admin) return false;
  return verifyPassword(password, admin.passwordHash);
}
