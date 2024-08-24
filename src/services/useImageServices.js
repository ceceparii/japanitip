import { useState } from "react";
import imageCompression from "browser-image-compression";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/libs/frebase";

export default function useImageServices(thumbnails) {
    const [images, setImages] = useState({
        files: [],
        thumbnails: thumbnails || [],
    });

    // input images
    function inputImages(event) {
        const { files } = event.target;
        if (files) {
            const imageFile = Array.from(files);
            const thumbnails = imageFile.map((file) =>
                URL.createObjectURL(file)
            );

            setImages((prev) => ({
                ...prev,
                files: [...prev.files, ...files],
                thumbnails: [...prev.thumbnails, ...thumbnails],
            }));
        }
    }

    // upload images
    async function uploadImages(product) {
        if (images.files?.length === 0) {
            return null;
        }

        const compressedImages = [];

        for (let image of images.files) {
            const compressed = await imageCompression(image);
            compressedImages.push(compressed);
        }

        const uploadPromises = compressedImages.map(async (file) => {
            const storageRef = ref(
                storage,
                `images/products/${product.brand}/${product.name}/${file.name}`
            );
            await uploadBytes(storageRef, file);
            return await getDownloadURL(storageRef);
        });

        return Promise.all(uploadPromises);
    }

    return { inputImages, images, uploadImages };
}
