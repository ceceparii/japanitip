import { convertToIDR } from "@/utils/priceHandler";
import ImageDisplay from "../common/imageDisplay";
import Link from "next/link";

export default function ProductCard(props) {
    return (
        <Link href={`/v1/products/${props._id}`}>
            <figure className="w-28 flex flex-col justify-between overflow-hidden h-max">
                <ImageDisplay
                    src={props.images[0]}
                    className="aspect-square h-full mb-2"
                    imageStyle=""
                />
                <div className="font-semibold text-sm h-full">
                    <div className="">{props.name}</div>
                    <div className="text-red-600 mt-2">
                        {convertToIDR.format(props.variants[0].price)}
                    </div>
                </div>
            </figure>
        </Link>
    );
}
