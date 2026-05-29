import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="animate-fade-in">{children}</main>
      <Footer />
    </div>
  );
}
