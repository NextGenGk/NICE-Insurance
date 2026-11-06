"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CustomerProfile, ProductType } from "@prisma/client";
import { NavButtons } from "@/components/NavButtons";
import { isMotor, isProperty } from "@/lib/insurers";

const field =
  "w-full border border-[#D3E6EA] rounded-md px-3 py-2 text-sm text-[#0F2A2E] focus:outline-none focus:border-[#009FAF] bg-white";
const label = "block text-[12px] font-medium text-[#3F5D63] mb-1.5";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-wide text-[#7A979D] mt-6 mb-3 first:mt-0">
      {children}
    </div>
  );
}

function defaultCover(productType: ProductType) {
  if (productType === "TRUCK") return 1500000;
  if (productType === "CAR" || productType === "BIKE") return 400000;
  if (productType === "HEALTH") return 500000;
  if (productType === "TRAVEL") return 500000;
  return 1000000;
}

export function ProfileForm({
  leadId,
  productType,
  existing,
}: {
  leadId: string;
  productType: ProductType;
  existing: CustomerProfile | null;
}) {
  const router = useRouter();

  // Common
  const [age, setAge] = useState(existing?.age ?? 32);
  const [gender, setGender] = useState(existing?.gender ?? "Male");
  const [city, setCity] = useState(existing?.city ?? "Raipur");
  const [sumAssured, setSumAssured] = useState(existing?.sumAssured ?? defaultCover(productType));

  // Health
  const [familySize, setFamilySize] = useState(existing?.familySize ?? 2);
  const [preExisting, setPreExisting] = useState(existing?.preExisting ?? false);
  const [preExistingDetails, setPreExistingDetails] = useState(existing?.preExistingDetails ?? "");
  const [policyType, setPolicyType] = useState(existing?.policyType ?? "FLOATER");
  const [existingPolicy, setExistingPolicy] = useState(existing?.existingPolicy ?? false);
  const [roomRentPreference, setRoomRentPreference] = useState(existing?.roomRentPreference ?? "Single Private AC");

  // Motor (truck / car / bike)
  const [vehicleAgeYrs, setVehicleAgeYrs] = useState(existing?.vehicleAgeYrs ?? 2);
  const [vehicleRegistration, setVehicleRegistration] = useState(existing?.vehicleRegistration ?? "");
  const [vehicleMake, setVehicleMake] = useState(existing?.vehicleMake ?? "Tata");
  const [vehicleModel, setVehicleModel] = useState(existing?.vehicleModel ?? "");
  const [idv, setIdv] = useState(existing?.idv ?? 400000);
  const [previousInsurer, setPreviousInsurer] = useState(existing?.previousInsurer ?? "");
  const [ncbPercent, setNcbPercent] = useState(existing?.ncbPercent ?? 20);

  // Property / business (home / office / shop)
  const [propertyType, setPropertyType] = useState(
    existing?.propertyType ??
      (productType === "HOME" ? "Apartment" : productType === "OFFICE" ? "Office" : "Shop")
  );
  const [propertyAddress, setPropertyAddress] = useState(existing?.propertyAddress ?? "");
  const [businessType, setBusinessType] = useState(existing?.businessType ?? "");

  // Travel
  const [travelDestination, setTravelDestination] = useState(existing?.travelDestination ?? "");
  const [travelDays, setTravelDays] = useState(existing?.travelDays ?? 15);
  const [travellers, setTravellers] = useState(existing?.travellers ?? 1);

  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    await fetch(`/api/leads/${leadId}/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        age,
        gender,
        city,
        sumAssured,
        familySize,
        preExisting,
        preExistingDetails,
        policyType,
        existingPolicy,
        roomRentPreference,
        vehicleAgeYrs: isMotor(productType) ? vehicleAgeYrs : null,
        vehicleRegistration: isMotor(productType) ? vehicleRegistration : null,
        vehicleMake: isMotor(productType) ? vehicleMake : null,
        vehicleModel: isMotor(productType) ? vehicleModel : null,
        idv: isMotor(productType) ? idv : null,
        previousInsurer: isMotor(productType) || isProperty(productType) ? previousInsurer : null,
        ncbPercent: isMotor(productType) ? ncbPercent : null,
        propertyType: isProperty(productType) ? propertyType : null,
        propertyAddress: isProperty(productType) ? propertyAddress : null,
        businessType: isProperty(productType) ? businessType : null,
        travelDestination: productType === "TRAVEL" ? travelDestination : null,
        travelDays: productType === "TRAVEL" ? travelDays : null,
        travellers: productType === "TRAVEL" ? travellers : null,
      }),
    });
    router.push(`/leads/${leadId}/quote`);
  }

  const motorLabel =
    productType === "TRUCK" ? "Truck" : productType === "BIKE" ? "Two-wheeler" : "Car";

  return (
    <div>
      <div className="max-w-xl mb-8">
        <SectionTitle>Basic details</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Age</label>
            <input type="number" value={age} onChange={(e) => setAge(+e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className={field}>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label className={label}>City</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>
              {productType === "TRAVEL"
                ? "Travel cover requested (\u20B9)"
                : productType === "HOME" || productType === "OFFICE" || productType === "SHOP"
                ? "Property / contents value (\u20B9)"
                : isMotor(productType)
                ? "IDV / cover requested (\u20B9)"
                : "Sum assured / cover requested (\u20B9)"}
            </label>
            <input type="number" value={sumAssured} onChange={(e) => setSumAssured(+e.target.value)} className={field} />
          </div>
        </div>

        {productType === "HEALTH" && (
          <>
            <SectionTitle>Health insurance details</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Policy type</label>
                <select value={policyType} onChange={(e) => setPolicyType(e.target.value)} className={field}>
                  <option value="FLOATER">Family floater</option>
                  <option value="INDIVIDUAL">Individual</option>
                </select>
              </div>
              <div>
                <label className={label}>Family members to cover</label>
                <input type="number" min={1} value={familySize} onChange={(e) => setFamilySize(+e.target.value)} className={field} />
              </div>
              <div>
                <label className={label}>Preferred room rent category</label>
                <select value={roomRentPreference} onChange={(e) => setRoomRentPreference(e.target.value)} className={field}>
                  <option>Single Private AC</option>
                  <option>Twin Sharing</option>
                  <option>General Ward</option>
                  <option>No limit</option>
                </select>
              </div>
              <div>
                <label className={label}>Already holds a health policy?</label>
                <select
                  value={existingPolicy ? "Yes" : "No"}
                  onChange={(e) => setExistingPolicy(e.target.value === "Yes")}
                  className={field}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div>
                <label className={label}>Pre-existing condition disclosed</label>
                <select
                  value={preExisting ? "Yes" : "No"}
                  onChange={(e) => setPreExisting(e.target.value === "Yes")}
                  className={field}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              {preExisting && (
                <div>
                  <label className={label}>Condition details</label>
                  <input
                    value={preExistingDetails}
                    onChange={(e) => setPreExistingDetails(e.target.value)}
                    placeholder="e.g. Diabetes, Hypertension"
                    className={field}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {isMotor(productType) && (
          <>
            <SectionTitle>{motorLabel} insurance details</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>{motorLabel} make</label>
                <input value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} className={field} />
              </div>
              <div>
                <label className={label}>{motorLabel} model</label>
                <input value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} className={field} />
              </div>
              <div>
                <label className={label}>Registration number</label>
                <input
                  value={vehicleRegistration}
                  onChange={(e) => setVehicleRegistration(e.target.value.toUpperCase())}
                  placeholder="CG04AB1234"
                  className={field}
                />
              </div>
              <div>
                <label className={label}>Vehicle age (years)</label>
                <input type="number" min={0} value={vehicleAgeYrs} onChange={(e) => setVehicleAgeYrs(+e.target.value)} className={field} />
              </div>
              <div>
                <label className={label}>Insured Declared Value / IDV (\u20B9)</label>
                <input type="number" value={idv} onChange={(e) => setIdv(+e.target.value)} className={field} />
              </div>
              <div>
                <label className={label}>No Claim Bonus (%)</label>
                <input type="number" min={0} max={50} value={ncbPercent} onChange={(e) => setNcbPercent(+e.target.value)} className={field} />
              </div>
              <div>
                <label className={label}>Previous insurer, if any</label>
                <input value={previousInsurer} onChange={(e) => setPreviousInsurer(e.target.value)} placeholder="e.g. New India Assurance" className={field} />
              </div>
            </div>
          </>
        )}

        {isProperty(productType) && (
          <>
            <SectionTitle>Property / business details</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Property type</label>
                <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={field}>
                  {productType === "HOME" ? (
                    <>
                      <option>Apartment</option>
                      <option>Independent house</option>
                      <option>Bungalow</option>
                    </>
                  ) : (
                    <>
                      <option>Shop</option>
                      <option>Office</option>
                      <option>Showroom</option>
                      <option>Godown</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className={label}>Previous insurer, if any</label>
                <input value={previousInsurer} onChange={(e) => setPreviousInsurer(e.target.value)} placeholder="e.g. United India Insurance" className={field} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>Property address</label>
                <input value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} placeholder="e.g. Amapara, Raipur" className={field} />
              </div>
              {productType !== "HOME" && (
                <div className="sm:col-span-2">
                  <label className={label}>Nature of business</label>
                  <input value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="e.g. Retail trading" className={field} />
                </div>
              )}
            </div>
          </>
        )}

        {productType === "TRAVEL" && (
          <>
            <SectionTitle>Travel details</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Destination</label>
                <input value={travelDestination} onChange={(e) => setTravelDestination(e.target.value)} placeholder="e.g. Dubai, Singapore" className={field} />
              </div>
              <div>
                <label className={label}>Trip duration (days)</label>
                <input type="number" min={1} value={travelDays} onChange={(e) => setTravelDays(+e.target.value)} className={field} />
              </div>
              <div>
                <label className={label}>Travellers</label>
                <input type="number" min={1} value={travellers} onChange={(e) => setTravellers(+e.target.value)} className={field} />
              </div>
            </div>
          </>
        )}
      </div>
      <NavButtons
        backHref={`/leads/${leadId}/product`}
        onNext={submit}
        nextLabel={saving ? "Saving…" : "View quotations"}
        nextDisabled={saving}
      />
    </div>
  );
}
