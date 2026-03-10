import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";

export const useSubmitApplication = () => {
  return useMutation({
    mutationFn: (data) => api.post("/applications", data),
  });
};