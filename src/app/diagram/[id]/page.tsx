"use client";

import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Header } from "~/ui/components/header";
import { Button } from "~/ui/primitives/button";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import axios from "axios";
import { string } from "better-auth";
import { decode } from "html-entities";
import Link from "next/link";



import { useEffect } from "react";


export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [quantity, setQuantity] = React.useState(1);
  interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    description: string;
    detailDesc: string; // Added for HTML content
    rating: number;
    inStock: boolean;
  }

  const [product, setProduct] = React.useState<Product | null>(null);

  // Fetch product data from API using Axios
  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections/products/records/${id}`);
        // const response = await axios.get(`http://192.168.0.121:5000/api/v1/collections/products/detail/records?perPage=300`);
        // const response = await axios.get(`http://192.168.0.121:5000/api/v1/collections/products/detail/records/${id}`);
        const productData = response.data;

        interface CleanHTMLFunction {
          (html: string): string;
        }

        const cleanHTML: CleanHTMLFunction = (html) => {
          // Decode HTML entities trước
          let decodedHTML = decode(html);
          
          // Loại bỏ <pre class="language-markup"><code> và </code></pre>
          decodedHTML = decodedHTML.replace(/<pre class="language-markup"><code>/g, "").replace(/<\/code><\/pre>/g, "");

          return decodedHTML;
        };

        const mappedProduct: Product = {
          id: productData.id,
          name: productData.name,
          price: productData.price,
          originalPrice: productData.originalPrice,
          image: productData.image,
          category: productData.category,
          description: productData.description,
          detailDesc: cleanHTML(productData.detailDesc), // Decode & Remove Unwanted Tags

          //detailDesc: productData.detailDesc, // Added for HTML content
          rating: productData.rating,
          inStock: productData.inStock,
        };
        setProduct(mappedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.detailDesc) {
      const checkDomReady = () => {
        if (document.body) {
          const scripts = document.querySelectorAll('script');
          let isAppend = false;
          let isLoadAnswers = false;

          scripts.forEach((script) => {
            const newScript = document.createElement('script');
            newScript.id = "script-" + script.id;
            newScript.text = script.textContent ?? '';

            if (newScript.text.includes('submitQuiz') && !isAppend) {
              document.body.appendChild(newScript);
              isAppend = true;
              if (newScript.text.includes('loadAnswers')) {
                isLoadAnswers = true;
              }
            }
          });

          // Xóa các script trùng lặp
          const existingScripts = document.querySelectorAll('script[id^="script-"]');
          existingScripts.forEach(script => {
            if (script.id !== "script-" + script.id) {
              script.remove();
            }
          });

          // if (isLoadAnswers) {
          //   window.loadAnswers?.();
          // }
        }
      };

      checkDomReady();
    }
  }, [product?.detailDesc]);

  // If product not found, show error
  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-10">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold">Product is loading...</h1>
            <p className="mt-4">
              {/* The product you're looking for doesn't exist. */}
            </p>
            <Button className="mt-6" onClick={() => router.push("/products")}>
              Back to Topiks
            </Button>
          </div>
        </main>
      </div>
    );
  }



  // Calculate discount percentage
  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push("/products")}
          >
            ← Back to Topiks
          </Button>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discountPercentage > 0 && (
                <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                  -{discountPercentage}%
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="mt-2 flex items-center gap-4">

                  <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={`star-${product.id}-position-${i + 1}`}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating || 0)
                              ? "fill-primary text-primary"
                              : i < (product.rating || 0)
                              ? "fill-primary/50 text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    <span className="text-sm text-muted-foreground">
                      ({product.rating})
                    </span>
                  </div>
                    {/* Category */}
                  <p className="text-lg font-medium text-muted-foreground">
                    {product.category}
                  </p>
                </div>
              </div>
              {/* <Link href={`/products/${product.id}/detail`} className="text-blue-500 hover:underline mt-1">
                Go to test...
              </Link> */}

              <div className="mt-4">
                {product.id.length > 0 && (
                  <Link
                    href={`/products/${product.id}/detail`}
                    className="inline-block bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Go to test
                  </Link>
                )}
              </div>

              {/* <p className="mb-6 text-muted-foreground mt-1">
                {product.description}
              </p> */}

            </div>
          </div>

          {/* Render detailDescription here below the image and description */}
          
          {/* <div
            className="mt-10"
            dangerouslySetInnerHTML={{ __html: product.detailDesc }}
          /> */}
        </div>
      </main>
    </div>
  );
}
