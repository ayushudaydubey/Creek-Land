import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export const useLoanRates = () => {
return useQuery({
queryKey: ["loanRates"],
queryFn: async () => {
const res = await api.get("/loan/rates");
return res.data;
}
});
};
