/**
 * CKF Phase 3 — Faults Part 1 (Seat, Honda, Hyundai, Kia)
 * Run: node lib/seed-phase3-faults-part1.mjs
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
    // SEAT IBIZA 1.2 TSI
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("ibiza-mk4-12-tsi"),
      title: "Timing Chain Stretch and Rattle",
      slug: "seat-ibiza-12tsi-timing-chain",
      summary: "The early EA111 1.2 TSI engines suffer from significant timing chain stretch, causing an aggressive cold start rattle and potential engine failure.",
      symptoms: "- Loud metallic rattle on cold start lasting 3-5 seconds\n- EML warning light with camshaft correlation faults\n- Poor idle\n- Car dropping into limp mode",
      cause: "VW/Seat used a weak chain design from the factory. The hydraulic tensioner fails to maintain pressure overnight. The resulting chain slack allows the chain to stretch and eventually jump teeth.",
      fix: "1. Listen for the characteristic cold start rattle.\n2. Replace the timing chain kit with the revised thicker chain and tensioner from VAG.\n3. The engine does not need to be removed, but it's a specialist job.\n4. Cost: £500-800 at an independent specialist.",
      severity: "severe",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 500, repair_cost_high: 800,
      diy_difficulty: "professional_only",
      affected_years: "2010-2015",
      obd_codes: ["P0016", "P0017"],
      published: true,
    },
    {
      variant_id: v("ibiza-mk4-12-tsi"),
      title: "Turbo Actuator / Wastegate Failure",
      slug: "seat-ibiza-12tsi-turbo-actuator",
      summary: "The electronic turbo actuator on the 1.2 TSI fails frequently. It controls the wastegate but often seizes or burns out internally.",
      symptoms: "- EPC (Electronic Power Control) light illuminated\n- Loss of turbo boost (car feels very slow)\n- EML light with P334A or P334B codes\n- Actuator rod stuck fast when checked manually",
      cause: "The linkage from the actuator to the turbo wastegate seizes due to heat and corrosion. The electric motor inside the actuator then burns itself out trying to move the seized linkage.",
      fix: "1. The actuator can sometimes be replaced separately from the turbo.\n2. VAG sells an actuator repair kit.\n3. VCDS is required to adapt/calibrate the new actuator voltages to the ECU.\n4. If the wastegate flap inside the turbo is damaged, a full turbo is needed.\n5. Actuator fix cost: £250-400.",
      severity: "severe",
      mileage_start: 40000, mileage_end: 90000,
      repair_cost_low: 250, repair_cost_high: 400,
      diy_difficulty: "professional_only",
      affected_years: "2010-2015",
      obd_codes: ["P334A", "P334B"],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // HONDA CIVIC 2.2 i-CTDi
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("civic-mk8-22-cdti"),
      title: "Exhaust Manifold Cracking",
      slug: "honda-civic-22cdti-exhaust-manifold",
      summary: "A very well-known issue on Honda's 2.2 diesel. The steel exhaust manifold cracks, leaking toxic exhaust fumes directly into the cabin vents.",
      symptoms: "- Very strong smell of diesel exhaust fumes in the cabin\n- Hissing or ticking noise from the engine under load\n- Black soot around the turbo area on the bulkhead side",
      cause: "The factory exhaust manifold was made of thin pressed steel. The heat cycling from the turbocharger causes the metal to fatigue and crack along the welds.",
      fix: "1. Honda extended the warranty for this issue to 7 years/125,000 miles (which has now expired for all Mk8s).\n2. Replace the manifold with the revised cast-iron version.\n3. Requires removing the turbocharger to access. Very labour intensive.\n4. Cost fitted at an indie: £500-700",
      severity: "severe",
      mileage_start: 70000, mileage_end: 130000,
      repair_cost_low: 500, repair_cost_high: 700,
      diy_difficulty: "hard",
      affected_years: "2006-2009",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("civic-mk8-22-cdti"),
      title: "Premature Clutch Slipping",
      slug: "honda-civic-22cdti-clutch-slip",
      summary: "Despite being a brilliant engine, the clutch fitted to the 2.2 i-CTDi cannot handle the 340Nm of torque. It slips prematurely, especially in 4th, 5th, and 6th gears.",
      symptoms: "- Revs flare up when accelerating hard in high gears (e.g., motorway overtaking)\n- Car speed does not increase with engine RPM\n- Heavy clutch pedal",
      cause: "The original clutch friction plate and pressure plate combination was under-specced by Honda. Driving the car purely on the torque wave in high gears accelerates wear.",
      fix: "1. Replace clutch and Dual Mass Flywheel (DMF).\n2. Use a genuine LUK RepSet or an uprated Kevlar clutch from CG Motorsport if the car is remapped.\n3. The subframe must be dropped to remove the gearbox.\n4. Total cost: £700-1,000",
      severity: "severe",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 700, repair_cost_high: 1000,
      diy_difficulty: "professional_only",
      affected_years: "2006-2011",
      obd_codes: [],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // HYUNDAI ix35 / TUCSON 2.0 CRDi / 1.7 CRDi
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("ix35-20-crdi"),
      title: "Transfer Case Spline Failure (AWD models)",
      slug: "hyundai-ix35-awd-spline-failure",
      summary: "On AWD models of the ix35 and Sportage, the splines connecting the gearbox to the transfer case completely shear off, leaving the car as Front-Wheel Drive only.",
      symptoms: "- Sudden clunk or bang from underneath the car\n- Complete loss of rear-wheel drive (front wheels spin easily in mud/snow)\n- Grinding noise from the transfer case area",
      cause: "Lack of lubrication from the factory on the splined shaft. Moisture gets in, the splines rust, and the torque of the 2.0 diesel engine shears the rusted metal clean off.",
      fix: "1. Extremely expensive repair. The transfer case and the differential unit inside the gearbox must be replaced.\n2. Many owners simply remove the propshaft and drive it as a 2WD car.\n3. If repairing, the gearbox must be removed and stripped.\n4. Cost: £1,500 - £2,500",
      severity: "critical",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 1500, repair_cost_high: 2500,
      diy_difficulty: "professional_only",
      affected_years: "2010-2015",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("tucson-mk3-17-crdi"),
      title: "7-Speed DCT Dual Clutch Actuator Wear",
      slug: "hyundai-tucson-dct-actuator",
      summary: "Models fitted with the 7-speed dry Dual Clutch Transmission (DCT) suffer from extreme juddering when pulling away, caused by actuator failure.",
      symptoms: "- Severe shaking or juddering when pulling away in 1st gear or Reverse\n- Transmission warning message on dash\n- Overheating warning in heavy stop-start traffic",
      cause: "The dry clutches overheat easily in heavy traffic. The electric actuators that engage the clutches burn out or lose calibration.",
      fix: "1. First, try a software update and clutch recalibration via dealer diagnostics (£100).\n2. If it still judders, the dual clutch pack and actuators must be replaced.\n3. This is a highly specialised job requiring specific Hyundai shimming tools.\n4. Cost: £1,200 - £1,800",
      severity: "severe",
      mileage_start: 40000, mileage_end: 80000,
      repair_cost_low: 1200, repair_cost_high: 1800,
      diy_difficulty: "professional_only",
      affected_years: "2015-2021",
      obd_codes: [],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // KIA SPORTAGE 1.7 CRDi
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("sportage-mk3-17-crdi"),
      title: "Fuel Filter Housing Air Leak (Starting Issues)",
      slug: "kia-sportage-17crdi-fuel-filter",
      summary: "A very common starting issue on the 1.7 CRDi in cold weather. The engine turns over endlessly but refuses to fire due to air entering the fuel system.",
      symptoms: "- Engine cranks but won't start in cold weather\n- Might start after 5-6 attempts and run roughly for 30 seconds\n- No fault codes logged",
      cause: "The seals inside the fuel filter housing (located in the engine bay) shrink in cold weather, allowing air to be drawn into the fuel lines. The high-pressure pump then loses its prime.",
      fix: "1. Open the bonnet and repeatedly press the black rubber primer button on top of the fuel filter until it goes hard. If the car then starts, this confirms the fault.\n2. Replace the entire fuel filter housing assembly (not just the filter element).\n3. Modified OEM part is available from Kia.\n4. Cost: £150-250",
      severity: "moderate",
      mileage_start: 50000, mileage_end: 120000,
      repair_cost_low: 150, repair_cost_high: 250,
      diy_difficulty: "moderate",
      affected_years: "2010-2015",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("sportage-mk3-17-crdi"),
      title: "Turbo Lag and Sticking VNT Actuator",
      slug: "kia-sportage-17crdi-turbo-lag",
      summary: "Owners often complain of dangerous flat spots or severe turbo lag when pulling out of junctions. This is usually caused by a sticking turbo actuator.",
      symptoms: "- Very slow response when pressing the accelerator\n- Sudden surge of power at 2,500 RPM\n- EML light sometimes flashes on under load",
      cause: "Carbon build-up inside the turbocharger causes the Variable Nozzle Turbine (VNT) vanes to stick. The electronic actuator struggles to move them, delaying the boost.",
      fix: "1. Clean the EGR valve and intake first.\n2. If the turbo linkage is stiff, it requires a professional chemical clean (e.g., Terraclean) or removal of the turbo to clean the vanes manually.\n3. Check the vacuum hoses to the actuator for splits.\n4. Cost: £100-350",
      severity: "moderate",
      mileage_start: 60000, mileage_end: 110000,
      repair_cost_low: 100, repair_cost_high: 350,
      diy_difficulty: "hard",
      affected_years: "2010-2015",
      obd_codes: ["P0234"],
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

  console.log(`✅ Phase 3 Faults Part 1 complete. Inserted ${inserted} faults.`);
}

seed().catch(console.error);
