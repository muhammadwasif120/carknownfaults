import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FaultForm } from "@/components/admin/FaultForm";

interface Props { params: Promise<{ id: string }> }

export default async function EditFaultPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: fault } = await supabase.from("faults").select("*").eq("id", id).single();
  if (!fault) notFound();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Edit Fault</h1>
      <FaultForm mode="edit" initialData={fault} />
    </div>
  );
}
