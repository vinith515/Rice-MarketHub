export const PACKAGE_SIZES = [5, 10, 25, 26, 30, 50] as const;

export const BUSINESS_TYPES = [
  { value: "retailer", label: "Retailer" },
  { value: "kirana_store", label: "Kirana store" },
  { value: "supermarket", label: "Supermarket" },
  { value: "hotel", label: "Hotel" },
  { value: "restaurant", label: "Restaurant" },
  { value: "mess", label: "Mess" },
  { value: "caterer", label: "Caterer" },
  { value: "distributor", label: "Distributor" },
  { value: "supplier", label: "Supplier / wholesaler" },
] as const;

export const ENQUIRY_STATUSES = [
  "new",
  "contacted",
  "quoted",
  "closed",
] as const;

export const GALLERY_CATEGORIES = [
  "warehouse",
  "rice",
  "packaging",
  "transport",
  "retailer",
  "hotel",
] as const;

export const AVAILABILITY_STATUSES = [
  "in_stock",
  "limited",
  "out_of_stock",
] as const;

export const TELANGANA_DISTRICTS = [
  { code: "hyderabad", name: "Hyderabad" },
  { code: "ranga_reddy", name: "Ranga Reddy" },
  { code: "medchal", name: "Medchal-Malkajgiri" },
  { code: "sangareddy", name: "Sangareddy" },
  { code: "nizamabad", name: "Nizamabad" },
  { code: "karimnagar", name: "Karimnagar" },
  { code: "warangal", name: "Warangal" },
  { code: "khammam", name: "Khammam" },
  { code: "nalgonda", name: "Nalgonda" },
  { code: "mahbubnagar", name: "Mahbubnagar" },
  { code: "adilabad", name: "Adilabad" },
  { code: "kamareddy", name: "Kamareddy" },
  { code: "jagtial", name: "Jagtial" },
  { code: "peddapalli", name: "Peddapalli" },
  { code: "rajanna", name: "Rajanna Sircilla" },
  { code: "jayashankar", name: "Jayashankar Bhupalpally" },
  { code: "bhadradri", name: "Bhadradri Kothagudem" },
  { code: "suryapet", name: "Suryapet" },
  { code: "yadadri", name: "Yadadri Bhuvanagiri" },
  { code: "vikarabad", name: "Vikarabad" },
  { code: "medak", name: "Medak" },
  { code: "siddipet", name: "Siddipet" },
  { code: "jangaon", name: "Jangaon" },
  { code: "hanumakonda", name: "Hanumakonda" },
  { code: "mulugu", name: "Mulugu" },
  { code: "nagarkurnool", name: "Nagarkurnool" },
  { code: "wanaparthy", name: "Wanaparthy" },
  { code: "jogulamba", name: "Jogulamba Gadwal" },
  { code: "komaram_bheem", name: "Komaram Bheem" },
  { code: "mancherial", name: "Mancherial" },
  { code: "nirmal", name: "Nirmal" },
  { code: "asifabad", name: "Kumuram Bheem Asifabad" },
  { code: "narayanpet", name: "Narayanpet" },
] as const;
