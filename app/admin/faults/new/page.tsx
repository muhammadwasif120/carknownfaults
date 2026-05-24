import { FaultForm } from "@/components/admin/FaultForm";

export default function NewFaultPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Add New Fault</h1>
      <FaultForm mode="new" />
    </div>
  );
}
