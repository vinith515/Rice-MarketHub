import { z } from "zod";

export const enquirySchema = z
  .object({
    contact_name: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "Valid phone required"),
    email: z.string().email().optional().or(z.literal("")),
    business_type: z.string().min(1, "Business type required"),
    district_id: z.string().optional(),
    product_id: z.string().optional(),
    package_size_kg: z.coerce.number().optional(),
    quantity_unit: z.enum(["quintals", "bags"]).optional(),
    quantity_value: z.coerce.number().positive().optional(),
    message: z.string().min(10, "Please provide enquiry details"),
    website: z.string().max(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.product_id) {
      if (!data.quantity_unit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select quintals or bags",
          path: ["quantity_unit"],
        });
      }
      if (!data.quantity_value || data.quantity_value <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter required quantity",
          path: ["quantity_value"],
        });
      }
      if (data.quantity_unit === "bags" && !data.package_size_kg) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select bag size (kg)",
          path: ["package_size_kg"],
        });
      }
    }
  });

export const analyticsSchema = z.object({
  event_type: z.enum([
    "page_view",
    "product_view",
    "enquiry_submit",
    "whatsapp_click",
  ]),
  path: z.string().optional(),
  product_id: z.string().uuid().optional().nullable(),
  district_id: z.string().uuid().optional().nullable(),
  session_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;

export const visitorProfileSchema = z.object({
  contact_name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone required"),
  business_type: z.string().min(1, "Select your business type"),
  district_id: z.string().uuid().optional().or(z.literal("")),
  place_name: z.string().max(120).optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export const visitorLookupSchema = z.object({
  lookup: z.literal(true),
  phone: z.string().min(10),
});

export const visitorIntentSchema = z.object({
  visitor_id: z.string().uuid(),
  product_id: z.string().uuid().optional(),
  message: z.string().min(2).optional(),
  quantity_unit: z.enum(["quintals", "bags"]).optional(),
  quantity_value: z.coerce.number().positive().optional(),
  package_size_kg: z.coerce.number().optional(),
  source: z.enum(["quick_intent", "whatsapp", "form"]).optional(),
});

export type VisitorProfileFormData = z.infer<typeof visitorProfileSchema>;
