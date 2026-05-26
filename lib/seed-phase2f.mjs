/**
 * CKF Phase 2f — Final push to 200+ faults
 * Run: node lib/seed-phase2f.mjs
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
    // FOCUS MK2 1.8 TDCi
    {
      variant_id: v("mk2-18-tdci"),
      title: "Dual Mass Flywheel (DMF) Failure",
      slug: "focus-mk2-18tdci-dmf",
      summary: "The 1.8 TDCi produces strong low-end torque which destroys the internal springs of the Dual Mass Flywheel.",
      symptoms: "- Clattering noise at idle\n- Vibration through the clutch pedal\n- Difficult gear selection",
      cause: "Internal springs in the DMF weaken and shatter. Often exacerbated by driving in too high a gear at low RPM.",
      fix: "Replace DMF and clutch kit. Do not fit a solid flywheel conversion as it damages the gearbox input shaft. Cost: £600-800",
      severity: "severe",
      mileage_start: 70000, mileage_end: 120000,
      repair_cost_low: 600, repair_cost_high: 800,
      diy_difficulty: "professional_only",
      affected_years: "2004-2011",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("mk2-18-tdci"),
      title: "Alternator Smart Charge Failure",
      slug: "focus-mk2-18tdci-alternator",
      summary: "Ford's 'Smart Charge' alternators on the Mk2 Focus fail regularly, often taking the battery with them.",
      symptoms: "- Battery warning light\n- Dashboard acting crazily (lights flashing, dials dropping to zero)\n- Car stalls while driving",
      cause: "The internal voltage regulator fails. Sometimes the 3-pin Smart Charge plug wiring breaks near the alternator.",
      fix: "Check the 3-pin wiring plug first. If broken, repair wiring (£20). If alternator is dead, replace with a high-quality OEM unit (Denso). Cost: £200-350",
      severity: "critical",
      mileage_start: 60000, mileage_end: 110000,
      repair_cost_low: 20, repair_cost_high: 350,
      diy_difficulty: "moderate",
      affected_years: "2004-2011",
      obd_codes: ["P1632", "P0620"],
      published: true,
    },
    {
      variant_id: v("mk2-18-tdci"),
      title: "Injector Failure (Siemens VDO)",
      slug: "focus-mk2-18tdci-injectors",
      summary: "The Siemens VDO injectors used on the 1.8 TDCi are highly prone to electrical failure, dropping the car to 3 cylinders.",
      symptoms: "- Sudden loss of power\n- Engine runs extremely rough\n- Coil light flashing\n- Fault codes P0201-P0204",
      cause: "Internal piezo crystal breakdown inside the injector head.",
      fix: "Replace faulty injector. Reconditioned Siemens injectors are available but new is recommended. Must be coded to ECU. Cost: £250-400 per injector.",
      severity: "severe",
      mileage_start: 80000, mileage_end: 140000,
      repair_cost_low: 250, repair_cost_high: 400,
      diy_difficulty: "professional_only",
      affected_years: "2004-2011",
      obd_codes: ["P0201", "P0202", "P0203", "P0204"],
      published: true,
    },
    {
      variant_id: v("mk2-18-tdci"),
      title: "Instrument Cluster Solder Joint Failure",
      slug: "focus-mk2-instrument-cluster",
      summary: "The solder joints on the back of the instrument cluster circuit board crack, causing complete immobilisation of the car.",
      symptoms: "- 'Engine Systems Fault' message\n- Car refuses to crank or start\n- Dials drop to zero while driving\n- Hitting the top of the dashboard temporarily fixes it",
      cause: "Lead-free solder used during manufacturing becomes brittle. The connector pins on the back of the dash crack their solder joints.",
      fix: "Remove instrument cluster (2 screws). Send to a specialist for re-soldering (£80-100). Do not buy a used dash as it requires immobiliser recoding. Cost: £100",
      severity: "critical",
      mileage_start: 50000, mileage_end: 150000,
      repair_cost_low: 80, repair_cost_high: 150,
      diy_difficulty: "moderate",
      affected_years: "2004-2011",
      obd_codes: ["U1900"],
      published: true,
    },

    // FOCUS MK3 2.0 TDCi
    {
      variant_id: v("mk3-20-tdci"),
      title: "Powershift Dual Clutch Gearbox Failure",
      slug: "focus-mk3-powershift",
      summary: "The 6-speed Powershift (MPS6/6DCT450) automatic gearbox is notoriously fragile. Internal plastic parts shatter, clogging the transmission filter.",
      symptoms: "- Transmission Malfunction warning on dash\n- Severe shuddering when pulling away\n- Loss of odd or even gears\n- Slipping clutch feel",
      cause: "The plastic spring retainers on the internal dampener break apart. The plastic fragments block the internal oil filter, destroying oil pressure to the mechatronic unit.",
      fix: "Requires full gearbox rebuild and replacement of the dampener assembly with upgraded metal spring retainers. Fluid MUST be changed every 37,500 miles. Cost: £1,800-£2,500",
      severity: "critical",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 1800, repair_cost_high: 2500,
      diy_difficulty: "professional_only",
      affected_years: "2011-2015",
      obd_codes: ["P0766", "P0771"],
      published: true,
    },
    {
      variant_id: v("mk3-20-tdci"),
      title: "DPF Vaporiser Failure",
      slug: "focus-mk3-20tdci-vaporiser",
      summary: "Ford uses a 5th injector (vaporiser) in the exhaust to regenerate the DPF. This vaporiser clogs with soot, preventing regeneration.",
      symptoms: "- Engine Management Light\n- DPF Blocked warning\n- Fault code P24A4 or P244C (Exhaust temperature too low for DPF regeneration)",
      cause: "Soot blocks the tiny nozzle of the vaporiser, or its internal glow plug burns out.",
      fix: "Replace the DPF vaporiser unit (£150 part). Clear fault codes and force a static regeneration. Cost: £250-350 fitted.",
      severity: "moderate",
      mileage_start: 60000, mileage_end: 110000,
      repair_cost_low: 250, repair_cost_high: 350,
      diy_difficulty: "moderate",
      affected_years: "2011-2018",
      obd_codes: ["P24A4", "P244C"],
      published: true,
    },
    {
      variant_id: v("mk3-20-tdci"),
      title: "Steering Rack Motor Failure (EPS)",
      slug: "focus-mk3-eps-rack",
      summary: "The Electronic Power Steering rack on the Mk3 Focus suffers from water ingress, causing the motor to short out.",
      symptoms: "- Complete loss of power steering (very heavy steering)\n- 'Steering Assist Malfunction' warning\n- U3000 fault code",
      cause: "Water runs down the steering column or past the track rod boots, entering the EPS motor housing on the rack.",
      fix: "The entire steering rack must be replaced. Requires coding to the car's PATS/immobiliser system. Cost: £800-1,200",
      severity: "critical",
      mileage_start: 50000, mileage_end: 120000,
      repair_cost_low: 800, repair_cost_high: 1200,
      diy_difficulty: "professional_only",
      affected_years: "2011-2018",
      obd_codes: ["U3000"],
      published: true,
    },

    // CORSA D 1.3 CDTi
    {
      variant_id: v("corsa-d-13-cdti"),
      title: "EGR Valve Seized Open",
      slug: "corsa-d-13cdti-egr",
      summary: "The EGR valve on the 1.3 CDTi clogs rapidly, usually jamming open and causing terrible starting and idling.",
      symptoms: "- Car struggles to start or won't start at all\n- Excessive black smoke when it does start\n- EML illuminated\n- Zero power below 2,000 RPM",
      cause: "Soot and oil vapor from city driving jams the mechanical flap inside the EGR valve.",
      fix: "Remove and clean EGR valve. If the electrical solenoid is burnt out from fighting the jammed flap, replace the unit (£80-120 part). Cost fitted: £150-250.",
      severity: "moderate",
      mileage_start: 40000, mileage_end: 90000,
      repair_cost_low: 150, repair_cost_high: 250,
      diy_difficulty: "moderate",
      affected_years: "2006-2014",
      obd_codes: ["P0400"],
      published: true,
    },
    {
      variant_id: v("corsa-d-13-cdti"),
      title: "Timing Chain Snapping",
      slug: "corsa-d-13cdti-timing-chain",
      summary: "The 1.3 CDTi engine uses a weak single-row timing chain. It stretches and snaps without much warning if oil changes are missed.",
      symptoms: "- Rattling noise from engine bay on cold start\n- Engine stops suddenly while driving\n- Car won't restart, engine turns over very quickly (loss of compression)",
      cause: "Infrequent oil changes block the small oil feed hole to the hydraulic chain tensioner. The chain runs slack, jumps a tooth, and snaps.",
      fix: "Preventative: Replace chain every 70,000 miles (£400). If it snaps: The rocker arms are designed to break to save the valves, but the cylinder head must come off to replace them. Cost if snapped: £800-1,200.",
      severity: "critical",
      mileage_start: 60000, mileage_end: 100000,
      repair_cost_low: 400, repair_cost_high: 1200,
      diy_difficulty: "professional_only",
      affected_years: "2006-2014",
      obd_codes: ["P0340"],
      published: true,
    },
    {
      variant_id: v("corsa-d-13-cdti"),
      title: "Glow Plug Snapping in Cylinder Head",
      slug: "corsa-d-13cdti-glow-plugs",
      summary: "While replacing blown glow plugs is normal maintenance, on the 1.3 CDTi they are notoriously long, thin, and seize into the cylinder head.",
      symptoms: "- Spanner light on dashboard shortly after starting\n- Rough idle for first 30 seconds when cold\n- P0683 or P0380 glow plug codes",
      cause: "Carbon builds up around the tip of the glow plug inside the cylinder. When a mechanic tries to unscrew it, the tip snaps off inside the engine.",
      fix: "Soak plugs in penetrating oil for 3 days before attempting removal. Use a torque wrench in reverse (max 20Nm). If snapped, a specialist extraction service is required (£150-300).",
      severity: "moderate",
      mileage_start: 60000, mileage_end: 100000,
      repair_cost_low: 60, repair_cost_high: 300,
      diy_difficulty: "hard",
      affected_years: "2006-2014",
      obd_codes: ["P0683", "P0380"],
      published: true,
    },

    // ASTRA J 1.6 CDTi (Whisper Diesel)
    {
      variant_id: v("astra-j-16-cdti"),
      title: "Timing Chain Rattle (Rear Mounted)",
      slug: "astra-j-16cdti-timing-chain",
      summary: "The 'Whisper Diesel' 1.6 CDTi has its timing chain mounted at the rear of the engine (gearbox side). It stretches and rattles terribly.",
      symptoms: "- Loud metallic rattle on cold start lasting 3-5 seconds\n- Continuous rattle at idle when engine is hot\n- EML for camshaft timing",
      cause: "The hydraulic chain tensioner gasket design is flawed, allowing oil pressure to bleed away overnight. The chain stretches due to running without tension on startup.",
      fix: "Engine MUST be removed (or gearbox removed) to access the chain. Vauxhall released a revised tensioner gasket. Huge labour cost. Cost: £1,200-£1,800",
      severity: "critical",
      mileage_start: 70000, mileage_end: 120000,
      repair_cost_low: 1200, repair_cost_high: 1800,
      diy_difficulty: "professional_only",
      affected_years: "2013-2018",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("astra-j-16-cdti"),
      title: "Clutch Pedal Sticking Down",
      slug: "astra-j-16cdti-clutch-pedal",
      summary: "The clutch pedal fails to return to the top of its travel, often getting stuck halfway or hitting the floor completely.",
      symptoms: "- Clutch pedal stays on the floor\n- Difficulty selecting gears\n- Have to manually hook your foot under the pedal to pull it back up",
      cause: "Failure of the internal seals inside the clutch master cylinder (behind the pedal) or the concentric slave cylinder (inside the gearbox).",
      fix: "Check master cylinder first (cheaper, £150 fitted). If it's the slave cylinder, the gearbox must be removed to replace it (£500-700 fitted).",
      severity: "severe",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 150, repair_cost_high: 700,
      diy_difficulty: "professional_only",
      affected_years: "2009-2015",
      obd_codes: [],
      published: true,
    },

    // CORSA D 1.2 85bhp
    {
      variant_id: v("corsa-d-12-85"),
      title: "Heater Blower Resistor Failure",
      slug: "corsa-d-12-heater-resistor",
      summary: "The interior heater blower motor only works on speed setting 4. Settings 1, 2, and 3 are completely dead.",
      symptoms: "- No air from vents unless turned to max speed\n- Smell of burning plastic from glovebox area",
      cause: "Water ingress from the scuttle panel drips onto the blower motor, increasing resistance. This burns out the thermal fuse on the heater resistor pack.",
      fix: "Replace the heater resistor pack (located behind the glovebox, £20 part). Check the pollen filter is dry and clear scuttle drains. Cost: £20-50 DIY.",
      severity: "minor",
      mileage_start: 30000, mileage_end: 90000,
      repair_cost_low: 20, repair_cost_high: 50,
      diy_difficulty: "easy",
      affected_years: "2006-2014",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("corsa-d-12-85"),
      title: "Oil Pressure Switch Leak",
      slug: "corsa-d-12-oil-switch",
      summary: "The oil pressure switch frequently fails internally, leaking engine oil directly into the electrical wiring loom.",
      symptoms: "- Oil pooling around the front right side of the engine\n- Oil pressure light flickering\n- If ignored, oil travels up the wiring loom into the ECU via capillary action, destroying the ECU.",
      cause: "The plastic body of the oil pressure switch cracks under heat.",
      fix: "Inspect oil pressure switch. If oily, unplug it and check the connector. If oil is inside the plug, replace switch immediately (£10) and clean the loom with contact cleaner. Cost: £10-50",
      severity: "moderate",
      mileage_start: 40000, mileage_end: 80000,
      repair_cost_low: 10, repair_cost_high: 50,
      diy_difficulty: "easy",
      affected_years: "2006-2014",
      obd_codes: [],
      published: true,
    },

    // FIESTA MK6 1.25
    {
      variant_id: v("mk6-125-82"),
      title: "Ignition Coil Pack Failure",
      slug: "fiesta-mk6-125-coil-pack",
      summary: "The single coil pack block fails, causing a 2-cylinder misfire.",
      symptoms: "- EML flashing\n- Huge loss of power\n- Sounds like a tractor",
      cause: "Internal coil breakdown.",
      fix: "Replace coil block, HT leads, and spark plugs as a set. Very easy DIY. Cost: £80-120",
      severity: "moderate",
      mileage_start: 40000, mileage_end: 90000,
      repair_cost_low: 80, repair_cost_high: 120,
      diy_difficulty: "easy",
      affected_years: "2002-2008",
      obd_codes: ["P0300"],
      published: true,
    },
    {
      variant_id: v("mk6-125-82"),
      title: "Water Ingress into Spark Plug Wells",
      slug: "fiesta-mk6-125-core-plugs",
      summary: "The core plugs (freeze plugs) between the spark plugs rust, leaking coolant into the spark plug wells.",
      symptoms: "- Misfire\n- Spark plugs submerged in rusty water\n- Coolant loss",
      cause: "Steel core plugs rust through. Often exacerbated by mechanics power-washing the engine bay.",
      fix: "Extract rusted core plugs and tap in new brass core plugs. Clean out spark plug wells. Cost: £100-200",
      severity: "moderate",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 100, repair_cost_high: 200,
      diy_difficulty: "moderate",
      affected_years: "2002-2008",
      obd_codes: [],
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

  console.log(`✅ Phase 2f complete. Inserted ${inserted} faults.`);
}

seed().catch(console.error);
