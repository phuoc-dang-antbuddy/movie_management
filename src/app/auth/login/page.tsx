"use client";
import classes from "./style.module.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const apiUrl = process.env.API_URL;
export default function LoginPage() {
  const router = useRouter();
  const [isSelect, setIsSelect] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const loginData = localStorage.getItem("LOGIN");
    if (loginData) {
      const login = JSON.parse(loginData);
      setFormData({
        username: login.username,
        password: login.password,
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = response.data;
      if (response.status == 200) {
        localStorage.setItem("USER", JSON.stringify(result));
        toast.success("Log in successfully");
        router.push("/manage/movie");
        if (isSelect) {
          localStorage.setItem("LOGIN", JSON.stringify(formData));
        }
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Sign in</h1>
      <form className={classes.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          id="username"
          className={classes.input}
          placeholder="Email"
          required
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className={classes.input}
          required
          value={formData.password}
          onChange={handleChange}
        />
        <div className={classes["checkbox-ctn"]} key="remember">
          <label className={classes.label} htmlFor="remember">
            <input
              type="checkbox"
              className={classes.checkbox}
              name="remember"
              id="remember"
              onChange={() => setIsSelect((prev) => !prev)}
            />
            <span className={classes.checkmark}></span>
            <div> Remember me</div>
          </label>
        </div>
        <button type="submit" className={classes.button}>
          Log in
        </button>
      </form>
    </div>
  );
}
