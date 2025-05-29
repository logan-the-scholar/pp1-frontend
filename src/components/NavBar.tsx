"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ApiType } from "@/types/ApiResponse.type";

const NavBar: React.FC = () => {
    const [data,] = useLocalStorage<ApiType.Login>("session", null);

    return (
        <nav>

        </nav>
    );
};

export default NavBar;