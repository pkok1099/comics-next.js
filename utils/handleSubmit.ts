// utils/useAuth.ts

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthHook {
  isLogin: boolean;
  loading: boolean;
  errorMessage: string;
  username: string;
  password: string;
  confirmPassword: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  toggleMode: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useAuth = (): AuthHook => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage(""); // Hapus pesan error saat ganti mode
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // Hindari eksekusi ulang jika loading aktif
    setErrorMessage(""); // Reset pesan error
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage("Password dan konfirmasi password tidak cocok");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "/api/login" : "/api/register";
      const body = JSON.stringify({ username, password });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (response.ok) {
        if (isLogin) {
          document.cookie = `user=${username}; max-age=${365 * 24 * 60 * 60}; path=/`;
          router.push("/"); // Redirect ke halaman utama
        } else {
          router.push("/login"); // Redirect ke halaman login setelah register
        }
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Proses gagal");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat memproses permintaan");
    } finally {
      setLoading(false);
    }
  };

  return {
    isLogin,
    loading,
    errorMessage,
    username,
    password,
    confirmPassword,
    setUsername,
    setPassword,
    setConfirmPassword,
    toggleMode,
    handleSubmit,
  };
};