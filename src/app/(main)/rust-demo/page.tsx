import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";
import { RustWasmDemo } from "~/components/examples/RustWasmDemo";

export default function RustDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-4">
        <RustWasmDemo />
      </main>
      <Footer />
    </div>
  );
}