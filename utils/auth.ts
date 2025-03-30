import { toast } from "vue-sonner";


interface UserResponse {
  refreshUser: () => Promise<void>; // Replace with the actual type of `refreshUser`
}


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
  const { refreshUser }: UserResponse = await useUser();
  try {
    const data: any = await $fetch("/api/auth/sign-in", {
      method: "post",
      body: values,
    });
    await refreshUser()
    // (await useUser()).refreshUser();
  } catch (error: any) {
    toast.error(error?.statusMessage || "An error occurred");
    if (error?.statusMessage === "User not verified. Please verify your account to proceed.") {
      localStorage.setItem("userDetails", JSON.stringify(error?.data.data))
      return navigateTo("/auth/onboarding/select-bot-power");
    } else if (error?.statusMessage === "Onboarding process is incomplete. Please provide your details to proceed.") {
      return navigateTo("/auth/onboarding");
    }
  }
};

const signup = async (values: Record<string, any>) => {
  try {
    const data = await $fetch("/api/auth/signup", {
      method: "post",
      body: values,
      redirect: "follow",
    });
    localStorage.setItem("userDetails", JSON.stringify(data?.data))
    // @ts-expect-error
    return navigateTo("/auth/onboarding/select-bot-power");
    // return navigateTo("/auth/verify-otp");
    // return navigateTo(data);
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
    toast.success(
      "Your password change request was successful. Please check your email for further details",
    );
  } catch (error: any) {
    toast.error(error?.statusMessage || "An error occurred");
  }
};
const resetPassword = async (values: Record<string, any>, token: any) => {
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
  try {
    const response: any = await $fetch("/api/auth/logout", {
      method: "POST",
    });
    if (response.status) {
      (await useUser()).clearUser();
      return navigateTo({ name: "auth-sign-in" });
    } else {
      console.error("Logout failed:", response.message);
    }
  } catch (error) {
    if (error?.toString().indexOf("400") > -1) {
      (await useUser()).clearUser();
      return navigateTo({ name: "auth-sign-in" });
    }
  }
};

const redirectToRoleHome = (role: AuthRoles) => {
  // update routes on needs
  if (role === AuthRoles.User) {
    return navigateTo("/");
  } else if (role === AuthRoles.Admin) {
    return navigateTo("/");
  }
};

const OtpVerification = async (values: Record<string, any>) => {
  try {
    const dataOtpResponse = await $fetch("/api/auth/verifyOtp", {
      method: "post",
      body: values,
    });
    toast.success("OTP verified successfully!");
    await $fetch('/api/auth/onboarding', {
      method: 'POST',
      body: {
        companyName: 'Self'
      },
    });
    return navigateTo("/auth/onboarding/billing");
  } catch (error: any) {
    toast.error(error?.statusMessage || "Invalid OTP");
  }
};

const resendOtpVerification = async (values: Record<string, any>) => {
  try {
    await $fetch("/api/auth/resendOtp", {
      method: "post",
      body: values,
    });
    toast.success("OTP resent successfully!");
    return navigateTo({ name: "auth-forgot-password" });
  } catch (error: any) {
    toast.error(error?.statusMessage || "An error occurred");
  }
};

export const authHandlers = {
  login,
  signup,
  logout,
  redirectToRoleHome,
  forgotPassword,
  resetPassword,
  OtpVerification,
  resendOtpVerification,
};
