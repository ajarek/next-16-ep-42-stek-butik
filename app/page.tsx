import BestSteaks from "@/components/BestSteaks";
import Certificates from "@/components/Certificates";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col gap-8 bg-foreground">
      <Hero />
     <Certificates/>
     <BestSteaks/>
     <Newsletter/>
    </div>
  );
}
