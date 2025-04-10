"use client";

import { useParams } from "next/navigation";
import { Header } from "~/ui/components/header";
import { Button } from "~/ui/primitives/button";
import axios from "axios";
import { decode } from "html-entities";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  detailDesc: string;
  lessionHtml: string;
}

export default function ProductDetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collections/products/records/${id}`);
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

        setProduct({
          id: productData.id,
          name: productData.name,
          detailDesc: cleanHTML(productData.detailDesc), // Decode & Remove Unwanted Tags
          lessionHtml: productData.lessionHtml,
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [id]);


  
    useEffect(() => {
      if (product?.lessionHtml) {
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

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="container px-4 md:px-6">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push(`/products/${id}`)}
          >
            ← Back to Topiks
          </Button>
          <h5 className="text-3xl font-bold">{product.name}</h5>
          <div
            className="mt-6"
            dangerouslySetInnerHTML={{ __html: product.lessionHtml }}
          />
        </div>
      </main>
    </div>
  );
}
