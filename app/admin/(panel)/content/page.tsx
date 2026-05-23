import { getAllSiteContent } from "@/lib/data";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ContentEditor } from "@/components/admin/ContentEditor";

export default async function AdminContentPage() {
  const content = await getAllSiteContent();

  return (
    <div>
      <AdminPageHeader
        title="Content Management"
        description="Edit homepage hero, stats, and about section"
      />
      <ContentEditor items={content} />
    </div>
  );
}
