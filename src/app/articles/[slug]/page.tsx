import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  generateArticleMetadataBySlug,
  generateArticleSlugStaticParams,
  revalidate,
} from "./ArticlePageContent";
import ArticlePageContent from "./ArticlePageContent";
import { getCanonicalArticlePath } from "@/lib/subjects";

export { revalidate };

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return generateArticleMetadataBySlug(params.slug);
}

export async function generateStaticParams() {
  return generateArticleSlugStaticParams();
}

export default async function LegacyArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const canonicalPath = getCanonicalArticlePath(params.slug);

  if (canonicalPath) {
    redirect(canonicalPath);
  }

  return <ArticlePageContent slug={params.slug} />;
}
