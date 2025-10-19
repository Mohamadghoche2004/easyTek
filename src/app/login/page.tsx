"use client";
import { Button, TextField } from "@mui/material";
import "./login.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async () => {
    if (email === "" || password === "") {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    
    const success = await login(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
    <div className="flex flex-col items-center  login-card gap-4">
        <div className="bg-black rounded-lg p-2">

        <Image src="/logo.png" alt="logo" width={200} height={100} />
        </div>
      <h1 className="text-2xl font-bold">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <TextField size="small" label="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField size="small" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button  className="login-button" onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
    </div>
    </div>
  );
}