import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

export interface EmpUser {
  id: string;
  email: string;
  name: string;
  role: "employee" | "admin";
}

export interface EmpSessionData extends EmpUser {
  loggedInAt: string;
  expiresAt: number;
}

const COOKIE_NAME = "ciel_emp_session";
// Secret key for HMAC signature of employee sessions
const SECRET_KEY =
  process.env.EMPLOYEE_SESSION_SECRET ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "ciel-employee-portal-secret-key-2026";

/** Get configured authorized accounts from server environment */
export function getAuthorizedEmpUsers(): (EmpUser & { password: string })[] {
  return [
    {
      id: "emp-1",
      email: (process.env.EMPLOYEE_1_EMAIL || "employee1@ciel.edu.in").trim().toLowerCase(),
      password: process.env.EMPLOYEE_1_PASSWORD || "Emp1@Ciel2026",
      name: process.env.EMPLOYEE_1_NAME || "Employee 1",
      role: "employee",
    },
    {
      id: "emp-2",
      email: (process.env.EMPLOYEE_2_EMAIL || "employee2@ciel.edu.in").trim().toLowerCase(),
      password: process.env.EMPLOYEE_2_PASSWORD || "Emp2@Ciel2026",
      name: process.env.EMPLOYEE_2_NAME || "Employee 2",
      role: "employee",
    },
    {
      id: "emp-3",
      email: (process.env.EMPLOYEE_3_EMAIL || "employee3@ciel.edu.in").trim().toLowerCase(),
      password: process.env.EMPLOYEE_3_PASSWORD || "Emp3@Ciel2026",
      name: process.env.EMPLOYEE_3_NAME || "Employee 3",
      role: "employee",
    },
    {
      id: "emp-admin",
      email: (process.env.EMPLOYEE_ADMIN_EMAIL || "empadmin@ciel.edu.in").trim().toLowerCase(),
      password: process.env.EMPLOYEE_ADMIN_PASSWORD || "EmpAdmin@Ciel2026",
      name: process.env.EMPLOYEE_ADMIN_NAME || "Employee Admin",
      role: "admin",
    },
  ];
}

/** Generate a signed session token for an employee user */
export function createSessionToken(user: EmpUser): string {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 12; // 12 hours session
  const payload: EmpSessionData = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    loggedInAt: new Date().toISOString(),
    expiresAt,
  };

  const jsonStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(jsonStr).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(base64Payload)
    .digest("hex");

  return `${base64Payload}.${signature}`;
}

/** Verify signature and parse session token */
export function parseSessionToken(token: string): EmpSessionData | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [base64Payload, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(base64Payload)
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const jsonStr = Buffer.from(base64Payload, "base64url").toString("utf-8");
    const payload: EmpSessionData = JSON.parse(jsonStr);

    if (Date.now() > payload.expiresAt) {
      return null; // Expired session
    }

    // Verify payload user matches one of the authorized 4 users
    const authorized = getAuthorizedEmpUsers().find((u) => u.id === payload.id);
    if (!authorized) return null;

    return payload;
  } catch {
    return null;
  }
}

/** Server-side authentication check for employee portal */
export async function getEmpSession(): Promise<EmpSessionData | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;
  return parseSessionToken(cookie.value);
}

/** Enforce authentication and optional role check */
export async function requireEmpSession(requiredRole?: "employee" | "admin"): Promise<EmpSessionData> {
  const session = await getEmpSession();
  if (!session) {
    redirect("/emp/login");
  }

  if (requiredRole && session.role !== requiredRole) {
    if (session.role === "admin") {
      redirect("/emp/admin");
    } else {
      redirect("/emp/dashboard");
    }
  }

  return session;
}

/** Authenticate credentials against configured accounts */
export function authenticateEmpCredentials(
  emailOrUsername: string,
  passwordInput: string
): EmpUser | null {
  const inputClean = emailOrUsername.trim().toLowerCase();
  const users = getAuthorizedEmpUsers();

  const matched = users.find(
    (u) =>
      u.email === inputClean ||
      u.id === inputClean ||
      u.name.toLowerCase() === inputClean
  );

  if (!matched) return null;

  // Verify password using timing safe comparison
  const passBuf = Buffer.from(passwordInput);
  const targetBuf = Buffer.from(matched.password);

  if (passBuf.length !== targetBuf.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(passBuf, targetBuf)) {
    return null;
  }

  return {
    id: matched.id,
    email: matched.email,
    name: matched.name,
    role: matched.role,
  };
}

export { COOKIE_NAME };
