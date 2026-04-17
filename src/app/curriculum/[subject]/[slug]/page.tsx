import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getArticlesList } from "@/lib/contents";
import {
  buildSubjectDirectory,
  getCanonicalArticlePath,
  getSubjectArticleParamsFromDirectory,
  getSubjectBySlug,
} from "@/lib/subjects";
import ArticlePageContent, {
  generateArticleMetadataBySlug,
  revalidate,
} from "@/app/articles/[slug]/ArticlePageContent";

export { revalidate };

export async function generateMetadata({
  params,
}: {
  params: { subject: string; slug: string };
}): Promise<Metadata> {
  return generateArticleMetadataBySlug(params.slug);
}

export async function generateStaticParams() {
  const articles = await getArticlesList();
  const directory = buildSubjectDirectory(articles);
  return getSubjectArticleParamsFromDirectory(directory);
}

export default async function SubjectArticlePage({
  params,
}: {
  params: { subject: string; slug: string };
}) {
  const subjectMeta = getSubjectBySlug(params.subject);
  if (!subjectMeta) notFound();

  const canonicalPath = getCanonicalArticlePath(params.slug);
  if (!canonicalPath) notFound();

  if (canonicalPath.includes("/sim/")) {
    redirect(canonicalPath);
  }

  const currentPath = `/curriculum/${params.subject}/${params.slug}`;
  if (canonicalPath !== currentPath) {
    redirect(canonicalPath);
  }

  return <ArticlePageContent slug={params.slug} />;
}
