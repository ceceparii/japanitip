import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ImageDisplay from "../common/imageDisplay";
import {
    faAngleLeft,
    faXmarkSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRouter } from "next/router";
import axiosIntelence from "@/libs/axios";

export default function AdminLayout({ children, className }) {
    const [isAside, setIsAside] = useState(false);
    const router = useRouter();

    function AsideButton({ children, path }) {
        function clickHandler() {
            setIsAside(false);
            router.push(path);
        }

        return (
            <button onClick={clickHandler} className="w-max text-xl font-semibold">
                {children}
            </button>
        );
    }

    async function userLogout() {
        const response = await axiosIntelence.delete('/api/auth/logout')
        if (response.status === 200) {
            localStorage.removeItem('auth')
            router.push('/v1')
        }
    }

    return (
        <main>
            <header className="flex gap-3.5 items-center shadow p-3.5 bg-white">
                <span
                    className="flex items-center gap-1.5"
                    onClick={() => setIsAside(true)}
                >
                    <ImageDisplay
                        src="/assets/icons/japanitip_logo.png"
                        className="w-24 object-contain"
                    />
                    <FontAwesomeIcon icon={faAngleLeft} />
                </span>
            </header>
            <section className={className}>{children}</section>
            <aside
                className="w-full h-full fixed flex flex-col justify-between top-0 bg-white px-3.5 py-7 duration-300"
                style={{ left: isAside ? "0" : "-100%" }}
            >
                <FontAwesomeIcon
                    icon={faXmarkSquare}
                    onClick={() => setIsAside(false)}
                    className="absolute right-3.5 top-3.5 text-2xl"
                />
                <section className="flex flex-col">
                    <AsideButton path="/admin">Home</AsideButton>
                    <AsideButton path="/admin/products">Produk</AsideButton>
                    <AsideButton path="/admin/orders">Pesanan</AsideButton>

                </section>
                <section className="">
                    <button className="btn-red btn w-full" onClick={userLogout}>
                        LOGOUT
                    </button>
                </section>
            </aside>
        </main>
    );
}
