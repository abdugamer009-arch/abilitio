import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="animate-fade-in transition-opacity duration-500 ease-out">{children}</main>
      <Footer />
    </div>
  );
}
