import Hero from "@/components/Hero";
import ExternalLinks from "@/components/ExternalLinks";
import PollSection from "@/components/PollSection";
import { siteConfig } from "@/lib/config";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-1 w-full max-w-2xl flex-col items-center sm:items-start gap-12 py-20 px-6">
        <Hero />
        <ExternalLinks />
        <PollSection />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 border-t border-black/10 dark:border-white/10 pt-6 w-full">
          {siteConfig.ageNotice}
        </p>
      </main>
    </div>
  );
}
