export type ProductType =
  | "TRUCK"
  | "CAR"
  | "BIKE"
  | "HEALTH"
  | "HOME"
  | "OFFICE"
  | "SHOP"
  | "TRAVEL";

export interface InsurerRef {
  code: string;
  name: string;
  plan: string;
  color: string;
  /** Local logo filename in /public/logos/ */
  logoFile?: string;
}

/** Product lines offered by NICE – Network of Insurance & Claims Expert. */
export const PRODUCT_LABELS: Record<ProductType, string> = {
  TRUCK: "Truck Insurance",
  CAR: "Car Insurance",
  BIKE: "Bike Insurance",
  HEALTH: "Health Insurance",
  HOME: "Home Insurance",
  OFFICE: "Office Insurance",
  SHOP: "Shop Insurance",
  TRAVEL: "Travel Insurance",
};

export const MOTOR_PRODUCTS: ProductType[] = ["TRUCK", "CAR", "BIKE"];
export const PROPERTY_PRODUCTS: ProductType[] = ["HOME", "OFFICE", "SHOP"];

export function isMotor(productType: ProductType) {
  return MOTOR_PRODUCTS.includes(productType);
}

export function isProperty(productType: ProductType) {
  return PROPERTY_PRODUCTS.includes(productType);
}

interface InsurerBase {
  code: string;
  name: string;
  color: string;
  logoFile: string;
}

// Real general-insurance partners listed on niceinsurance.co.in.
const PARTNERS: Record<string, InsurerBase> = {
  bajaj_allianz: { code: "bajaj_allianz", name: "Bajaj Allianz General", color: "#0072BC", logoFile: "bajaj-allianz.png" },
  cholamandalam: { code: "cholamandalam", name: "Cholamandalam MS General", color: "#E31E24", logoFile: "cholamandalam-ms.jpg" },
  edelweiss: { code: "edelweiss", name: "Edelweiss General", color: "#6C2B8E", logoFile: "edelweiss.png" },
  icici_lombard: { code: "icici_lombard", name: "ICICI Lombard General", color: "#F37021", logoFile: "icici-lombard.png" },
  iffco_tokio: { code: "iffco_tokio", name: "IFFCO-Tokio General", color: "#00793C", logoFile: "iffco-tokio.png" },
  liberty: { code: "liberty", name: "Liberty General", color: "#003B71", logoFile: "liberty.jpg" },
  magma_hdi: { code: "magma_hdi", name: "Magma HDI General", color: "#E31E24", logoFile: "magma-hdi.png" },
  oriental: { code: "oriental", name: "Oriental Insurance", color: "#003B71", logoFile: "oriental.png" },
  reliance: { code: "reliance", name: "Reliance General", color: "#003DA5", logoFile: "reliance.png" },
  royal_sundaram: { code: "royal_sundaram", name: "Royal Sundaram General", color: "#E31E24", logoFile: "royal-sundaram.png" },
  sbi_general: { code: "sbi_general", name: "SBI General", color: "#1C4587", logoFile: "sbi-general.png" },
  shriram: { code: "shriram", name: "Shriram General", color: "#E31E24", logoFile: "shriram.png" },
  universal_sompo: { code: "universal_sompo", name: "Universal Sompo General", color: "#003B71", logoFile: "universal-sompo.jpg" },
  united_india: { code: "united_india", name: "United India Insurance", color: "#0066B3", logoFile: "united-india.jpg" },
  kotak: { code: "kotak", name: "Kotak General", color: "#ED1C24", logoFile: "kotak.png" },
  hdfc_ergo: { code: "hdfc_ergo", name: "HDFC Ergo General", color: "#004C8F", logoFile: "hdfc-ergo.png" },
  new_india: { code: "new_india", name: "New India Assurance", color: "#003B71", logoFile: "new-india.png" },
  star_health: { code: "star_health", name: "Star Health", color: "#E4002B", logoFile: "star-health.png" },
  future_generali: { code: "future_generali", name: "Future Generali", color: "#E31E24", logoFile: "future-generali.png" },
};

function plan(code: keyof typeof PARTNERS, planName: string): InsurerRef {
  return { ...PARTNERS[code], plan: planName };
}

export const INSURERS: Record<ProductType, InsurerRef[]> = {
  TRUCK: [
    plan("bajaj_allianz", "Commercial Vehicle Package"),
    plan("icici_lombard", "Commercial Vehicle Insurance"),
    plan("hdfc_ergo", "Commercial Vehicle Insurance"),
    plan("new_india", "Commercial Vehicle Package"),
    plan("united_india", "Commercial Vehicle Package"),
    plan("oriental", "Commercial Vehicle Insurance"),
    plan("reliance", "Commercial Vehicle Insurance"),
    plan("shriram", "Commercial Vehicle Insurance"),
  ],
  CAR: [
    plan("bajaj_allianz", "Private Car Package"),
    plan("icici_lombard", "Comprehensive Car Insurance"),
    plan("hdfc_ergo", "Comprehensive Car Insurance"),
    plan("cholamandalam", "Private Car Package"),
    plan("royal_sundaram", "Private Car Package"),
    plan("new_india", "Private Car Package"),
    plan("sbi_general", "Private Car Package"),
    plan("future_generali", "Private Car Package"),
  ],
  BIKE: [
    plan("bajaj_allianz", "Two-Wheeler Package"),
    plan("icici_lombard", "Two-Wheeler Insurance"),
    plan("hdfc_ergo", "Two-Wheeler Insurance"),
    plan("new_india", "Two-Wheeler Package"),
    plan("united_india", "Two-Wheeler Package"),
    plan("oriental", "Two-Wheeler Insurance"),
    plan("sbi_general", "Two-Wheeler Package"),
    plan("reliance", "Two-Wheeler Insurance"),
  ],
  HEALTH: [
    plan("star_health", "Family Health Optima"),
    plan("hdfc_ergo", "Optima Secure"),
    plan("icici_lombard", "Complete Health Insurance"),
    plan("bajaj_allianz", "Health Guard"),
    plan("new_india", "New India Mediclaim"),
    plan("united_india", "United India Mediclaim"),
    plan("oriental", "Oriental Mediclaim"),
    plan("sbi_general", "Arogya Sanjeevani"),
  ],
  HOME: [
    plan("bajaj_allianz", "Householders Package"),
    plan("icici_lombard", "Home Insurance"),
    plan("hdfc_ergo", "Home Insurance"),
    plan("new_india", "Householders Package"),
    plan("united_india", "Householders Package"),
    plan("oriental", "Home Insurance"),
    plan("sbi_general", "Home Insurance"),
    plan("reliance", "Home Insurance"),
  ],
  OFFICE: [
    plan("bajaj_allianz", "Office Package Policy"),
    plan("icici_lombard", "Office Insurance"),
    plan("hdfc_ergo", "Office Insurance"),
    plan("new_india", "Office Package Policy"),
    plan("united_india", "Office Package Policy"),
    plan("oriental", "Office Insurance"),
    plan("sbi_general", "Office Insurance"),
    plan("reliance", "Office Insurance"),
  ],
  SHOP: [
    plan("bajaj_allianz", "Shopkeepers Package Policy"),
    plan("icici_lombard", "Shop Insurance"),
    plan("hdfc_ergo", "Shop Insurance"),
    plan("new_india", "Shopkeepers Package Policy"),
    plan("united_india", "Shopkeepers Package Policy"),
    plan("oriental", "Shop Insurance"),
    plan("sbi_general", "Shop Insurance"),
    plan("reliance", "Shop Insurance"),
  ],
  TRAVEL: [
    plan("bajaj_allianz", "Travel Insurance"),
    plan("icici_lombard", "Travel Insurance"),
    plan("hdfc_ergo", "Travel Insurance"),
    plan("new_india", "Overseas Travel Insurance"),
    plan("united_india", "Travel Insurance"),
    plan("oriental", "Travel Insurance"),
    plan("reliance", "Travel Insurance"),
    plan("future_generali", "Travel Insurance"),
  ],
};
