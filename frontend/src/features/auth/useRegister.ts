import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import apiClient from "../../lib/api";
import type { RegisterBody } from "../../types";

async function registerUser(body: RegisterBody): Promise<void> {
  await apiClient.post("/auth/register", body);
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      navigate("/login", { replace: true, state: { registered: true } });
    },
  });
}
