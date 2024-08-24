import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ImageDisplay from "../common/imageDisplay";
import {
    faAngleLeft,
    faCartShopping,
    faXmarkSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Loading from "../common/loading";

export default function Layout({ children, loading }) {
    const [isAside, setIsAside] = useState(false);
    const router = useRouter();
    
    function AsideButton({ children, path }) {
        function clickHandler() {
            router.push(path);
            setIsAside(false);
        }
        return <button onClick={clickHandler}>{children}</button>;
    }

    return (
        <>
            <header className="p-3.5 flex gap-3.5 items-center bg-white shadow">
                <span
                    className="flex gap-2.5 items-center"
                    onClick={() => setIsAside(true)}
                >
                    <ImageDisplay
                        src={"/assets/icons/japanitip_logo.png"}
                        className="w-24 object-contain"
                    />
                    <FontAwesomeIcon icon={faAngleLeft} />
                </span>
                <span className="w-full">search product</span>
                <span className="text-xl flex items-center gap-3.5">
                    <Link href="/v1/user/cart">
                        <FontAwesomeIcon icon={faCartShopping} />
                    </Link>
                    <Link href="/v1/user/profile">
                        <FontAwesomeIcon icon={faUserCircle} />
                    </Link>
                </span>
            </header>
            <main className="xl:max-w-[80%] md:m-auto">
                {!loading ? children : <Loading className="h-[80vh]" />}
            </main>
            <aside
                style={{ left: isAside ? "0" : "-100%" }}
                className="fixed top-0 w-full h-full bg-white p-3.5 text-2xl font-semibold duration-200"
            >
                <FontAwesomeIcon
                    icon={faXmarkSquare}
                    className="absolute right-3.5 top-3.5"
                    onClick={() => setIsAside(false)}
                />
                <AsideButton path="/v1">Home</AsideButton>
            </aside>
        </>
    );
}
