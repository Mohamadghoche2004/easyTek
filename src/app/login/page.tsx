"use client";
import { Button, TextField } from "@mui/material";
import "./login.css";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Login() {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const router = useRouter();
const handleLogin = async () => {
  if (email === "" || password === "") {
    setError("Please fill in all fields");
    return;
  }
  setLoading(true);
  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (response.ok) {
    setError("");
    setLoading(false);
    router.push("/dashboard");
  } else {
    setError(data.error);
    setLoading(false);
  }
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
      <Button  className="login-button" onClick={handleLogin}>Login</Button>
    </div>
    </div>
  );
}