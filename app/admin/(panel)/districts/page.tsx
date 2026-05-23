import { getDistrictCoverage } from "@/lib/data";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DistrictCoverageEditor } from "@/components/admin/DistrictCoverageEditor";

export default async function AdminDistrictsPage() {
  const coverage = await getDistrictCoverage();

  return (
    <div>
      <AdminPageHeader
        title="District Coverage"
        description="Telangana districts · Toggle delivery and service availability"
      />
      <DistrictCoverageEditor coverage={coverage} />
    </div>
  );
}
