"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ApiResponse } from "@/types/ApiResponse.type";

const NavBar: React.FC = () => {
    const [data,] = useLocalStorage<ApiResponse.Login>("session", null);

    return (
        <nav>

        </nav>
    );
};

export default NavBar;