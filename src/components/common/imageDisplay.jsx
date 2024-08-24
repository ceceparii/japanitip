import Image from "next/image";

export default function ImageDisplay({ src, className, imageStyle }) {
    return (
        <figure className={`${className} relative`}>
            <Image
                src={src}
                width={420}
                height={420}
                alt="japanitip"
                className={`${imageStyle} w-full h-full object-cover`}
            />
        </figure>
    );
}
