import { statusColor } from "@/utils/statusColor";

export function StatusUI({ children }) {
    const { background, color } = statusColor(children);

    return (
        <div
            className='w-full rounded-xl p-2 text-center'
            style={{ background, color }}
        >
            {children?.replace('_', ' ')}
        </div>
    );
}