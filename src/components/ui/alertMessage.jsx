import { useAlert } from "@/contexts/alertContext";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AlertMessage(){
    const {isAlert, setIsAlert} = useAlert()
    const { background: color, color: background } = statusColor(isAlert.type)

    if (!isAlert.show) {
        return null
    }

    function closeAlert() {
        setIsAlert({ show: false, message: "", type: ""})
    }

    return (
        <div
            className="fixed bottom-10 text-sm right-1/2 border-l-4 translate-x-1/2 p-3.5 flex justify-between items-center w-5/6 md:max-w-sm"
            style={{ color, background, borderColor: color }}
        >
            <div>
                <div className="font-semibold uppercase">{isAlert.type}</div>
                <div>{isAlert.message}</div>
            </div>
            <FontAwesomeIcon icon={faXmarkCircle}  onClick={closeAlert} className="text-2xl"/>
        </div>
    )
}

function statusColor(type) {
    switch (type) {
        case "error":
            return { color: "var(--red-primer)", background: "var(--red-tersier)"}
        case "warning":
            return { color: "var(--yellow-primer)", background: "var(--yellow-scunder)"}
        case "success":
            return { color: "var(--green-primer)", background: "var(--green-scunder)"}
        default:
            return { color: "var(--white)", background: "var(--black)" }
    }
}