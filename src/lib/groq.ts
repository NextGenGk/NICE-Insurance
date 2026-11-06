import Groq from "groq-sdk";
import { INSURERS, ProductType, InsurerRef, isMotor, isProperty } from "./insurers";

export interface QuoteInput {
  productType: ProductType;
  age: number;
  gender: string;
  city: string;
  sumAssured: number;
  familySize?: number;
  preExisting?: boolean;
  preExistingDetails?: string | null;
  policyType?: string | null;
  vehicleAgeYrs?: number;
  idv?: number | null;
  ncbPercent?: number | null;
  propertyType?: string | null;
  propertyAddress?: string | null;
  businessType?: string | null;
  travelDestination?: string | null;
  travelDays?: number | null;
  travellers?: number | null;
}

export interface QuoteResult {
  insurerCode: string;
  insurerName: string;
  planName: string;
  premiumPerYear: number;
  coverAmount: number;
  policyTermYears: number;
  claimSettlementRatio: string;
  highlight: string;
  source: "ai_estimate" | "fallback_estimate";
}

const SYSTEM_PROMPT = `You are a quotation engine for Indian general insurance products, used inside an internal advisor tool for NICE - Network of Insurance & Claims Expert (Raipur, Chhattisgarh). Given a customer profile and a product line, produce realistic annual premium quotes for the named insurers.

Ground every number in these approximate real-world Indian market ranges (annual premium in INR):

PRIVATE CAR (comprehensive, IDV 4-8L):
- New vehicle: 12,000-20,000 | 5+ years old: 7,000-12,000
Apply the stated No Claim Bonus percentage as a direct discount on the own-damage portion (roughly 60% of the premium is own-damage).

TWO-WHEELER (comprehensive, IDV 60k-1.5L): 1,200-4,500. Apply NCB the same way.

COMMERCIAL TRUCK (goods carriage, comprehensive): 25,000-80,000 depending on IDV, vehicle age and permits.

HEALTH (family floater, per year):
- 2 adults, cover 5L: 12,000-16,000 | 10L: 18,000-24,000
- 2 adults + 2 kids, cover 5L: 18,000-25,000 | 10L: 28,000-38,000
- Individual, cover 5L: 7,000-10,000 | 10L: 11,000-15,000
Add ~8-12% per dependent parent and ~15% if a pre-existing condition is disclosed.

HOME (householders / structure + contents): 2,000-8,000 for 10-50L property value.
OFFICE PACKAGE: 4,000-15,000 for 10-50L sum insured.
SHOPKEEPERS PACKAGE: 3,000-10,000 for 5-25L sum insured.
TRAVEL (per trip): 500-3,000 depending on destination, duration and number of travellers.

Vary each insurer's premium by roughly +/-8-15% from your computed base so quotes look like independent market pricing, not identical numbers. Keep relative ordering plausible (no single insurer is always cheapest).

Respond with ONLY valid JSON, no markdown fences, no commentary. Exact shape:
{
  "quotes": [
    { "insurerCode": "string, must exactly match a code given in the input list", "premiumPerYear": number, "policyTermYears": number, "claimSettlementRatio": "string like 98.7%", "highlight": "one short plain-sentence reason an advisor might recommend this plan" }
  ]
}`;

function buildUserMessage(input: QuoteInput, insurers: InsurerRef[]): string {
  const lines = [
    `Product type: ${input.productType}`,
    `Insurers to quote (use these exact codes): ${JSON.stringify(insurers.map((i) => ({ code: i.code, name: i.name, plan: i.plan })))}`,
    `Customer profile: age ${input.age}, gender ${input.gender}, city ${input.city}, sum insured / cover requested INR ${input.sumAssured}`,
  ];
  if (input.productType === "HEALTH")
    lines.push(
      `policy type: ${input.policyType ?? "FLOATER"}, family size: ${input.familySize ?? 1}, pre-existing condition disclosed: ${
        input.preExisting ? `yes (${input.preExistingDetails ?? "unspecified"})` : "no"
      }`
    );
  if (isMotor(input.productType))
    lines.push(
      `vehicle age: ${input.vehicleAgeYrs ?? 2} years, IDV: INR ${input.idv ?? input.sumAssured}, No Claim Bonus: ${input.ncbPercent ?? 0}%`
    );
  if (isProperty(input.productType))
    lines.push(
      `property type: ${input.propertyType ?? "unspecified"}, address: ${input.propertyAddress ?? input.city}, business: ${
        input.businessType ?? "n/a"
      }`
    );
  if (input.productType === "TRAVEL")
    lines.push(
      `destination: ${input.travelDestination ?? "unspecified"}, duration: ${input.travelDays ?? 15} days, travellers: ${input.travellers ?? 1}`
    );
  return lines.join("\n");
}

function fallbackBase(input: QuoteInput) {
  switch (input.productType) {
    case "TRUCK":
      return 45000;
    case "CAR":
      return 14000;
    case "BIKE":
      return 2500;
    case "HEALTH":
      return (input.familySize ?? 1) > 1 ? 24000 : 12000;
    case "HOME":
      return 5000;
    case "OFFICE":
      return 8000;
    case "SHOP":
      return 6000;
    case "TRAVEL":
      return 1500 * (input.travellers ?? 1);
    default:
      return 8000;
  }
}

function fallbackHighlight(productType: ProductType) {
  switch (productType) {
    case "TRUCK":
      return "Commercial vehicle cover with transit and third-party protection.";
    case "CAR":
      return "Comprehensive private car cover with add-on options.";
    case "BIKE":
      return "Two-wheeler package cover at an economical premium.";
    case "HEALTH":
      return "Cashless hospitalisation across a wide network of hospitals.";
    case "HOME":
      return "Protects both the house structure and household contents.";
    case "OFFICE":
      return "Office package cover for contents, equipment and liability.";
    case "SHOP":
      return "Shopkeepers package covering stock, fittings and liability.";
    case "TRAVEL":
      return "Trip cancellation, medical and baggage protection abroad.";
    default:
      return "Balanced cover-to-premium ratio for this profile.";
  }
}

function fallbackQuotes(input: QuoteInput, insurers: InsurerRef[]): QuoteResult[] {
  const base = fallbackBase(input);
  const ratios = ["98.7%", "97.9%", "99.1%", "96.5%", "98.0%", "95.8%", "97.2%", "96.9%"];

  return insurers.map((ins, i) => {
    const variance = [1.08, 0.94, 1.15, 1.02, 0.9, 1.05, 0.97, 1.11][i % 8];
    const ncbDiscount = isMotor(input.productType) ? 1 - ((input.ncbPercent ?? 0) / 100) * 0.6 : 1;
    return {
      insurerCode: ins.code,
      insurerName: ins.name,
      planName: ins.plan,
      premiumPerYear: Math.round((base * variance * ncbDiscount) / 100) * 100,
      coverAmount: input.sumAssured,
      policyTermYears: 1,
      claimSettlementRatio: ratios[i % ratios.length],
      highlight: fallbackHighlight(input.productType),
      source: "fallback_estimate" as const,
    };
  });
}

export async function generateQuotes(input: QuoteInput): Promise<QuoteResult[]> {
  const insurers = INSURERS[input.productType];
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    // No key configured — return the deterministic local estimate so the
    // app still works end to end without any external dependency.
    return fallbackQuotes(input, insurers);
  }

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0.6,
      max_tokens: 2500,
      reasoning_effort: "low",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserMessage(input, insurers) },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    const withoutFences = text.replace(/```json|```/g, "").trim();
    const start = withoutFences.indexOf("{");
    const end = withoutFences.lastIndexOf("}");
    const clean =
      start !== -1 && end > start ? withoutFences.slice(start, end + 1) : withoutFences;
    const parsed = JSON.parse(clean) as { quotes: Array<Record<string, unknown>> };

    if (!parsed.quotes?.length) throw new Error("empty quotes from model");

    return parsed.quotes.map((q) => {
      const ref = insurers.find((i) => i.code === q.insurerCode) ?? insurers[0];
      return {
        insurerCode: ref.code,
        insurerName: ref.name,
        planName: ref.plan,
        premiumPerYear: Number(q.premiumPerYear) || 0,
        coverAmount: input.sumAssured,
        policyTermYears: Number(q.policyTermYears) || 1,
        claimSettlementRatio: String(q.claimSettlementRatio ?? "97.5%"),
        highlight: String(q.highlight ?? ""),
        source: "ai_estimate" as const,
      };
    });
  } catch (err) {
    // Network hiccup, bad key, or malformed model output — never break
    // the app. Fall back to the local estimator silently.
    console.error("Groq quote generation failed, using fallback:", err);
    return fallbackQuotes(input, insurers);
  }
}
