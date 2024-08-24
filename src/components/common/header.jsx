import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

export default function Header({children}) {
    const router = useRouter()

    function backHandler() {
        router.back()
    }
    
    return (
        <header className='bg-white p-3.5 shadow w-full text-lg flex gap-3.5 items-center'>
            <FontAwesomeIcon icon={faArrowLeft} className='text-lg' onClick={backHandler}/>
            <span className="capitalize">{children}</span>
        </header>
    );
}
