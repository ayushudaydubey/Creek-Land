import api from "./api";

export const submitApplication = async (data) => {
const res = await api.post("/loan/apply", data);
return res.data;
};
