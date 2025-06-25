"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Loader2,
  Building2,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

// Helper component for password criteria
const PasswordCriterion = ({ met, text }: { met: boolean; text: string }) => (
  <p
    className={`flex items-center text-xs transition-colors ${
      met
        ? "text-green-600 dark:text-green-500"
        : "text-red-600 dark:text-red-500"
    }`}
  >
    {met ? (
      <Check className="h-3 w-3 mr-1.5 flex-shrink-0" />
    ) : (
      <X className="h-3 w-3 mr-1.5 flex-shrink-0" />
    )}
    {text}
  </p>
);

export function RegisterForm({ onSuccess, redirectTo }: RegisterFormProps) {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    accountType: "individual" as "individual" | "business",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordCriteria, setPasswordCriteria] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    minLength: false,
  });

  useEffect(() => {
    if (formData.confirmPassword.length > 0 || formData.password.length > 0) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    setPasswordCriteria({
      lowercase: /[a-z]/.test(formData.password),
      uppercase: /[A-Z]/.test(formData.password),
      number: /[0-9]/.test(formData.password),
      minLength: formData.password.length >= 8,
    });
  }, [formData.password]);

  const allPasswordCriteriaMet =
    passwordCriteria.lowercase &&
    passwordCriteria.uppercase &&
    passwordCriteria.number &&
    passwordCriteria.minLength;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (
      error === "Passwords do not match" &&
      (field === "password" || field === "confirmPassword")
    ) {
      setError("");
    }
    if (
      error === "Password does not meet all strength requirements." &&
      field === "password"
    ) {
      setError("");
    }
  };

  const validateForm = () => {
    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.username
    ) {
      return "Please fill in all required fields";
    }

    if (!allPasswordCriteriaMet) {
      return "Password does not meet all strength requirements.";
    }

    if (!passwordsMatch) {
      return "Passwords do not match";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        accountType: formData.accountType,
      });
      onSuccess?.();
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  const isSubmitDisabled =
    isLoading ||
    (!passwordsMatch && formData.confirmPassword.length > 0) ||
    !allPasswordCriteriaMet;

  return (
    <div className="glass-card w-full max-w-md mx-auto animate-glass-appear">
      <div className="space-y-6 p-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Create account</h1>
          <p className="text-muted-foreground">
            Join Piaxe to start making secure payments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && error !== "Passwords do not match" && (
            <div className="glass-card flex items-center text-red-400 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Account Type Selection */}
          <div className="space-y-3">
            <Label>Account Type</Label>
            <RadioGroup
              value={formData.accountType}
              onValueChange={(value) => handleInputChange("accountType", value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label
                  htmlFor="individual"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  Personal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="business" id="business" />
                <Label
                  htmlFor="business"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="h-4 w-4" />
                  Business
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <div className="relative">
              {formData.username.length === 0 && (
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              <Input
                id="username"
                type="text"
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="glass-input pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name *</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                disabled={isLoading}
                className="glass-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name *</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                disabled={isLoading}
                className="glass-input"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email address *</Label>
            <div className="relative">
              {formData.email.length === 0 && (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="glass-input pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number (optional)</Label>
            <div className="relative">
              {formData.phone.length === 0 && (
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="glass-input pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              {formData.password.length === 0 && (
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="glass-input pl-10 pr-10"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {/* Password Strength Indicators */}
            {formData.password.length > 0 && (
              <div className="mt-2 p-3 bg-muted/30 dark:bg-muted/20 border border-border/50 rounded-md space-y-1">
                <PasswordCriterion
                  met={passwordCriteria.lowercase}
                  text="A lowercase letter"
                />
                <PasswordCriterion
                  met={passwordCriteria.uppercase}
                  text="A capital (uppercase) letter"
                />
                <PasswordCriterion
                  met={passwordCriteria.number}
                  text="A number"
                />
                <PasswordCriterion
                  met={passwordCriteria.minLength}
                  text="Minimum 8 characters"
                />
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password *</Label>
            <div className="relative">
              {formData.confirmPassword.length === 0 && (
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={`glass-input pl-10 pr-10 ${
                  !passwordsMatch && formData.confirmPassword.length > 0
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }`}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {!passwordsMatch && formData.confirmPassword.length > 0 && (
              <p className="text-xs text-red-500 mt-1">
                Passwords do not match.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="glass-button-primary w-full px-6 py-3 mt-6"
            disabled={isSubmitDisabled}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>

          <div className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
