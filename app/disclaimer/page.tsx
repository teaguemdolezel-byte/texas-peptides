import Reveal from "@/components/Reveal";

export const metadata = { title: "Research-use disclaimer · Texas Peptides" };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24">
      <Reveal>
        <p className="kicker eyebrow-line">Important</p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tightest text-ink-900 md:text-6xl">
          Research-use disclaimer.
        </h1>
      </Reveal>

      <div className="mt-12 space-y-6 text-base leading-relaxed text-ink-700">
        <p>
          All products sold by Texas Peptides LLC are intended for laboratory
          research use only. They are not intended for diagnostic, therapeutic,
          or any in vivo use, and are not for human or veterinary consumption.
        </p>
        <p>
          By placing an order, you confirm that you are a qualified researcher
          (or affiliated with a qualified research entity) and that you will
          handle and use these products in accordance with all applicable
          local, state, and federal laws.
        </p>
        <p>
          Products listed on this site are not approved by the U.S. Food and
          Drug Administration for use in humans. Texas Peptides LLC makes no
          claims, expressed or implied, regarding therapeutic effects, and
          explicitly does not market products for human or veterinary use.
        </p>

        <h2 className="mt-10 font-display text-2xl font-medium text-ink-900">
          Handling
        </h2>
        <p>
          Lyophilized peptides should be stored at −20°C and reconstituted only
          with bacteriostatic water under sterile laboratory conditions.
          Dispose of unused material in accordance with your institution&apos;s
          biohazard protocols.
        </p>

        <h2 className="mt-10 font-display text-2xl font-medium text-ink-900">
          Returns
        </h2>
        <p>
          Due to the nature of these products, all sales are final once the
          shipment has been delivered. Damaged or incorrect shipments must be
          reported within 48 hours of delivery.
        </p>
      </div>
    </div>
  );
}
