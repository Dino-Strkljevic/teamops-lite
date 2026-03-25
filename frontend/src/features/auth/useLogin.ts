import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { LoginBody } from "../../types";

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (body: LoginBody) => login(body),
    onSuccess: () => {
      navigate("/", { replace: true });
    },
  });
}
