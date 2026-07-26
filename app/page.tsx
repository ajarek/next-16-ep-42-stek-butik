import Certificates from "@/components/Certificates";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col gap-8 bg-foreground">
      <Hero />
     <Certificates/>
    </div>
  );
}
