// src/pages/Login.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useUserStore } from "../store/useStore";

// Import the new ImageUploader component
import ImageUploader from "../ImageUploader/index";

// Assuming these components exist; adjust paths as needed
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";

// Define interfaces for component props (adjust based on your component definitions)
interface ButtonProps {
  variant?: "default" | "outline" | "ghost" | "link";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
}

interface InputProps {
  id?: string;
  name?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
}

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

interface LabelProps {
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

interface SkeletonProps {
  className?: string;
}

// Define interfaces for API payloads
interface SendOtpPayload {
  email: string;
}

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

interface RegisterPayload {
  email: string;
  firstname: string;
  lastname: string;
  regionId: string;
  birthYear: string;
  password: string;
  img: string; // URL string
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface Region {
  regionId: string;
  name: string;
}

const axiosInstance = axios.create({
  baseURL: "https://keldibekov.online",
});

// API functions with TypeScript types
const fetchRegions = async (): Promise<Region[]> => {
  try {
    const response = await axiosInstance.get("/region");
    console.log("Regions API response:", response.data);

    let regionsData: Region[] = [];

    if (Array.isArray(response.data)) {
      regionsData = response.data.map((item: any) => ({
        regionId: item.regionId || item.id,
        name: item.name,
      }));
    } else if (response.data?.regions && Array.isArray(response.data.regions)) {
      regionsData = response.data.regions.map((item: any) => ({
        regionId: item.regionId || item.id,
        name: item.name,
      }));
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      regionsData = response.data.data.map((item: any) => ({
        regionId: item.regionId || item.id,
        name: item.name,
      }));
    } else {
      console.warn("Unexpected regions API response structure:", response.data);
      return [];
    }

    console.log("Mapped regions:", regionsData);
    return regionsData;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error("Regions API error response:", error.response.data);
      throw new Error(error.response.data.message || "Failed to fetch regions");
    }
    console.error("Regions API error:", error);
    throw new Error("An error occurred while fetching regions");
  }
};

const sendOtp = async (email: string): Promise<void> => {
  try {
    await axiosInstance.post("/auth/send-otp", { email } as SendOtpPayload);
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || "Failed to send OTP");
    }
    throw new Error("An error occurred while sending OTP");
  }
};

const verifyOtp = async (payload: VerifyOtpPayload): Promise<void> => {
  try {
    await axiosInstance.post("/auth/verify-otp", payload);
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || "Invalid OTP");
    }
    throw new Error("An error occurred while verifying OTP");
  }
};

const registerUser = async (userData: RegisterPayload): Promise<void> => {
  try {
    console.log("Register payload:", userData);
    await axiosInstance.post("/auth/register", userData, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error("Register API error response:", error.response.data);
      throw new Error(error.response.data.message || "Registration failed");
    }
    console.error("Register error:", error);
    throw new Error("An error occurred during registration");
  }
};

const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/auth/login", payload);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message || "Invalid email or password");
    }
    throw new Error("An error occurred during login");
  }
};

const Login: React.FC = () => {
  const [activeView, setActiveView] = useState<"login" | "registerEmail" | "verifyOtp" | "registerDetails">("login");
  const [loginForm, setLoginForm] = useState<LoginPayload>({ email: "", password: "" });
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [otpForm, setOtpForm] = useState<string[]>(["", "", "", "", "", ""]);
  const [registerForm, setRegisterForm] = useState<RegisterPayload>({
    email: "",
    firstname: "",
    lastname: "",
    regionId: "",
    birthYear: "",
    password: "",
    img: "",
  });
  const [error, setError] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(60);
  const navigate = useNavigate();
  const { setUser, fetchUserDetails } = useUserStore(); // Add fetchUserDetails

  // Fetch regions
  const { data: regions, error: regionsError, isLoading: regionsLoading } = useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });

  useEffect(() => {
    if (regionsError) {
      setError(regionsError.message);
    }
  }, [regionsError]);

  // Resend OTP timer
  useEffect(() => {
    if (activeView !== "verifyOtp" || resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeView, resendTimer]);

  // Mutations
  const sendOtpMutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: () => {
      setActiveView("verifyOtp");
      setRegisterForm((prev) => ({ ...prev, email: registerEmail }));
      setResendTimer(60);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      setActiveView("registerDetails");
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      // After successful registration, automatically log in
      loginMutation.mutate({ email: registerForm.email, password: registerForm.password });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data: LoginResponse) => {
      // Save user data to Zustand store
      setUser({ email: loginForm.email || registerForm.email, token: data.token });
      // Fetch additional user details
      await fetchUserDetails();
      navigate("/profile"); // Redirect to profile page after login
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Handle input changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterEmail(e.target.value);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otpForm];
    newOtp[index] = value;
    setOtpForm(newOtp);
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUploadSuccess = (url: string) => {
    setRegisterForm((prev) => ({ ...prev, img: url }));
  };

  const handleImageUploadError = (error: string) => {
    setError(error);
  };

  // Handle form submissions
  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(loginForm);
  };

  const handleSendOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    sendOtpMutation.mutate(registerEmail);
  };

  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const otp = otpForm.join("");
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }
    verifyOtpMutation.mutate({ email: registerEmail, otp });
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validate the regionId field is a UUID
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!registerForm.regionId) {
      setError("Please select a region");
      return;
    }
    if (!uuidPattern.test(registerForm.regionId)) {
      setError("Selected region is not a valid UUID");
      return;
    }
    if (!registerForm.img) {
      setError("Please upload an image");
      return;
    }

    registerMutation.mutate(registerForm);
  };

  const handleResendOtp = () => {
    setResendTimer(60);
    sendOtpMutation.mutate(registerEmail);
  };

  // Loading state
  const isLoading =
    sendOtpMutation.isPending ||
    verifyOtpMutation.isPending ||
    registerMutation.isPending ||
    loginMutation.isPending;

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {activeView === "login"
              ? "Login"
              : activeView === "registerEmail"
              ? "Register"
              : activeView === "verifyOtp"
              ? "Verify Email"
              : "Register"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Login Form */}
          {activeView === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="********"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full lowercase" disabled={isLoading}>
                {isLoading ? <Skeleton className="h-4 w-20" /> : "login"}
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full lowercase"
                onClick={() => setActiveView("registerEmail")}
              >
                register
              </Button>
            </form>
          )}

          {/* Register Email Form */}
          {activeView === "registerEmail" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={registerEmail}
                  onChange={handleEmailChange}
                  placeholder="user@example.com"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full lowercase" disabled={isLoading}>
                {isLoading ? <Skeleton className="h-4 w-20" /> : "send otp"}
              </Button>
            </form>
          )}

          {/* Verify OTP Form */}
          {activeView === "verifyOtp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-center">{registerEmail}</p>
              <div className="flex justify-center space-x-2">
                {otpForm.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    maxLength={1}
                    className="w-10 h-10 text-center"
                  />
                ))}
              </div>
              <p className="text-center">
                Resend after 00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                {resendTimer === 0 && (
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOtp}
                    className="ml-2 lowercase"
                  >
                    Resend
                  </Button>
                )}
              </p>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <Button type="submit" className="w-full lowercase" disabled={isLoading}>
                {isLoading ? <Skeleton className="h-4 w-20" /> : "register"}
              </Button>
            </form>
          )}

          {/* Register Details Form */}
          {activeView === "registerDetails" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <ImageUploader
                onUploadSuccess={handleImageUploadSuccess}
                onError={handleImageUploadError}
              />
              <div>
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  value={registerForm.firstname}
                  onChange={handleRegisterChange}
                  placeholder="Ali"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  value={registerForm.lastname}
                  onChange={handleRegisterChange}
                  placeholder="Valiyev"
                  required
                />
              </div>
              <div>
                <Label htmlFor="regionId">Region</Label>
                {regionsLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <select
                    id="regionId"
                    name="regionId"
                    value={registerForm.regionId}
                    onChange={handleRegisterChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="" disabled>
                      Select Region
                    </option>
                    {Array.isArray(regions) && regions.length > 0 ? (
                      regions.map((region) => (
                        <option key={region.regionId} value={region.regionId}>
                          {region.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No regions available</option>
                    )}
                  </select>
                )}
              </div>
              <div>
                <Label htmlFor="birthYear">Year</Label>
                <Input
                  id="birthYear"
                  name="birthYear"
                  type="number"
                  value={registerForm.birthYear}
                  onChange={handleRegisterChange}
                  placeholder="Year"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  placeholder="user@example.com"
                  required
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  placeholder="********"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full lowercase" disabled={isLoading}>
                {isLoading ? <Skeleton className="h-4 w-20" /> : "register"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;