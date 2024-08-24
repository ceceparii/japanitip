import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ImageDisplay from "../common/imageDisplay";
import {
    faAngleLeft,
    faSignOut,
    faXmarkSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRouter } from "next/router";

export default function AdminLayout({ children, className }) {
    const [isAside, setIsAside] = useState(false);
    const router = useRouter();

    function AsideButton({ children, path }) {
        function clickHandler() {
            setIsAside(false);
            router.push(path);
        }

        return (
            <button onClick={clickHandler} className="w-max">
                {children}
            </button>
        );
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
                className="w-full h-full fixed flex flex-col gap-3.5 top-0 text-left bg-white px-3.5 py-7 duration-300 font-semibold text-2xl"
                style={{ left: isAside ? "0" : "-100%" }}
            >
                <FontAwesomeIcon
                    icon={faXmarkSquare}
                    onClick={() => setIsAside(false)}
                    className="absolute right-3.5 top-3.5"
                />
                <AsideButton path="/admin">Home</AsideButton>
                <AsideButton path="/admin/products">Produk</AsideButton>
                <AsideButton path="/admin/orders">Pesanan</AsideButton>
            </aside>
        </main>
    );
}
