/**
 * CKF Phase 3 — Faults Part 2 (Mercedes-Benz, Toyota)
 * Run: node lib/seed-phase3-faults-part2.mjs
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
    // MERCEDES-BENZ W176 A-CLASS / W204 C-CLASS / W212 E-CLASS (OM651 Engine)
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("w204-c220-cdi"),
      title: "Delphi Piezo Injector Failure",
      slug: "mercedes-om651-delphi-injectors",
      summary: "Early OM651 engines (2008-2012) were fitted with Delphi piezoelectric injectors that failed so frequently it resulted in a massive global recall and class-action lawsuits.",
      symptoms: "- Sudden entry into limp home mode\n- Check Engine Light on\n- Car dropping to 3 cylinders\n- Smell of raw diesel\n- P0201 to P0204 fault codes",
      cause: "Internal electrical shorts inside the Delphi piezo injectors. The ECU detects the short and immediately shuts down the affected cylinder to prevent engine damage.",
      fix: "1. Check if the vehicle had the Mercedes-Benz factory recall performed.\n2. Mercedes replaced all four Delphi piezo injectors with more reliable Bosch solenoid injectors, which also required a new ECU and engine wiring harness.\n3. If it hasn't been done, the repair is extremely expensive (£2,000+).",
      severity: "critical",
      mileage_start: 30000, mileage_end: 100000,
      repair_cost_low: 0, repair_cost_high: 2500,
      diy_difficulty: "professional_only",
      affected_years: "2008-2012",
      obd_codes: ["P0201", "P0202", "P0203", "P0204"],
      published: true,
    },
    {
      variant_id: v("w212-e220-cdi"),
      title: "Timing Chain Stretch (Rear Mounted)",
      slug: "mercedes-om651-timing-chain",
      summary: "Like BMW's N47, Mercedes placed the OM651's timing chain at the rear of the engine. It is a single-row chain that stretches over time, causing a loud rattle on cold starts.",
      symptoms: "- Loud metallic rattle on cold start lasting 3-4 seconds\n- EML light with camshaft correlation faults\n- Rattle disappears when warm",
      cause: "The single-row simplex chain wears and stretches. The hydraulic tensioner takes a few seconds to build oil pressure on cold start, allowing the loose chain to rattle against the guides.",
      fix: "1. The engine MUST be removed to replace the timing chain.\n2. Mercedes later introduced an upgraded tensioner to mitigate the issue, but a stretched chain still requires full replacement.\n3. Change oil every 10k miles minimum to extend chain life.\n4. Cost: £1,200 - £2,000",
      severity: "critical",
      mileage_start: 100000, mileage_end: 200000,
      repair_cost_low: 1200, repair_cost_high: 2000,
      diy_difficulty: "professional_only",
      affected_years: "2009-2015",
      obd_codes: ["P0016"],
      published: true,
    },
    {
      variant_id: v("w176-a200d"),
      title: "Water Pump and Coolant Pipe Leak",
      slug: "mercedes-om651-water-pump",
      summary: "The OM651 engine uses a vacuum-actuated water pump that frequently leaks. The plastic coolant junction pipe above it also cracks with heat cycling.",
      symptoms: "- 'Top Up Coolant' warning on dashboard\n- Puddles of coolant under the front of the engine\n- Vacuum system faults if coolant enters the vacuum lines",
      cause: "The internal seal of the water pump fails. If the leak enters the vacuum actuator, it can suck coolant into the entire vacuum system of the car, destroying transducers.",
      fix: "1. Inspect the front of the engine (under the intake manifold) for pink/blue coolant crust.\n2. Replace water pump (£150 OEM part) and the plastic coolant pipe above it (£30 part).\n3. If vacuum lines are contaminated with coolant, they must be flushed out entirely.\n4. Cost fitted: £300-500",
      severity: "severe",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 300, repair_cost_high: 500,
      diy_difficulty: "moderate",
      affected_years: "2009-2018",
      obd_codes: [],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // TOYOTA AYGO Mk1 / AURIS Mk1 / RAV4 Mk3
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("aygo-mk1-10"),
      title: "Severe Water Ingress into Boot and Cabin",
      slug: "toyota-aygo-water-leaks",
      summary: "The Mk1 Toyota Aygo (and its siblings the Peugeot 107 / Citroen C1) are infamous for leaking water like a sieve into the boot and rear footwells.",
      symptoms: "- Spare wheel well fills up like a swimming pool\n- Condensation on the inside of the windows in winter\n- Damp, musty smell inside the car\n- Wet rear seatbelts",
      cause: "Multiple poor seal designs from the factory. The high-level brake light seal fails, the rear vent flaps behind the bumper fail, and the rear door seals shrink.",
      fix: "1. Remove rear bumper and seal the cabin vents with automotive silicone.\n2. Apply silicone sealant around the high-level brake light.\n3. Adjust the rear door striker plates to pull the doors tighter against the seals.\n4. Very cheap DIY fix, but annoying to trace all the leaks.",
      severity: "moderate",
      mileage_start: 10000, mileage_end: 150000,
      repair_cost_low: 10, repair_cost_high: 100,
      diy_difficulty: "easy",
      affected_years: "2005-2014",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("auris-mk1-16"),
      title: "MMT Actuator and Clutch Failure",
      slug: "toyota-auris-mmt-failure",
      summary: "The Multi-Mode Transmission (MMT) used on the Auris is an automated manual gearbox. It suffers from premature clutch wear and catastrophic electric actuator failure.",
      symptoms: "- Red 'cog' warning light on the dashboard\n- Car drops into Neutral while driving\n- Jerky, aggressive gear changes\n- Car refuses to engage gears from a standstill",
      cause: "The electric clutch actuator motor burns out from constantly slipping the clutch in urban driving. The physical clutch plate also wears out much faster than on a manual car.",
      fix: "1. Replace clutch actuator assembly (£600-800).\n2. Replace clutch and pressure plate (£400-600).\n3. Requires Toyota Techstream software to calibrate the new clutch bite point and actuator strokes.\n4. Total repair cost often writes off older vehicles.",
      severity: "critical",
      mileage_start: 50000, mileage_end: 90000,
      repair_cost_low: 800, repair_cost_high: 1500,
      diy_difficulty: "professional_only",
      affected_years: "2006-2012",
      obd_codes: ["P0810", "P0900"],
      published: true,
    },
    {
      variant_id: v("rav4-mk3-22-dcat"),
      title: "2.2 D-CAT Head Gasket and Carbon Blockage",
      slug: "toyota-rav4-dcat-head-gasket",
      summary: "The 2.2 D-CAT (Diesel Clean Advanced Technology) engine is perhaps Toyota's least reliable engine. It suffers from massive carbon buildup, 5th injector failure, and head gasket blow-outs.",
      symptoms: "- Coolant spraying out of the expansion tank overflow pipe\n- Severe overheating under load\n- DPF warning lights that refuse to clear\n- Excessive black and white smoke",
      cause: "A design flaw caused microscopic movement of the cylinder head on the block, scrubbing away the head gasket. Furthermore, the 5th injector (used to clear the DPF) clogs with carbon, causing the DPF to block and creating massive exhaust back-pressure.",
      fix: "1. Toyota replaced many engines under a goodwill extended warranty (7 years / 111k miles), but all have now expired.\n2. Head gasket replacement requires a modified block surface or an entirely new 3/4 engine block.\n3. The DPF and 5th injector must be replaced simultaneously.\n4. Repair costs often exceed £2,500, effectively writing off the car.",
      severity: "critical",
      mileage_start: 70000, mileage_end: 120000,
      repair_cost_low: 2000, repair_cost_high: 3500,
      diy_difficulty: "professional_only",
      affected_years: "2006-2012",
      obd_codes: ["P2002", "P2003"],
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

  console.log(`✅ Phase 3 Faults Part 2 complete. Inserted ${inserted} faults.`);
}

seed().catch(console.error);
