"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const { isLogged } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLogged) router.push("/"); // redirige al dashboard si ya está logueado
  }, [isLogged, router]);

  return <LoginForm />;
}
