import { siteConfig } from "@/lib/config";

export default function Hero() {
  return (
    <section className="w-full max-w-2xl flex flex-col items-center sm:items-start gap-4 text-center sm:text-left">
      <div className="h-24 w-24 rounded-full bg-black/[.06] dark:bg-white/[.08] flex items-center justify-center text-2xl font-semibold">
        {siteConfig.name.charAt(0)}
      </div>
      <h1 className="text-4xl font-semibold tracking-tight">{siteConfig.name}</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
        {siteConfig.tagline}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-md">{siteConfig.bio}</p>
    </section>
  );
}
