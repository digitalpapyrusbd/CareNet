"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiCallNoAuth } from "@/lib/api-client";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams?.get("token");
    const refreshToken = searchParams?.get("refreshToken");
    const error = searchParams?.get("error");

    if (error) {
      router.push(`/auth/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (token && refreshToken) {
      // Store tokens
      localStorage.setItem("authToken", token);
      localStorage.setItem("refreshToken", refreshToken);

      // Fetch user info
      apiCallNoAuth("/auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (response.user) {
            localStorage.setItem("user", JSON.stringify(response.user));
            const role = response.user.role?.toLowerCase() || "";

            // Redirect based on role
            if (role.includes("super") || role.includes("admin")) {
              router.push("/admin/dashboard");
            } else if (role.includes("moderator")) {
              router.push("/moderator/dashboard");
            } else if (role.includes("company") || role.includes("agency")) {
              router.push("/agency/dashboard");
            } else if (role.includes("caregiver")) {
              router.push("/caregiver/dashboard");
            } else if (role.includes("guardian")) {
              router.push("/guardian/dashboard");
            } else if (role.includes("patient")) {
              router.push("/patient/dashboard");
            } else {
              router.push("/");
            }
          }
        })
        .catch(() => {
          // Failed to fetch user info after OAuth callback
          router.push("/auth/login?error=Failed to complete authentication");
        });
    } else {
      router.push("/auth/login?error=Missing authentication tokens");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing Google sign-in...</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
