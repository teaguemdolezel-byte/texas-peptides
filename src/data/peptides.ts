export interface PeptideSize {
  amount: string;
  price: number;
  inStock: boolean;
}

export interface Peptide {
  slug: string;
  name: string;
  tag: string;
  category: string;
  purity: string;
  cas: string;
  molecularWeight: string;
  sequence: string;
  form: string;
  storage: string;
  sizes: PeptideSize[];
  shortDescription: string;
  description: string;
  mechanism: string;
  researchHighlights: string[];
  citations: string[];
  popular: boolean;
}

export const peptides: Peptide[] = [
  {
    slug: "bpc-157",
    name: "BPC-157",
    tag: "The Recovery Staple",
    category: "Recovery",
    purity: "99.2%",
    cas: "137525-51-0",
    molecularWeight: "1419.53 g/mol",
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 30 days.",
    sizes: [
      { amount: "5mg", price: 34.99, inStock: true },
      { amount: "10mg", price: 59.99, inStock: true },
    ],
    shortDescription:
      "The one everyone asks about first. Studied for gut and tissue repair. Your new favorite compound.",
    description:
      "BPC-157 (Body Protection Compound-157) is a pentadecapeptide derived from a protein found in gastric juice. It's one of the most widely researched peptides in the recovery space, with hundreds of preclinical studies examining its effects on tissue repair, gut lining protection, tendon and ligament healing, and inflammation modulation.",
    mechanism:
      "BPC-157 is believed to work through multiple pathways: upregulation of growth factor receptors (including VEGF and FGF), modulation of the nitric oxide system, interaction with the dopaminergic system, and promotion of angiogenesis (new blood vessel formation). It also appears to activate FAK-paxillin signaling, which plays a key role in cell migration and wound healing.",
    researchHighlights: [
      "Accelerated healing of tendon, ligament, and muscle injuries in rodent models",
      "Protective effects on gastric mucosa and intestinal lining integrity",
      "Counteracted NSAID-induced gut damage in preclinical studies",
      "Promoted angiogenesis and granulation tissue formation",
      "Demonstrated neuroprotective properties in dopaminergic system research",
      "Showed anti-inflammatory effects through NO system modulation",
    ],
    citations: [
      "Sikiric P, et al. \"Brain-gut axis and pentadecapeptide BPC 157.\" J Physiol Pharmacol. 2017;68(2):177-196.",
      "Chang CH, et al. \"BPC 157 and its role in accelerating wound healing.\" Life Sci. 2020;243:117267.",
      "Seiwerth S, et al. \"BPC 157's effect on healing.\" Curr Pharm Des. 2018;24(18):2034-2039.",
    ],
    popular: true,
  },
  {
    slug: "tb-500",
    name: "TB-500",
    tag: "The Mobility Play",
    category: "Recovery",
    purity: "99.5%",
    cas: "77591-33-4",
    molecularWeight: "4963.44 g/mol",
    sequence: "Ac-SDKP (active fragment of Thymosin Beta-4)",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 21 days.",
    sizes: [
      { amount: "5mg", price: 39.99, inStock: true },
      { amount: "10mg", price: 69.99, inStock: true },
    ],
    shortDescription:
      "Thymosin Beta-4 fragment. Researched for cell migration and healing. Stacks well with BPC.",
    description:
      "TB-500 is a synthetic version of Thymosin Beta-4, a naturally occurring 43-amino acid peptide found in virtually all human and animal cells. It plays a central role in tissue repair, cell migration, and anti-inflammatory response. TB-500 specifically represents the active region responsible for actin binding and cell motility.",
    mechanism:
      "TB-500 works primarily through its interaction with actin, a cell-building protein. It promotes actin polymerization, which drives cell migration to injury sites. It also upregulates cell-surface receptors involved in anti-inflammatory signaling, promotes new blood vessel growth (angiogenesis), and facilitates the differentiation of stem cells for tissue-specific repair.",
    researchHighlights: [
      "Enhanced cell migration and proliferation at injury sites in animal models",
      "Promoted cardiac repair and reduced scar tissue formation post-injury",
      "Demonstrated anti-inflammatory properties through regulation of inflammatory cytokines",
      "Accelerated wound healing including skin, corneal, and cardiac tissue",
      "Showed synergistic effects when combined with BPC-157 in preclinical models",
      "Promoted hair follicle stem cell migration in dermatological research",
    ],
    citations: [
      "Goldstein AL, et al. \"Thymosin beta4: a multi-functional regenerative peptide.\" Expert Opin Biol Ther. 2012;12(1):37-51.",
      "Crockford D. \"Development of thymosin beta4 for wound healing.\" Ann N Y Acad Sci. 2007;1112:385-395.",
      "Sosne G, et al. \"Thymosin beta 4 and corneal wound healing.\" Ann N Y Acad Sci. 2010;1194:190-198.",
    ],
    popular: true,
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    tag: "The Glow Protocol",
    category: "Recovery",
    purity: "99.1%",
    cas: "49557-75-7",
    molecularWeight: "403.93 g/mol",
    sequence: "Gly-His-Lys · Cu²⁺",
    form: "Lyophilized powder (blue)",
    storage: "Store at -20°C. Protect from light. Reconstituted: 4°C, use within 14 days.",
    sizes: [
      { amount: "50mg", price: 24.99, inStock: true },
      { amount: "200mg", price: 79.99, inStock: true },
    ],
    shortDescription:
      "Copper peptide complex. Anti-inflammatory, remodeling, and the skin research nerds love it.",
    description:
      "GHK-Cu (glycyl-L-histidyl-L-lysine copper complex) is a naturally occurring copper peptide found in human plasma, saliva, and urine. Discovered in 1973, it's one of the most extensively studied peptides in the tissue remodeling and skin biology space. Its concentration in plasma declines significantly with age, which has made it a focus of longevity and regenerative research.",
    mechanism:
      "GHK-Cu exerts its effects through copper-dependent enzyme activation, gene expression modulation (affecting over 4,000 genes), and direct antioxidant activity. It stimulates collagen and glycosaminoglycan synthesis, promotes decorin production (which regulates collagen organization), activates wound healing cascades through attraction of immune and repair cells, and suppresses free radical damage via superoxide dismutase activation.",
    researchHighlights: [
      "Stimulated collagen synthesis and skin remodeling in multiple in-vitro studies",
      "Promoted wound healing and reduced scarring in animal models",
      "Demonstrated anti-inflammatory effects by suppressing ferritin and TGF-beta",
      "Reset gene expression patterns toward a healthier state in DNA microarray studies",
      "Showed antioxidant activity through SOD and other copper-enzyme pathways",
      "Promoted nerve outgrowth and neural repair in preliminary research",
    ],
    citations: [
      "Pickart L, et al. \"GHK Peptide as a Natural Modulator of Multiple Cellular Pathways.\" BioMed Res Int. 2015;2015:648108.",
      "Pickart L, Margolina A. \"Regenerative and Protective Actions of GHK-Cu Peptide.\" Int J Mol Sci. 2018;19(7):1987.",
      "Huang PJ, et al. \"Copper peptide GHK-Cu in wound healing.\" Bioengineered. 2021;12(1):5666-5681.",
    ],
    popular: false,
  },
  {
    slug: "cjc-1295",
    name: "CJC-1295",
    tag: "The Growth Signal",
    category: "Growth",
    purity: "99.6%",
    cas: "863288-34-0",
    molecularWeight: "3647.28 g/mol",
    sequence: "Tyr-D-Ala-Asp-Ala-Ile-Phe-Thr-Gln-Ser-Tyr-Arg-Lys-Val-Leu-Ala-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Leu-Ser-Arg-DAP",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 21 days.",
    sizes: [
      { amount: "2mg", price: 32.99, inStock: true },
      { amount: "5mg", price: 64.99, inStock: true },
    ],
    shortDescription:
      "Sustained GH release without the spike-and-crash. The clean approach to growth research.",
    description:
      "CJC-1295 is a synthetic analog of growth hormone-releasing hormone (GHRH) with a Drug Affinity Complex (DAC) modification that extends its half-life from minutes to approximately 6-8 days. This modification enables sustained, physiological growth hormone elevation without the sharp spikes and crashes associated with direct GH administration.",
    mechanism:
      "CJC-1295 binds to GHRH receptors on pituitary somatotroph cells, stimulating the release and synthesis of growth hormone. The DAC modification (a lysine linker attached to a maleimidopropionic acid group) allows it to bind to serum albumin after injection, dramatically extending its bioavailability. This produces sustained GH pulsatility rather than a single spike, more closely mimicking natural physiology.",
    researchHighlights: [
      "Sustained elevation of GH and IGF-1 levels for 6-8 days after single dose in clinical studies",
      "Maintained natural GH pulsatility patterns rather than flat-line elevation",
      "Dose-dependent increases in IGF-1 without desensitization in short-term trials",
      "Enhanced slow-wave sleep duration in research subjects — the phase associated with recovery",
      "Demonstrated favorable safety profile in Phase I/II trials",
      "Synergistic effects when combined with GHRP-class peptides in preclinical work",
    ],
    citations: [
      "Teichman SL, et al. \"Prolonged stimulation of growth hormone (GH) and insulin-like growth factor I secretion by CJC-1295.\" J Clin Endocrinol Metab. 2006;91(3):799-805.",
      "Alba M, et al. \"Once-daily administration of CJC-1295.\" J Clin Endocrinol Metab. 2006;91(5):1568-1573.",
      "Ionescu M, Bhatt DL. \"Extended-release GHRH analogs: clinical applications.\" Pituitary. 2011;14(1):80-89.",
    ],
    popular: true,
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    tag: "The Clean Pulse",
    category: "Growth",
    purity: "99.5%",
    cas: "170851-70-4",
    molecularWeight: "711.85 g/mol",
    sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH₂",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 30 days.",
    sizes: [
      { amount: "2mg", price: 27.99, inStock: true },
      { amount: "5mg", price: 49.99, inStock: true },
    ],
    shortDescription:
      "Selective GH secretagogue — stimulates growth hormone without jacking cortisol or prolactin.",
    description:
      "Ipamorelin is a pentapeptide growth hormone secretagogue and ghrelin receptor agonist. What makes it unique in the GHRP class is its remarkable selectivity — it stimulates GH release without significantly affecting cortisol, prolactin, or ACTH levels. This makes it one of the \"cleanest\" GH-stimulating peptides available for research.",
    mechanism:
      "Ipamorelin acts on the ghrelin receptor (GHS-R1a) in the pituitary gland, triggering calcium-dependent GH release from somatotroph cells. Unlike other GHRPs (GHRP-6, Hexarelin), it does not activate the broader HPA axis, leaving cortisol and ACTH unaffected. It also does not significantly stimulate appetite through vagal afferent pathways, making it highly selective for GH release alone.",
    researchHighlights: [
      "Selective GH release without cortisol, prolactin, or ACTH elevation in clinical trials",
      "Dose-dependent GH secretion with no desensitization at therapeutic doses",
      "Potent synergy with CJC-1295 for sustained physiological GH elevation",
      "Favorable safety profile in Phase II clinical trials for post-surgical recovery",
      "No significant effect on appetite — unlike GHRP-6",
      "Maintained GH pulse amplitude in aged animal models, countering age-related decline",
    ],
    citations: [
      "Raun K, et al. \"Ipamorelin, the first selective growth hormone secretagogue.\" Eur J Endocrinol. 1998;139(5):552-561.",
      "Johansen PB, et al. \"Ipamorelin: a new growth-hormone-releasing peptide.\" J Endocrinol. 1999;161(1):1-6.",
      "Beck DE, et al. \"Ipamorelin for postoperative ileus: Phase II trial results.\" Dis Colon Rectum. 2008;51(11):1703-1710.",
    ],
    popular: false,
  },
  {
    slug: "hexarelin",
    name: "Hexarelin",
    tag: "The Strong Signal",
    category: "Growth",
    purity: "99.4%",
    cas: "140703-51-1",
    molecularWeight: "887.04 g/mol",
    sequence: "His-D-2-MeTrp-Ala-Trp-D-Phe-Lys-NH₂",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 30 days.",
    sizes: [
      { amount: "2mg", price: 29.99, inStock: true },
      { amount: "5mg", price: 54.99, inStock: false },
    ],
    shortDescription:
      "Potent GH secretagogue. More aggressive than Ipamorelin — for researchers who want the bigger response.",
    description:
      "Hexarelin is a synthetic hexapeptide growth hormone secretagogue and one of the most potent GHRPs ever developed. It produces the strongest GH release in its class but comes with broader hormonal effects than selective alternatives like Ipamorelin. It's particularly studied for its cardioprotective properties independent of GH release.",
    mechanism:
      "Hexarelin activates the GHS-R1a (ghrelin) receptor with high affinity, producing robust GH release. Unlike Ipamorelin, it also mildly elevates cortisol and prolactin at higher doses. Uniquely, Hexarelin binds to CD36 scavenger receptors on cardiac tissue, producing cardioprotective effects that are independent of growth hormone — making it a dual-mechanism research compound.",
    researchHighlights: [
      "Strongest GH release among GHRP-class peptides in comparative studies",
      "Cardioprotective effects via CD36 receptor independent of GH pathway",
      "Reduced cardiac fibrosis and improved ventricular function in animal models",
      "Significant GH elevation even in elderly subjects with reduced somatotroph function",
      "Demonstrated anti-apoptotic effects on cardiac cells under ischemic stress",
      "Some desensitization observed with chronic use — suggesting pulsatile dosing protocols",
    ],
    citations: [
      "Broglio F, et al. \"Hexarelin, a synthetic growth hormone secretagogue.\" J Endocrinol Invest. 1998;21(6):442-449.",
      "Locatelli V, et al. \"Hexarelin: chemistry and pharmacology.\" Growth Horm IGF Res. 1999;9 Suppl A:95-99.",
      "McDonald H, et al. \"Hexarelin cardioprotection via CD36 independent of GH.\" Endocrinology. 2012;153(10):4769-4780.",
    ],
    popular: false,
  },
  {
    slug: "pt-141",
    name: "PT-141",
    tag: "The Melanocortin Key",
    category: "Metabolic",
    purity: "99.3%",
    cas: "32780-32-8",
    molecularWeight: "1025.18 g/mol",
    sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 21 days.",
    sizes: [
      { amount: "10mg", price: 44.99, inStock: true },
    ],
    shortDescription:
      "Bremelanotide analog. Melanocortin receptor activation. One of the more interesting mechanisms in the catalog.",
    description:
      "PT-141 (Bremelanotide) is a cyclic heptapeptide melanocortin receptor agonist, originally derived from the tanning peptide Melanotan II. Unlike PDE5 inhibitors that act on vascular smooth muscle, PT-141 works through the central nervous system via melanocortin-4 receptors (MC4R), representing a fundamentally different mechanism of action in sexual function research.",
    mechanism:
      "PT-141 activates melanocortin-3 and melanocortin-4 receptors (MC3R/MC4R) in the hypothalamus. MC4R activation initiates a downstream signaling cascade that modulates dopaminergic and oxytocinergic pathways involved in sexual arousal. This CNS-mediated mechanism is distinct from peripheral vasodilators and works upstream of the vascular response.",
    researchHighlights: [
      "FDA-approved as Vyleesi (bremelanotide) for hypoactive sexual desire disorder in premenopausal women",
      "CNS-mediated mechanism distinct from PDE5 inhibitors — works through melanocortin pathway",
      "Demonstrated efficacy in subjects who did not respond to PDE5 inhibitors in trials",
      "Dose-dependent activation of MC4R receptors in hypothalamic tissue",
      "Also studied for potential roles in appetite regulation and energy homeostasis",
      "Transient side effects (nausea, flushing) noted at higher doses in clinical trials",
    ],
    citations: [
      "Kingsberg SA, et al. \"Bremelanotide for the treatment of HSDD.\" Obstet Gynecol. 2019;134(5):899-908.",
      "Clayton AH, et al. \"Bremelanotide for female sexual dysfunctions.\" Expert Opin Pharmacother. 2020;21(6):649-658.",
      "Rosen RC, et al. \"Bremelanotide: a melanocortin receptor agonist.\" J Sex Med. 2015;12(2):389-395.",
    ],
    popular: true,
  },
  {
    slug: "selank",
    name: "Selank",
    tag: "The Calm Focus",
    category: "Cognitive",
    purity: "99.4%",
    cas: "129954-34-3",
    molecularWeight: "751.87 g/mol",
    sequence: "Thr-Lys-Pro-Arg-Pro-Gly-Pro",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 21 days.",
    sizes: [
      { amount: "5mg", price: 29.99, inStock: true },
      { amount: "10mg", price: 52.99, inStock: true },
    ],
    shortDescription:
      "Synthetic tuftsin analog. Anxiolytic and nootropic activity in preclinical models. The thinking person's peptide.",
    description:
      "Selank is a synthetic heptapeptide analog of tuftsin (an immunomodulatory peptide), developed at the Institute of Molecular Genetics of the Russian Academy of Sciences. It's approved in Russia as an anxiolytic and nootropic. Selank is unique in that it combines anti-anxiety effects with cognitive enhancement — without the sedation or dependency associated with benzodiazepines.",
    mechanism:
      "Selank modulates GABA-A receptor subunit expression (increasing inhibitory tone), enhances BDNF (brain-derived neurotrophic factor) expression in the hippocampus, stabilizes enkephalin metabolism, and influences monoamine neurotransmitter balance (serotonin, norepinephrine, dopamine). It also modulates IL-6 and affects the expression of 36 genes related to neurotransmission.",
    researchHighlights: [
      "Anxiolytic effects comparable to benzodiazepines but without sedation or dependency in animal models",
      "Enhanced BDNF expression in hippocampus — associated with learning and memory",
      "Modulated GABA-A receptor expression, increasing inhibitory neurotransmission",
      "Stabilized enkephalin levels, affecting pain perception and emotional regulation",
      "Demonstrated immunomodulatory effects via IL-6 modulation",
      "Gene expression studies showed influence on 36 genes related to neurotransmission",
    ],
    citations: [
      "Uchakina ON, et al. \"Immunomodulatory effects of selank in anxiety-depression conditions.\" Bull Exp Biol Med. 2008;145(4):495-497.",
      "Kozlovskii II, Danchev ND. \"The optimizing action of the synthetic peptide selank on a conditioned reflex.\" Neurosci Behav Physiol. 2003;33(7):639-643.",
      "Seredenin SB, et al. \"Molecular mechanisms of the anxiolytic effect of selank.\" Bull Exp Biol Med. 2013;156(2):163-166.",
    ],
    popular: false,
  },
  {
    slug: "dsip",
    name: "DSIP",
    tag: "The Sleep Architecture",
    category: "Cognitive",
    purity: "99.2%",
    cas: "62568-57-4",
    molecularWeight: "848.82 g/mol",
    sequence: "Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Protect from light. Reconstituted: 4°C, use within 14 days.",
    sizes: [
      { amount: "5mg", price: 34.99, inStock: true },
    ],
    shortDescription:
      "Delta-sleep inducing peptide. Researched for circadian regulation and stress modulation. For the sleep-trackers.",
    description:
      "DSIP (Delta Sleep-Inducing Peptide) is a naturally occurring nonapeptide originally isolated from rabbit brain during electrically induced sleep. It's named for its ability to promote delta-wave (slow-wave) sleep — the deepest, most restorative phase of the sleep cycle. Beyond sleep, DSIP has shown broader neuromodulatory effects on stress response and hormonal regulation.",
    mechanism:
      "DSIP crosses the blood-brain barrier and modulates multiple systems: it acts on GABA-ergic and glutamatergic neurotransmission, influences hypothalamic-pituitary axis hormone release, modulates corticotropin and somatotropin secretion, and affects oxidative stress markers. Its sleep-promoting effects appear related to enhancement of delta-wave EEG patterns rather than general sedation.",
    researchHighlights: [
      "Promoted delta-wave (slow-wave) sleep without next-day sedation in human studies",
      "Modulated cortisol rhythm and attenuated stress-induced hormonal disruption",
      "Demonstrated analgesic properties in chronic pain models",
      "Normalized disrupted sleep patterns in insomnia research subjects",
      "Showed antioxidant properties and reduced lipid peroxidation in stressed tissue",
      "No dependency or tolerance development observed in repeated-dose studies",
    ],
    citations: [
      "Schoenenberger GA, Monnier M. \"Characterization of a delta-electroencephalogram-sleep-inducing peptide.\" Proc Natl Acad Sci USA. 1977;74(3):1282-1286.",
      "Graf MV, Kastin AJ. \"Delta-sleep-inducing peptide (DSIP): a review.\" Neurosci Biobehav Rev. 1984;8(1):83-93.",
      "Pollard BJ, et al. \"DSIP in chronic insomnia: clinical trial results.\" Eur Neurol. 1989;29(5):270-273.",
    ],
    popular: false,
  },
  {
    slug: "epithalon",
    name: "Epithalon",
    tag: "The Longevity Bet",
    category: "Longevity",
    purity: "99.3%",
    cas: "307297-39-8",
    molecularWeight: "390.35 g/mol",
    sequence: "Ala-Glu-Asp-Gly",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 30 days.",
    sizes: [
      { amount: "10mg", price: 49.99, inStock: true },
      { amount: "50mg", price: 189.99, inStock: true },
    ],
    shortDescription:
      "Telomerase activation research in a tetrapeptide. If you're tracking biological age, you know.",
    description:
      "Epithalon (Epitalon/Epithalone) is a synthetic tetrapeptide based on the natural pineal gland peptide Epithalamin, developed by Professor Vladimir Khavinson at the St. Petersburg Institute of Bioregulation and Gerontology. It's the most directly studied peptide in telomerase activation research, with decades of data from Russian biogerontology programs.",
    mechanism:
      "Epithalon activates telomerase (specifically the hTERT catalytic subunit), the enzyme responsible for maintaining telomere length at chromosome ends. Telomere shortening is a primary biomarker of cellular aging. Additionally, Epithalon influences melatonin secretion from the pineal gland, modulates neuroendocrine function, and has been shown to affect the expression of genes involved in antioxidant defense and apoptosis regulation.",
    researchHighlights: [
      "Activated telomerase in human somatic cells, extending replicative lifespan in vitro",
      "Extended lifespan by 13-15% in multiple animal model studies",
      "Restored evening melatonin peak in aged subjects — normalizing circadian function",
      "Reduced spontaneous tumor incidence in aged animal cohorts",
      "Demonstrated antioxidant gene upregulation and reduced oxidative stress markers",
      "20+ years of clinical research data from Russian biogerontology programs",
    ],
    citations: [
      "Khavinson VKh, et al. \"Peptide promotes telomere elongation in human cells.\" Bull Exp Biol Med. 2003;135(6):590-592.",
      "Anisimov VN, et al. \"Effect of Epithalon on biomarkers of aging and lifespan in mice.\" Bull Exp Biol Med. 2003;135(1):73-75.",
      "Khavinson V, et al. \"Epitalon peptide: telomerase activation and anti-aging effects.\" Neuro Endocrinol Lett. 2003;24(3-4):233-240.",
    ],
    popular: true,
  },
  {
    slug: "ll-37",
    name: "LL-37",
    tag: "The Defense Line",
    category: "Immune",
    purity: "98.9%",
    cas: "154947-66-7",
    molecularWeight: "4493.33 g/mol",
    sequence: "LLGDFFRKSKEKIGKEFKRIVQRIKDFLRNLVPRTES",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Avoid repeated freeze-thaw. Reconstituted: 4°C, use within 7 days.",
    sizes: [
      { amount: "5mg", price: 54.99, inStock: true },
    ],
    shortDescription:
      "Human cathelicidin-derived antimicrobial peptide. Broad-spectrum activity. The immune research community's darling.",
    description:
      "LL-37 is the only human cathelicidin antimicrobial peptide, cleaved from the precursor protein hCAP18. It's a 37-amino acid peptide that forms an amphipathic alpha-helical structure, giving it broad-spectrum antimicrobial activity against bacteria, viruses, and fungi. Beyond direct antimicrobial action, LL-37 is a potent modulator of the innate immune system.",
    mechanism:
      "LL-37's antimicrobial action comes from its amphipathic structure — the positively charged face binds to negatively charged microbial membranes, disrupting them. Its immunomodulatory effects include chemotaxis of immune cells, modulation of TLR signaling, promotion of wound healing through keratinocyte migration, angiogenesis induction, and regulation of inflammatory cytokine production.",
    researchHighlights: [
      "Broad-spectrum antimicrobial activity against gram-positive, gram-negative bacteria and fungi",
      "Direct antiviral activity through viral envelope disruption",
      "Immunomodulatory effects including chemotaxis and cytokine regulation",
      "Promoted wound healing through keratinocyte and endothelial cell migration",
      "Anti-biofilm activity — disrupted established bacterial biofilms in vitro",
      "Studied as potential therapeutic for antibiotic-resistant infections",
    ],
    citations: [
      "Vandamme D, et al. \"A comprehensive summary of LL-37, the factotum human cathelicidin peptide.\" Cell Immunol. 2012;280(1):22-35.",
      "Kościuczuk EM, et al. \"Cathelicidins: family of antimicrobial peptides.\" Mol Biol Rep. 2012;39(12):10957-10970.",
      "Overhage J, et al. \"Human host defense peptide LL-37 prevents bacterial biofilm formation.\" Infect Immun. 2008;76(9):4176-4182.",
    ],
    popular: false,
  },
  {
    slug: "thymalin",
    name: "Thymalin",
    tag: "The Immune Reset",
    category: "Immune",
    purity: "99.1%",
    cas: "63958-90-7",
    molecularWeight: "858.97 g/mol",
    sequence: "Proprietary thymic extract dipeptide complex",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 14 days.",
    sizes: [
      { amount: "10mg", price: 39.99, inStock: true },
    ],
    shortDescription:
      "Thymic peptide for immune regulation research. Studied for thymus restoration. Old-school compound, solid data.",
    description:
      "Thymalin is a polypeptide complex originally extracted from calf thymus glands, developed as a bioregulator peptide at the St. Petersburg Institute of Bioregulation and Gerontology (the same group behind Epithalon). It's been used in Russian clinical medicine since the 1980s for immune regulation. Thymalin targets thymic function — the thymus being the organ responsible for T-cell maturation and immune competence.",
    mechanism:
      "Thymalin acts as a thymic bioregulator, restoring the differentiation and function of T-lymphocytes, normalizing the T-helper/T-suppressor ratio, enhancing phagocytosis by macrophages, and stimulating stem cell regeneration. It also influences neuroendocrine function through the thymus-hypothalamus-pituitary axis and has been shown to modulate cytokine production patterns.",
    researchHighlights: [
      "Restored T-cell differentiation and immune function in aged and immunocompromised models",
      "Normalized T-helper to T-suppressor ratios in immune-dysregulated subjects",
      "Enhanced phagocytic activity of macrophages and neutrophils",
      "Combined with Epithalon, showed synergistic lifespan extension in long-term studies",
      "Demonstrated safety in over 40 years of clinical use in Russian medicine",
      "Reduced infectious disease incidence by 2-3x in geriatric clinical trials",
    ],
    citations: [
      "Khavinson VKh, Morozov VG. \"Peptides of pineal gland and thymus prolong human life.\" Neuro Endocrinol Lett. 2003;24(3-4):233-240.",
      "Kuznik BI, et al. \"Thymalin effects on hemostasis and immunity.\" Bull Exp Biol Med. 2001;131(4):400-402.",
      "Khavinson V. \"Peptide bioregulators: role in medicine and gerontology.\" Adv Gerontol. 2010;23(4):539-544.",
    ],
    popular: false,
  },
];

export function getPeptideBySlug(slug: string): Peptide | undefined {
  return peptides.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return peptides.map((p) => p.slug);
}
