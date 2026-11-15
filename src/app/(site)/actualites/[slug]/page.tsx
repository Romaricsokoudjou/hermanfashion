import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Img from "@/components/Img";
import { getNewsItem } from "@/lib/queries";
import { formatDate } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = await getNewsItem(slug);
  return { title: n?.title ?? "Actualité", description: n?.excerpt };
}

export default async function NewsDetail({ params }: Props) {
  const { slug } = await params;
  const n = await getNewsItem(slug);
  if (!n) notFound();
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-36 lg:pt-44">
      <Link href="/actualites" className="text-xs uppercase tracking-[0.25em] text-mute hover:text-orange">
        ← Actualités
      </Link>
      <p className="mt-8 text-xs uppercase tracking-[0.25em] text-orange">{formatDate(n.publishedAt)}</p>
      <h1 className="h-display mt-3 text-5xl sm:text-6xl">{n.title}</h1>
      {n.image && <Img src={n.image} alt={n.title} w={1400} className="mt-10 w-full rounded-3xl" />}
      <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink/80">
        {n.content.split(/\n{1,}/).filter(Boolean).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <Link href="/inscription" className="btn btn-primary mt-14">
        S&apos;inscrire maintenant
      </Link>
    </article>
  );
}
