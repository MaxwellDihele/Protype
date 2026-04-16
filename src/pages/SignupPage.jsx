import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useApp } from "../context/AppContext";
import { Card, Input, Btn, Select, Icon } from "../components/ui";

export const SignupPage = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  const set = (key) => (value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSignUp = async () => {
    if (!form.email || !form.password) {
      showToast("Email and password required", "error");
      return;
    }

    setLoading(true);

    try {
      // 1. CREATE AUTH USER
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;

      const user = data.user;

      // 2. CREATE PROFILE IN DB
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: form.email,
          name: form.name,
          role: form.role, // user | seller | admin
        });

      if (profileError) throw profileError;

      showToast("Account created successfully!");

      navigate("/login");
    } catch (err) {
      console.log(err);
      showToast(err.message || "Signup failed", "error");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <Card style={{ width: "100%", maxWidth: 420, padding: 28 }}>
        <h2 style={{ fontSize: "2rem", marginBottom: 6 }}>
          Create Account
        </h2>

        <p style={{ color: "var(--text2)", marginBottom: 20 }}>
          Join MzansiStreet Marketplace
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input
            label="Full Name"
            value={form.name}
            onChange={set("name")}
            placeholder="John Doe"
          />

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@email.com"
          />

          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="••••••••"
          />

        </div>

        <Btn
          onClick={handleSignUp}
          disabled={loading}
          full
          style={{ marginTop: 20 }}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Btn>

        <div
          style={{
            marginTop: 14,
            fontSize: "0.8rem",
            color: "var(--text2)",
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "var(--accent)", cursor: "pointer" }}
          >
            Login
          </span>
        </div>
      </Card>
    </div>
  );
};