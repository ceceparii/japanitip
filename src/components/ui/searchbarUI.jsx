import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export default function SearchbarUI({ onChange, invalidID, placeholder }) {
    return (
        <div className="bg-gray-100 p-1.5 w-full relative rounded-lg shadow bg-white">
            <input
                type="text"
                className="bg-transparent outline-0"
                placeholder={placeholder}
                onChange={onChange}
            />
            <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute right-1.5 top-1/2 -translate-y-1/2"
            />
            <div
                className="text-[var(--red-primer)] absolute -bottom-[80%] font-semibold"
                style={{ display: invalidID ? 'block' : 'none'}}
            >
                Invalid order id
            </div>
        </div>
    )
}