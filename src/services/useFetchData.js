import axiosIntelence from "@/libs/axios";
import { useState } from "react";

export default function useFetchData() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    async function fetchData(url) {
        const response = await axiosIntelence.get(url);
        if (response.status === 200) {
            setResult(response.data.result);
        }
        setLoading(false);
    }

    return { result, loading, fetchData, setResult };
}
