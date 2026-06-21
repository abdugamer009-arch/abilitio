import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AmbientBackdrop } from "./AmbientBackdrop";
import { ScrollProgress } from "./ScrollProgress";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <ScrollProgress />
      <AmbientBackdrop />
      <Navbar />
      <main className="animate-fade-in transition-opacity duration-500 ease-out">{children}</main>
      <Footer />
    </div>
  );
}
