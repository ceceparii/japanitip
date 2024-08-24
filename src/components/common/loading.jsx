import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Loading({ className }) {
    return (
        <div className={`${className} w-full flex flex-col gap-3 text-gray-600 justify-center items-center`}>
            <FontAwesomeIcon icon={faCircleNotch} className="text-2xl" spin/>
            <div>Loading ...</div>
        </div>
    )
}