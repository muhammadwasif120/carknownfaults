import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { FaultCard } from "@/components/fault/FaultCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { generateTagMetadata } from "@/lib/utils/seo";

interface Props { params: Promise<{ tag: string }> }

export const revalidate = 86400;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: tagSlug } = await params;
  const { createBuildClient } = await import("@/lib/supabase/build");
  const sb = createBuildClient();
  const { data: tag } = await sb.from("tags").select("name, slug").eq("slug", tagSlug).single();
  if (!tag) return { title: "Tag Not Found" };
  return generateTagMetadata(tag);
}

export async function generateStaticParams() {
  const { createBuildClient } = await import("@/lib/supabase/build");
  const supabase = createBuildClient();
  const { data } = await supabase.from("tags").select("slug");
  return (data ?? []).map((t) => ({ tag: t.slug }));
}

export default async function TagPage({ params }: Props) {
  const { tag: tagSlug } = await params;
  const supabase = await createClient();

  const { data: tag } = await supabase.from("tags").select("*").eq("slug", tagSlug).single();
  if (!tag) notFound();

  const { data: faultTags } = await supabase
    .from("fault_tags")
    .select("fault_id")
    .eq("tag_id", tag.id);

  const faultIds = (faultTags ?? []).map((ft) => ft.fault_id);

  const { data: faults } =
    faultIds.length > 0
      ? await supabase
          .from("faults")
          .select("*, variants(slug, name, models(slug, name, makes(slug, name)))")
          .in("id", faultIds)
          .eq("published", true)
          .order("created_at", { ascending: false })
      : { data: [] };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: `#${tag.name}` }]} />
      <h1 className="text-3xl font-bold text-[#111827] mt-6 mb-2">{tag.name} Faults</h1>
      <p className="text-[#6B7280] mb-8">{faults?.length ?? 0} known faults tagged with {tag.name}</p>

      {faults && faults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(faults as any[]).map((fault) => {
            const v = fault.variants;
            const href = `/${v.models?.makes?.slug}/${v.models?.slug}/${v.slug}/${fault.slug}`;
            return <FaultCard key={fault.id} fault={fault} href={href} />;
          })}
        </div>
      ) : (
        <p className="text-[#6B7280]">No faults tagged with this component yet.</p>
      )}
    </div>
  );
}
