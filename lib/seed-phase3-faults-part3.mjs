/**
 * CKF Phase 3 — Faults Part 3 (Mazda, Volvo)
 * Run: node lib/seed-phase3-faults-part3.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const ws = require("ws");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false }, realtime: { transport: ws } }
);

async function upsertNoReturn(table, rows, conflict) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: conflict, ignoreDuplicates: true });
  if (error) throw new Error(`[${table}] ${error.message}`);
}

function bySlug(arr, slug) {
  const r = arr.find(x => x.slug === slug);
  if (!r) throw new Error(`Slug not found: "${slug}"`);
  return r;
}

const FAULTS = (variants) => {
  const v = slug => bySlug(variants, slug).id;
  return [
    // ══════════════════════════════════════════════════════════════════════════
    // MAZDA MAZDA3 1.6D / MAZDA6 2.2D / CX-5 2.2D
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("mazda3-mk2-16d"),
      title: "Turbo Oil Starvation and Failure",
      slug: "mazda3-16d-turbo-failure",
      summary: "The 1.6D engine (shared with PSA/Ford) has a serious design flaw where the oil feed pipe to the turbo blocks with carbon sludge, starving the turbo of oil and destroying it.",
      symptoms: "- Loud siren or whining noise under acceleration\n- Sudden loss of power\n- Excessive black smoke from exhaust\n- Oil weeping from the turbocharger housing",
      cause: "A tiny gauze filter inside the banjo bolt on the oil feed line gets blocked by carbon sludge. This stops oil reaching the turbo shaft bearings, causing them to overheat and snap.",
      fix: "1. Simply replacing the turbo is NOT enough — it will blow again within 50 miles.\n2. The oil sump must be removed and cleaned.\n3. The oil pickup pipe, oil feed pipe, and the banjo bolt (with the gauze removed) must be replaced.\n4. Replace turbo with a quality remanufactured unit.\n5. Total cost: £800 - £1,200",
      severity: "critical",
      mileage_start: 70000, mileage_end: 110000,
      repair_cost_low: 800, repair_cost_high: 1200,
      diy_difficulty: "professional_only",
      affected_years: "2009-2013",
      obd_codes: ["P0299"],
      published: true,
    },
    {
      variant_id: v("mazda6-mk2-22d"),
      title: "Oil Pickup Strainer Blockage and Engine Seizure",
      slug: "mazda6-22d-oil-pickup",
      summary: "A fatal flaw in the Mazda 2.2 MZR-CD engine. Injector seals leak, allowing carbon into the oil sump which blocks the oil pickup strainer. The engine then seizes from oil starvation.",
      symptoms: "- Red low oil pressure warning light flashes or stays on\n- Tapping or knocking noise from engine (often too late at this point)\n- EML light and limp mode",
      cause: "Copper seals at the base of the fuel injectors degrade. Exhaust combustion gases blow past the seals into the engine block, carrying soot. This soot drops into the oil sump, coagulates, and blocks the mesh strainer on the oil pump pickup.",
      fix: "1. PREVENTION: If you buy this car, immediately drop the sump, clean the strainer, and replace the injector copper seals (£300 job).\n2. If the oil light has already come on and the engine knocks, the engine is usually scrap due to spun crank bearings.\n3. Replacement engine cost: £2,000+",
      severity: "critical",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 300, repair_cost_high: 2500,
      diy_difficulty: "hard",
      affected_years: "2007-2012",
      obd_codes: ["P0524"],
      published: true,
    },
    {
      variant_id: v("cx5-mk1-22d"),
      title: "Exhaust Camshaft Wear and Vacuum Pump Failure",
      slug: "mazda-cx5-skyactiv-camshaft",
      summary: "Early SkyActiv-D 2.2 diesels have a soft exhaust camshaft that wears away prematurely. The metal shavings then destroy the vacuum pump and turbochargers.",
      symptoms: "- Poor braking performance (hard brake pedal due to vacuum loss)\n- Reduced engine power / limp mode\n- 'Vehicle System Inspection Required' warning message\n- Metallic particles visible in the oil filter",
      cause: "A manufacturing defect meant the exhaust camshaft lobes were not hardened correctly. As the lobes wear flat, the metal swarf circulates in the oil, first destroying the vacuum pump (which runs off the camshaft) and then the turbo bearings.",
      fix: "1. Mazda issued a TSB and replaced many under warranty, but many early cars were missed.\n2. Requires replacement of the exhaust camshaft, rocker arms, vacuum pump, and a complete engine flush.\n3. If the turbos are damaged by swarf, they must also be replaced.\n4. Repair cost: £1,500 - £3,000",
      severity: "critical",
      mileage_start: 40000, mileage_end: 90000,
      repair_cost_low: 1500, repair_cost_high: 3000,
      diy_difficulty: "professional_only",
      affected_years: "2012-2014",
      obd_codes: ["P0554", "P0524"],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // VOLVO V40 D2 / XC60 D5
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("v40-d2-16"),
      title: "Leaking Fuel Injector Seals",
      slug: "volvo-v40-d2-injector-seals",
      summary: "The Volvo D2 uses the PSA 1.6 HDi engine. The copper seals at the base of the injectors fail, allowing exhaust gases to escape. Often termed 'The Black Death'.",
      symptoms: "- Chuffing or ticking sound matching engine RPM (sounds like a steam train)\n- Strong smell of exhaust fumes in the cabin through the vents\n- Black, tar-like substance building up around the injectors under the engine cover",
      cause: "The copper washers at the base of the injectors loosen or degrade over time. Carbon-rich exhaust gases escape and bake around the injector body into a solid black tar.",
      fix: "1. Catch it early: remove the injector, clean the seat, and fit a new copper washer and guide seal.\n2. If left too long, the injector will be cemented into the cylinder head by the tar and may require specialist hydraulic pulling equipment to remove without breaking it.\n3. Cost: £150-300 if caught early, much more if injectors snap.",
      severity: "moderate",
      mileage_start: 60000, mileage_end: 100000,
      repair_cost_low: 150, repair_cost_high: 600,
      diy_difficulty: "hard",
      affected_years: "2012-2015",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("xc60-mk1-d5"),
      title: "Auxiliary Belt Tensioner Failure (Engine Destruction)",
      slug: "volvo-xc60-d5-aux-belt",
      summary: "A catastrophic design flaw on the 5-cylinder D5 engine. The auxiliary (alternator) belt tensioner fails, snapping the aux belt. The debris gets sucked into the timing belt, destroying the engine.",
      symptoms: "- Squealing noise from auxiliary belt area on startup\n- Battery warning light or heavy steering (if aux belt snaps)\n- Sudden and complete engine failure with bent valves",
      cause: "The tensioner for the auxiliary drive belt wears out prematurely. When the aux belt snaps or shreds, the design of the timing belt cover allows the shredded rubber strands to be pulled directly into the timing belt gears, causing the timing belt to jump.",
      fix: "1. PREVENTION: Replace the auxiliary belt AND tensioner every 60,000 miles (ignore the factory 108k interval).\n2. If the engine has failed, it requires a full cylinder head rebuild with new valves, or a replacement engine.\n3. Volvo eventually redesigned the belt guard to prevent this on later models.\n4. Prevention cost: £150. Failure cost: £2,000+",
      severity: "critical",
      mileage_start: 50000, mileage_end: 90000,
      repair_cost_low: 150, repair_cost_high: 2500,
      diy_difficulty: "professional_only",
      affected_years: "2008-2012",
      obd_codes: ["P0016"],
      published: true,
    }
  ];
};

async function seed() {
  console.log("Fetching variants...");
  const { data: variants, error: vError } = await supabase.from("variants").select("id, slug");
  if (vError) throw vError;

  const faultData = FAULTS(variants);
  console.log(`Prepared ${faultData.length} faults for insertion.`);

  let inserted = 0;
  for (const fault of faultData) {
    try {
      await upsertNoReturn("faults", fault, "slug");
      inserted++;
    } catch (err) {
      console.error(`Failed to insert ${fault.slug}:`, err.message);
    }
  }

  console.log(`✅ Phase 3 Faults Part 3 complete. Inserted ${inserted} faults.`);
}

seed().catch(console.error);
