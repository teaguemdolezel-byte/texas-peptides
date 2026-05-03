/**
 * Local fallback product catalog.
 *
 * In production these are sourced from Airtable (see lib/airtable.ts and
 * /api/products) so price + stock can change without redeploying.
 *
 * Inventory model:
 *   - On Hand     = T Fridge + R Fridge + M Fridge (physical units)
 *   - Committed   = paid orders not yet shipped (reserved units)
 *   - Available   = On Hand - Committed (what customers can buy now)
 *
 * Pricing model:
 *   - Whatever Price is set to in Airtable IS the price. No interpolation.
 */

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  family: "GLP-1" | "Skin & Tissue";
  tagline: string;
  shortDescription: string;
  longDescription: string;
  bullets: string[];
  sequence?: string;
  molecularWeight?: string;
  purity: string;
  size: string;
  priceCents: number;     // single price — whatever's in Airtable
  onHand: number;         // physical units across all three fridges
  committed: number;      // paid orders not yet shipped
  imageUrl?: string;
  imageAlt?: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "retatrutide-10mg",
    name: "Retatrutide 10mg",
    shortName: "Retatrutide",
    family: "GLP-1",
    tagline: "Triple-agonist research peptide.",
    shortDescription:
      "GLP-1 / GIP / glucagon triple-receptor agonist. 10 mg lyophilized vial. ≥99% HPLC purity.",
    longDescription:
      "Retatrutide is a synthetic 39-amino-acid peptide and a triple agonist of the GLP-1, GIP, and glucagon receptors. Manufactured to ≥99% purity by reverse-phase HPLC, lyophilized for stability, and shipped with a per-batch certificate of analysis.",
    bullets: [
      "≥99% HPLC purity, mass-spec verified",
      "10 mg lyophilized white powder",
      "Sealed in tamper-evident borosilicate vial",
      "Per-batch certificate of analysis included",
    ],
    molecularWeight: "4731 g/mol",
    purity: "≥99%",
    size: "10 mg vial",
    priceCents: 19900,
    onHand: 42,
    committed: 0,
  },
  {
    slug: "ghk-cu-50mg",
    name: "GHK-Cu 50mg",
    shortName: "GHK-Cu",
    family: "Skin & Tissue",
    tagline: "Copper tripeptide complex.",
    shortDescription:
      "Glycyl-L-histidyl-L-lysine bound to a copper(II) ion. 50 mg lyophilized vial. ≥98% HPLC purity.",
    longDescription:
      "GHK-Cu is a naturally occurring tripeptide-copper complex used widely in skin and tissue research. Each vial contains 50 mg of lyophilized peptide, ≥98% pure, with the copper ion stoichiometrically bound.",
    bullets: [
      "≥98% HPLC purity",
      "50 mg lyophilized blue powder",
      "Stoichiometric Cu²⁺ binding",
      "Per-batch certificate of analysis included",
    ],
    sequence: "Gly-His-Lys + Cu²⁺",
    molecularWeight: "402.91 g/mol",
    purity: "≥98%",
    size: "50 mg vial",
    priceCents: 8900,
    onHand: 96,
    committed: 0,
  },
];

/** What customers see — what's left after subtracting committed. */
export function availableUnits(p: Pick<Product, "onHand" | "committed">) {
  return Math.max(0, p.onHand - p.committed);
}

/** Customer-facing price — exactly what's in Airtable. */
export function currentPriceCents(p: Pick<Product, "priceCents">) {
  return p.priceCents;
}

export type StockState = "ok" | "limited" | "low" | "preorder";

/**
 * State for the customer-facing UI, based on Available (not on-hand).
 * Pre-order whenever there's nothing left to commit.
 */
export function stockState(p: Pick<Product, "onHand" | "committed">): StockState {
  const avail = availableUnits(p);
  if (avail <= 0) return "preorder";
  if (avail <= 5) return "low";
  if (avail <= 15) return "limited";
  return "ok";
}

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
