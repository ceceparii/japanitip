import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default function ({ imageChange, thumbnails }) {
    return (
        <section className="shadow rounded-2xl p-3.5 bg-white">
            <div className="font-semibold mb-3.5">Gambar produk</div>
            <section className="grid grid-cols-3 gap-3.5">
                {thumbnails?.map((thumbnail, index) => (
                    <Image
                        key={index}
                        alt="japanitip"
                        src={thumbnail}
                        width={420}
                        height={420}
                        className="w-full h-full rounded-xl object-cover"
                    />
                ))}
                <label
                    htmlFor="files"
                    className="border aspect-square rounded-xl flex items-center flex-col justify-center"
                >
                    <FontAwesomeIcon
                        icon={faCloudUploadAlt}
                        className="text-2xl text-gray-600"
                    />
                    <span className="text-gray-600">upload</span>
                </label>
                <input
                    type="file"
                    multiple
                    className="hidden"
                    id="files"
                    onChange={imageChange}
                />
            </section>
        </section>
    );
}
