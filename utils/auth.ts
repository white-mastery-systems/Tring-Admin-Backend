import { toast } from "vue-sonner";

export enum AuthRoles {
  Guest = "guest",
  User = "user",
  Admin = "admin",
}

export type AuthRoleMiddlewares =
  | "guest-only"
  | "user-only"
  | "admin-only"
  | "guest"
  | "user"
  | "admin";

const login = async (values: Record<string, any>) => {
  try {
    const data = await $fetch("/api/auth/sign-in", {
      method: "post",
      body: values,
    });

    return navigateTo("/");
  } catch (error: any) {
    toast.error(error?.statusMessage || "An error occurred");
  }
};

const signup = async (values: Record<string, any>) => {
  try {
    const data = await $fetch("/api/auth/signup", {
      method: "post",
      body: values,
      redirect: "follow",
    });
    // @ts-expect-error
    return navigateTo(data);
  } catch (error: any) {
    toast.error(error?.statusMessage || "An error occurred");
  }
};
const forgotPassword = async (values: Record<string, any>) => {
  try {
    const data = await $fetch("/api/user/requestResetPassword", {
      method: "post",
      body: values,
    });
      toast.success("Your password change request was successful. Please check your email for further details");
  } catch (error: any) {
    toast.error(error?.statusMessage || "An error occurred");
  }
};
const resetPassword = async (values: Record<string, any>,token:any) => {
  try {
    const data = await $fetch("/api/user/forgot-password?token=" + token, {
      method: "post",
      body: values,
    });
      toast.success("Your password changed successfully");
     return navigateTo("/");
  } catch (error: any) {
    toast.error(error?.statusMessage || "An error occurred");
  }
};

const logout = async () => {
  await $fetch("/api/auth/logout", {
    method: "POST",
  });
  (await useUser()).clearUser();
  return navigateTo({ name: "auth-sign-in" });
};

const redirectToRoleHome = (role: AuthRoles) => {
  // update routes on needs
  if (role === AuthRoles.User) {
    return navigateTo("/");
  } else if (role === AuthRoles.Admin) {
    return navigateTo("/");
  }
};

export const authHandlers = {
  login,
  signup,
  logout,
  redirectToRoleHome,
  forgotPassword,
  resetPassword,
};
