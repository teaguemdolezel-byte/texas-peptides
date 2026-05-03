# Product image generation prompts

These prompts are written for **GPT Image / Sora / DALL-E 3 / Midjourney v6+** —
any current model that handles short on-product text reasonably well. Drop
each prompt straight in, generate 4 variants, pick the best one, upload to
Airtable's `Image` field on the matching product row.

For best label-text quality, use **GPT Image (ChatGPT 4o or Sora image gen)**
or **Midjourney with `--style raw`**. DALL-E 3 also works but tends to
hallucinate extra characters. If text is mangled, regenerate.

---

## Brand mark to render on the label

> A small brand mark: a 5-point lone star in cream/bone color (#f1eee6),
> contained within a thin teal square outline border (#00a88c).
> Below the mark, the wordmark **TEXAS PEPTIDES** in heavy uppercase
> sans-serif (Bricolage Grotesque or similar geometric grotesk). Tight
> letter-spacing.

---

## 1. Retatrutide 10mg

```
Studio product photograph of a single 10ml borosilicate glass research
peptide vial standing upright on dark polished concrete. The vial has a
gray rubber stopper and a brushed aluminum crimp seal at the top. Inside:
a perfectly even lyophilized white powder puck filling the bottom third of
the vial. Wrapped around the lower body of the vial is a minimalist matte
black product label.

The label shows, top-to-bottom:
- A small brand mark in the upper center: a cream-colored 5-point lone
  star inside a thin teal square outline border.
- Below it, the wordmark "TEXAS PEPTIDES" in heavy uppercase sans-serif,
  cream/bone color, tight letter-spacing.
- A thin teal horizontal divider line.
- The product name "RETATRUTIDE" in larger heavy uppercase sans, cream.
- Below it, smaller all-caps mono text: "10 mg · LYOPHILIZED · ≥99% HPLC"
- A small "FOR LABORATORY RESEARCH USE ONLY" line in muted gray at the
  bottom.

Lighting: dramatic single-source side light from the left, deep shadow on
the right, no overhead reflection. Background: deep charcoal #0b0b0c with
a faint teal gradient glow in the upper-left corner. Shot on a 50mm
macro lens, f/2.8, hyper-realistic commercial product photography. Sharp
focus on the label, slightly soft background falloff. 4k, ultra-detailed,
no people, no hands, no text errors. Square 1:1 composition.
```

## 2. GHK-Cu 50mg

```
Studio product photograph of a single 10ml borosilicate glass research
peptide vial standing upright on dark polished concrete. The vial has a
gray rubber stopper and a brushed aluminum crimp seal at the top. Inside:
a perfectly even lyophilized peptide powder filling the bottom third of
the vial — DEEP TEAL-BLUE color (this is GHK-Cu, the copper tripeptide,
naturally a striking teal/cobalt blue). Wrapped around the lower body of
the vial is a minimalist matte black product label.

The label shows, top-to-bottom:
- A small brand mark in the upper center: a cream-colored 5-point lone
  star inside a thin teal square outline border.
- Below it, the wordmark "TEXAS PEPTIDES" in heavy uppercase sans-serif,
  cream/bone color, tight letter-spacing.
- A thin teal horizontal divider line.
- The product name "GHK-CU" in larger heavy uppercase sans, cream.
- Below it, smaller all-caps mono text: "50 mg · COPPER TRIPEPTIDE · ≥98% HPLC"
- A small "FOR LABORATORY RESEARCH USE ONLY" line in muted gray at the
  bottom.

Lighting: dramatic single-source side light from the left, deep shadow on
the right. The teal-blue contents catch a subtle highlight through the
glass. Background: deep charcoal #0b0b0c with a faint oxblood gradient
glow in the upper-left corner. Shot on a 50mm macro lens, f/2.8,
hyper-realistic commercial product photography. Sharp focus on the label,
slightly soft background falloff. 4k, ultra-detailed, no people, no
hands, no text errors. Square 1:1 composition.
```

---

## Workflow

1. Generate a batch (4 variants) for each prompt.
2. Pick the cleanest — check for: label text spelled correctly, star + square
   logo readable, vial proportions right, lighting matches the site's vibe.
3. Open Airtable → **Products** table → click the cell under `Image` for the
   matching product row → **Upload from computer**.
4. Within ~10 seconds the website (with `revalidate = 10`) will pick up the
   new image and replace the placeholder vial SVG everywhere — catalog, home,
   product detail page.

## If text quality is bad

Most image gens butcher long lines of text. Fallback workflow:

1. Generate the vial WITHOUT the label text (just "minimal black label, no
   text" in the prompt).
2. Take the result into Photoshop / Figma / Affinity / even Canva.
3. Drop the real logo SVG (`/public/logo-mark.svg`) on top of the label,
   add the "TEXAS PEPTIDES" + "RETATRUTIDE 10 MG" text in Bricolage
   Grotesque.
4. Export and upload.

This 5-minute manual finish gets you a perfect label every time.

## Reference for the AI

If your tool accepts image input, attach `public/logo-mark.svg` (or a PNG
export of it) along with the prompt and add: "Recreate this brand mark
exactly on the label, do not modify proportions or colors." This usually
fixes the logo accuracy issue.
