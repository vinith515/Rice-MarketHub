import { getAdminEnquiries } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EnquiryStatusSelect } from "@/components/admin/EnquiryStatusSelect";

export default async function AdminEnquiriesPage() {
  const enquiries = await getAdminEnquiries();

  return (
    <div>
      <AdminPageHeader
        title="Enquiries"
        description={`${enquiries.length} leads from forms and WhatsApp`}
      />

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: "#2d5a3d", color: "#f5f0e8" }}>
              <tr>
                <th className="text-left p-4 font-semibold">Contact</th>
                <th className="text-left p-4 font-semibold">Business</th>
                <th className="text-left p-4 font-semibold">Phone</th>
                <th className="text-left p-4 font-semibold">Quantity</th>
                <th className="text-left p-4 font-semibold">Message</th>
                <th className="text-left p-4 font-semibold">Source</th>
                <th className="text-left p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e, i) => (
                <tr
                  key={e.id}
                  style={{
                    backgroundColor: i % 2 === 0 ? "#fff" : "#faf8f4",
                    borderBottom: "1px solid #ebe6dc",
                  }}
                >
                  <td className="p-4 font-medium">{e.contact_name}</td>
                  <td className="p-4 capitalize">{e.business_type}</td>
                  <td className="p-4">{e.phone}</td>
                  <td className="p-4 text-xs whitespace-nowrap">
                    {e.quantity_unit && e.quantity_value != null
                      ? e.quantity_unit === "quintals"
                        ? `${e.quantity_value} qtl`
                        : `${e.quantity_value} × ${e.package_size_kg ?? "?"}kg bags`
                      : e.package_size_kg
                        ? `${e.package_size_kg}kg`
                        : "—"}
                  </td>
                  <td className="p-4 max-w-xs truncate">{e.message}</td>
                  <td className="p-4 capitalize">
                    {e.source.replace(/_/g, " ")}
                  </td>
                  <td className="p-4">
                    <EnquiryStatusSelect id={e.id} status={e.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {enquiries.length === 0 && (
          <p className="p-8 text-center" style={{ color: "#888" }}>
            No enquiries yet.
          </p>
        )}
      </div>
    </div>
  );
}
