import { Header } from "~/components/common/Header";
import { Footer } from "~/components/common/Footer";
import { SimpleIODemo } from "~/components/examples/SimpleIODemo";

export default function DataIOPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-4">
        <SimpleIODemo />
      </main>
      <Footer />
    </div>
  );
}