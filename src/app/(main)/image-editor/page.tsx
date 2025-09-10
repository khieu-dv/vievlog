import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";
import { ImageEditor } from "~/components/examples/ImageEditor";

export default function ImageEditorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-4">
        <ImageEditor />
      </main>
      <Footer />
    </div>
  );
}