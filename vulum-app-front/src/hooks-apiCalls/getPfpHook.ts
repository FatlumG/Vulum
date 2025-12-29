import { useState, useEffect } from "react";
import { userInterface } from "../interfaces/UserInterface";
import api from "../auth/api";

export const getPfp = () => {
  const [user, setUser] = useState<userInterface>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const userInitials = `${user?.first_name?.[0].toUpperCase() ?? ""}${
    user?.last_name?.[0].toUpperCase() ?? ""
  }`;
  

  return { user, userInitials };
};
