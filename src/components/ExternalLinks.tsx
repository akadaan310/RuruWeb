import { siteConfig } from "@/lib/config";

export default function ExternalLinks() {
  return (
    <section className="w-full max-w-2xl flex flex-col gap-3">
      {siteConfig.externalLinks.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border border-black/10 dark:border-white/10 px-4 py-3 hover:bg-black/[.03] dark:hover:bg-white/[.06] transition-colors"
        >
          <span className="font-medium">{link.label}</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {link.description}
          </span>
        </a>
      ))}
    </section>
  );
}
