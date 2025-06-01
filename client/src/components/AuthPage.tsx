import React, { useState } from "react";
import { Phone, KeyRound, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { apiService } from "../services/api";

interface AuthPageProps {
  onAuthSuccess: (phoneNumber: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    setLoading(true);
    try {
      await apiService.createNewAccessCode(phoneNumber);
      toast.success("A verification code has been sent to your phone number.");
      setStep("code");
    } catch (error) {
      toast.error("An error occurred while sending the verification code.");
      console.error("Error sending code:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      toast.error("Please enter verification code");
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.validateAccessCode(
        accessCode,
        phoneNumber
      );
      if (result.success) {
        localStorage.setItem("phoneNumber", phoneNumber);
        toast.success("Verification successful!");
        onAuthSuccess(phoneNumber);
      } else {
        toast.error("Incorrect verification code");
      }
    } catch (error) {
      toast.error("An error occurred while validating the code.");
      console.error("Error verifying code:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setAccessCode("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {step === "phone" ? "Login" : "authentic"}
          </CardTitle>
          <CardDescription>
            {step === "phone"
              ? "Enter your phone number to receive a verification code"
              : "Enter the 6-digit verification code sent to your phone"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send authentication code
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="code"
                  className="text-sm font-medium text-gray-700"
                >
                  Authentication code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6 digit code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="pl-10"
                    maxLength={6}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Authentication"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleBackToPhone}
                  disabled={loading}
                >
                  Back
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
