import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export const useLoanQuery = () => {
  return useQuery({
    queryKey: ["loans"],
    queryFn: async () => {
      const res = await api.get("/loans");
      return res.data;
    },
  });
};