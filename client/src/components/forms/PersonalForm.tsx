"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

type RegisterForm = {
  full_name: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  password: string;
  role?: string;
};

export default function PersonalInfoForm() {
  const [form, setForm] = useState<RegisterForm>({
    full_name: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    password: "",
    role: undefined,
  });
  // selected country for phone formatting (US, CA, IN)
  const [country, setCountry] = useState<"US" | "CA" | "IN">("US");
  const [phoneNormalized, setPhoneNormalized] = useState<string>("");

  const [step, setStep] = useState<"register" | "login" | "sendOtp" | "verifyOtp" | "done">("register");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [ssn, setSsn] = useState("");
  const [driverLicense, setDriverLicense] = useState("");
  const [dlState, setDlState] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [loanAmount, setLoanAmount] = useState<number | null>(null);
  const [loanPurpose, setLoanPurpose] = useState("");
  const [jornayaLeadId, setJornayaLeadId] = useState("");
  const [trustedFormCertUrl, setTrustedFormCertUrl] = useState("");
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as "US" | "CA" | "IN";
    setCountry(v);
  };

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await API.post("/auth/register", form);
      setMessage("Registered successfully. Please login.");
      setStep("login");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      setMessage("Login successful. Send OTP to verify phone.");
      setStep("sendOtp");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      // normalize phone to E.164 for Twilio
      let phoneNormalized = form.phone.trim();
      if (!phoneNormalized.startsWith("+")) {
        // remove non-digit chars
        const digits = phoneNormalized.replace(/\D/g, "");
        if (country === "IN") phoneNormalized = "+91" + digits;
        else phoneNormalized = "+1" + digits; // US/CA
      }
      await API.post("/otp/send-otp", { phone: phoneNormalized });
      // save normalized phone to use during verification
      setPhoneNormalized(phoneNormalized);
      setMessage(`OTP sent to ${phoneNormalized}. Enter code to verify.`);
      setStep("verifyOtp");
    } catch (err: any) {
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
      setMessage(serverMsg || err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      // use normalized phone if we saved it when sending OTP
      const phoneToVerify = phoneNormalized || form.phone;
      console.log("verifyOtp: sending to server ->", { phone: phoneToVerify, code: otpCode });
      const verifyRes = await API.post("/otp/verify-otp", { phone: phoneToVerify, code: otpCode });
      console.log("verifyOtp response:", verifyRes.data);

      // ensure Twilio reported approval before continuing
      const verifyData = verifyRes?.data?.data;
      const approved = verifyData?.status === "approved" || verifyData?.valid === true;
      if (!approved) {
        setMessage("OTP not approved: " + JSON.stringify(verifyRes.data));
        setLoading(false);
        return;
      }

      setMessage("OTP verified. Creating application...");

      console.log("Creating application for verified phone", phoneToVerify);
      const createRes = await API.post("/loan/create");
      // backend may return { data: { id } } or { id }
      const appId = createRes?.data?.data?.id ?? createRes?.data?.id ?? null;

      if (!appId) {
        setMessage("Failed to get application id from server response: " + JSON.stringify(createRes?.data));
        setLoading(false);
        return;
      }

      setApplicationId(appId);
      localStorage.setItem("applicationId", String(appId));

      // Redirect user to the identity verification page so they can complete details
      setMessage(`OTP verified and application created. Redirecting to identity step. Application ID: ${appId}`);
      router.push("/apply/step2-personal");
    } catch (err: any) {
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
      console.error("verifyOtp error:", err?.response || err);
      setMessage(serverMsg || "OTP verification or loan flow failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Create Account</h2>

      {message && <div className="mb-4 text-sm text-gray-700">{message}</div>}

      {step === "register" && (
        <form onSubmit={registerUser} className="space-y-3">
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <div className="flex items-center space-x-2">
            <select
              value={country}
              onChange={handleCountryChange}
              className="p-2 border rounded"
              aria-label="Country"
            >
              <option value="US">United States (+1)</option>
              <option value="CA">Canada (+1)</option>
              <option value="IN">India (+91)</option>
            </select>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="flex-1 p-2 border rounded"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-2 border rounded"
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full p-2 border rounded"
            />

            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="w-full p-2 border rounded"
            />
          </div>

          <input
            name="zip"
            value={form.zip}
            onChange={handleChange}
            placeholder="Zip Code"
            className="w-full p-2 border rounded"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 border rounded"
            required
          />

          <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      )}

      {step === "login" && (
        <form onSubmit={loginUser} className="space-y-3">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 border rounded"
          />

          <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      )}

      {step === "sendOtp" && (
        <div className="space-y-3">
          <div>Send OTP to {form.phone}</div>

          <button onClick={sendOtp} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      )}

      {step === "verifyOtp" && (
        <form onSubmit={verifyOtp} className="space-y-3">
          <input
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-2 border rounded"
            required
          />

          <button disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
            {loading ? "Verifying..." : "Verify OTP & Run Flow"}
          </button>
        </form>
      )}

      {step === "done" && (
        <div className="text-green-700 font-medium">Application completed. Application ID: {applicationId}</div>
      )}
    </div>
  );
}
