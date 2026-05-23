import { getDistrictCoverage } from "@/lib/data";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { DistrictMap } from "@/components/marketing/DistrictMap";

export const metadata = {
  title: "District Coverage",
  description: "Telangana district coverage map for rice distribution and delivery.",
};

export default async function CoveragePage() {
  const coverage = await getDistrictCoverage();

  return (
    <div className="pt-28">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Coverage"
            title="Telangana Distribution Network"
            description="Interactive map showing districts we serve. Delivery availability varies by region."
          />
          <DistrictMap coverage={coverage} />
        </div>
      </section>
    </div>
  );
}
