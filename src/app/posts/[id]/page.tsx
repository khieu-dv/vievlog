// File: app/posts/[id]/page.tsx (Server Component)
import axios from "axios";
import PostDetailClient from "./PostDetailClient";

// This function runs on the server during build time
export async function generateStaticParams() {
  try {
    // Fetch all post IDs from your API
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/collections/posts_tbl/records`,
      {
        params: {
          fields: 'id', // Only fetch the ID field to minimize data
          perPage: 500   // Adjust based on your needs
        }
      }
    );

    // Return array of params for each post
    return response.data.items.map((post: { id: string }) => ({
      id: post.id,
    }));
  } catch (error) {
    console.error('Error fetching posts for static generation:', error);
    // Return empty array if fetch fails
    return [];
  }
}

// Server component that renders the client component
// In Next.js 15, params is a Promise
export default async function PostDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  // Await the params Promise
  const resolvedParams = await params;

  return <PostDetailClient params={resolvedParams} />;
}

