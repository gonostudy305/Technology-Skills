import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getArticlesList } from "@/lib/contents";
import {
  buildSubjectDirectory,
  getCanonicalArticlePath,
  getSubjectBySlug,
  getSubjectSimulationParamsFromDirectory,
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
  return getSubjectSimulationParamsFromDirectory(directory);
}

export default async function SubjectSimulationPage({
  params,
}: {
  params: { subject: string; slug: string };
}) {
  const subjectMeta = getSubjectBySlug(params.subject);
  if (!subjectMeta) notFound();

  const canonicalPath = getCanonicalArticlePath(params.slug);
  if (!canonicalPath) notFound();

  const currentPath = `/hoc-phan/${params.subject}/sim/${params.slug}`;
  if (canonicalPath !== currentPath) {
    redirect(canonicalPath);
  }

  return <ArticlePageContent slug={params.slug} />;
}
