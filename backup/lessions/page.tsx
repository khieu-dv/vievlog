'use client';

import * as React from "react";
import axios from "axios";
import { Header } from "~/ui/components/header";
import { Button } from "~/ui/primitives/button";
import { LessionCard } from "~/ui/components/lession-card";
import { useSearchParams } from "next/navigation";

export default function TopiksPage() {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('categoryId');
    const [selectedCategory, setSelectedCategory] = React.useState("All");
    const [products, setTopiks] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    // Fetch products from API using Axios
    React.useEffect(() => {
        const fetchTopiks = async () => {
            try {
                setLoading(true);
                setError(null);

                const apiUrl = `https://pocketbase.vietopik.com/api/collections/lessions/records?perPage=300`;
                const params: Record<string, string> = {
                    created: ">=2022-01-01 00:00:00"
                };

                if (categoryId) {
                    params.filter = `main_category = "${categoryId}"`;
                }

                const response = await axios.get(apiUrl, { params });

                setTopiks(response.data.items || []);
            } catch (error) {
                console.error("Error fetching products:", error);

                if (axios.isAxiosError(error)) {
                    setError(error.response?.data?.message || "Failed to fetch lessons. Please try again.");
                } else {
                    setError("An unexpected error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTopiks();
    }, [categoryId]);

    // Improved filtering logic
    const filteredTopiks = React.useMemo(() => {
        if (selectedCategory === "All") return products;

        // Debug logging
        console.log("All Products:", products);
        console.log("Selected Category:", selectedCategory);

        return products.filter((product) => {
            // Log each product's category for debugging
            console.log("Product Category:", product.category);

            // Use loose comparison and trim whitespace
            return product.category.trim() === selectedCategory.trim();
        });
    }, [products, selectedCategory]);

    const handleAddToWishlist = (productId: string) => {
        console.log(`Added ${productId} to wishlist`);
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-10">
                <div className="container px-4 md:px-6">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Lessons</h1>
                            <p className="mt-1 text-lg text-muted-foreground">
                                Browse our latest lessons and find something you'll love.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {["All", "Introduction", "Beginner I", "Beginner II", "Intermediate I", "Intermediate II"].map((category) => (
                                <Button
                                    key={category}
                                    variant={category === selectedCategory ? "default" : "outline"}
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center">Loading lessons...</div>
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : (
                        <>
                            {filteredTopiks.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {filteredTopiks.map((product) => (
                                        <LessionCard
                                            key={product.lessionBooks[0]}
                                            lession={product}
                                            variant="list"
                                            onAddToWishlist={handleAddToWishlist}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-8 text-center">
                                    <p className="text-muted-foreground">No lessons found in this category.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © {new Date().getFullYear()} VieTopik. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}