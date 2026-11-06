// KYC verification adapter.
//
// Today this only validates format and returns a masked value — enough
// for a convincing demo. Once NICE approves a KYC vendor (Surepass /
// Digio / Signzy), swap the body of these two functions for a real API
// call; callers and the DB shape (KycDocument) don't need to change.

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const AADHAAR_RE = /^\d{12}$/;

export interface KycCheckResult {
  valid: boolean;
  masked: string;
}

export async function verifyPan(pan: string): Promise<KycCheckResult> {
  const clean = pan.trim().toUpperCase();
  const valid = PAN_RE.test(clean);
  // Simulated network latency so the UI's "checking..." state feels real.
  await new Promise((r) => setTimeout(r, 400));
  return {
    valid,
    masked: valid ? `${clean.slice(0, 5)}****${clean.slice(9)}` : clean,
  };
}

export async function verifyAadhaar(aadhaar: string): Promise<KycCheckResult> {
  const clean = aadhaar.replace(/\D/g, "");
  const valid = AADHAAR_RE.test(clean);
  await new Promise((r) => setTimeout(r, 400));
  return {
    valid,
    masked: valid ? `XXXX XXXX ${clean.slice(8)}` : clean,
  };
}
