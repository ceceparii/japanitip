import Layout from "@/components/layout/layout";
import PopularProducts from "@/components/layout/popularProducts";

export default function HomePage() {
    return (
        <Layout>
            <h2>Jadwal keberangkatan</h2>
            <section>
                <PopularProducts />
            </section>
        </Layout>
    );
}
