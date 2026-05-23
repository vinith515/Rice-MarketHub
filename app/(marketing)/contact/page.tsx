import { getDistricts, getProducts } from "@/lib/data";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { EnquiryForm } from "@/components/marketing/EnquiryForm";
import { WhatsAppOptionsLoader } from "@/components/marketing/WhatsAppOptionsLoader";
import { getWhatsAppSettings } from "@/lib/get-whatsapp-settings";
import { Phone, Mail, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact",
  description: "Contact us for bulk rice enquiries via WhatsApp, phone, or form.",
};

export default async function ContactPage() {
  const [districts, products, whatsappSettings] = await Promise.all([
    getDistricts(),
    getProducts(),
    getWhatsAppSettings(),
  ]);

  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+91 98765 43210";
  const email =
    process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "enquiries@example.com";
  const mapsUrl =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.0!2d78.4867!3d17.385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDIzJzA2LjAiTiA3OMKwMjknMTIuMSJF!5e0!3m2!1sen!2sin!4v1";

  return (
    <div className="pt-28">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Contact"
            title="Get in Touch for Bulk Supply"
            description="Single business number or team WhatsApp group — multiple staff can reply."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4 p-4 rounded-xl border">
                  <Phone className="h-6 w-6 text-gold" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold">
                      {phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl border">
                  <Mail className="h-6 w-6 text-gold" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href={`mailto:${email}`} className="font-semibold">
                      {email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl border">
                  <MapPin className="h-6 w-6 text-gold" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">Hyderabad, Telangana</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-6 mb-6">
                <h3 className="font-display text-lg mb-2">WhatsApp enquiries</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Direct number</strong> — chat with our main business line.
                  <br />
                  <strong>Team group</strong> — any available team member can help
                  with bulk orders.
                </p>
                <WhatsAppOptionsLoader layout="stack" showHint />
              </div>

              <div className="mt-8 rounded-2xl overflow-hidden border aspect-video">
                <iframe
                  src={mapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Warehouse location"
                />
              </div>
            </div>

            <div>
              <h3 className="font-display text-2xl mb-2">Bulk enquiry form</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Select a product to enter quantity in quintals or bags. Prices are per kg.
              </p>
              <EnquiryForm
                districts={districts}
                products={products}
                variant="classic"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
