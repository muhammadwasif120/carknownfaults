/**
 * CKF Phase 2b — BMW, VW, Mini, Nissan fault depth expansion
 * Run: node lib/seed-phase2b.mjs
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
    // BMW E90 320d N47 — 4 additional faults (oil consumption, DPF, thermostat, injectors)
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("e90-320d-n47"),
      title: "Excessive Oil Consumption / PCV Valve Failure",
      slug: "bmw-e90-n47-oil-consumption",
      summary: "The N47 engine can consume significant amounts of oil due to a blocked Positive Crankcase Ventilation (PCV) breather, forcing oil past the turbo seals or piston rings.",
      symptoms: "- Oil top-up warning light every 1,000 miles\n- Blue smoke on acceleration\n- Oil pooling in the intercooler and intake pipes\n- Rough idle",
      cause: "The PCV breather unit separates oil mist from crankcase gases. When it blocks, crankcase pressure rises, forcing oil out through the path of least resistance (usually turbo seals or rings).",
      fix: "1. Check PCV valve assembly integrated into the rocker cover\n2. Replace PCV breather unit (£50-80 parts)\n3. Check intercooler for oil pooling and drain if necessary\n4. If consumption persists, turbocharger seals may have failed",
      severity: "moderate",
      mileage_start: 70000, mileage_end: 140000,
      repair_cost_low: 150, repair_cost_high: 400,
      diy_difficulty: "moderate",
      affected_years: "2007-2012",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("e90-320d-n47"),
      title: "EGR Thermostat Failure preventing DPF Regeneration",
      slug: "bmw-e90-n47-thermostat-dpf",
      summary: "The E90 320d has two thermostats (main and EGR). When either fails open, the engine never reaches the 88°C required for DPF regeneration, leading to inevitable DPF blockage.",
      symptoms: "- Hidden menu shows coolant temp hovering around 60-70°C\n- DPF warning light on dash\n- Reduced fuel economy\n- No traditional dashboard temperature gauge makes this hard to spot",
      cause: "Thermostat springs weaken over time, failing in the open position. Because the E90 has no temperature gauge on the dash, owners rarely notice until the DPF blocks from lack of regeneration.",
      fix: "1. Access hidden OBC menu to view actual coolant temperature while driving\n2. If below 88°C, replace both main and EGR thermostats\n3. After replacement, force DPF regeneration via OBD tool\n4. Cost for both thermostats: £100 parts, £250-400 fitted",
      severity: "severe",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 250, repair_cost_high: 400,
      diy_difficulty: "hard",
      affected_years: "2007-2012",
      obd_codes: ["P2452", "480A", "481A"],
      published: true,
    },
    {
      variant_id: v("e90-320d-n47"),
      title: "Diesel Particulate Filter (DPF) Blockage",
      slug: "bmw-e90-n47-dpf-blockage",
      summary: "A blocked DPF on the N47 is highly common, often a secondary symptom of thermostat failure, glow plug module failure, or exclusively urban driving.",
      symptoms: "- CC-ID 71 or DPF warning symbol on iDrive\n- Sluggish acceleration and limp mode\n- Whistling noise from turbo (excess backpressure)\n- Fault codes 480A and 481A",
      cause: "Soot accumulation exceeds the DPF's capacity. Active regeneration is blocked if coolant temperature is too low, glow plug controller is faulty, or fuel level is below 1/4 tank.",
      fix: "1. Address root cause first (thermostats or glow plug module)\n2. Attempt forced regeneration via Carly or ISTA\n3. Professional chemical clean (£250-350)\n4. Replacement DPF if cracked or melted internally (£800-1,500)",
      severity: "severe",
      mileage_start: 80000, mileage_end: 150000,
      repair_cost_low: 250, repair_cost_high: 1500,
      diy_difficulty: "professional_only",
      affected_years: "2007-2012",
      obd_codes: ["480A", "481A"],
      published: true,
    },
    {
      variant_id: v("e90-320d-n47"),
      title: "Piezo Injector Failure",
      slug: "bmw-e90-n47-piezo-injector",
      summary: "The N47 relies on Bosch piezoelectric injectors. These wear internally, causing over-fuelling, rough idling, and potentially piston damage if they stick open.",
      symptoms: "- Rough, shaky idle especially when cold\n- Strong smell of unburnt diesel from exhaust\n- Increased fuel consumption\n- Engine vibration under light load",
      cause: "Internal wear of the injector nozzle and control valve. Contaminated diesel accelerates wear. The piezoelectric crystals can also degrade electrically.",
      fix: "1. Run smooth running balance test via diagnostics\n2. Perform leak-off test to confirm faulty injectors\n3. Replace faulty injectors (Bosch remanufactured recommended)\n4. New injectors MUST be coded (IMA code) to the DDE/ECU\n5. Cost: £250-350 per injector fitted",
      severity: "severe",
      mileage_start: 90000, mileage_end: 160000,
      repair_cost_low: 300, repair_cost_high: 1200,
      diy_difficulty: "professional_only",
      affected_years: "2007-2012",
      obd_codes: ["4B10", "4B11"],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // VW GOLF MK5 2.0 TDI (PD) — 5 additional faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("mk5-20-tdi-140"),
      title: "Turbocharger Failure (VNT Sticking)",
      slug: "vw-golf-mk5-tdi-turbo-vnt",
      summary: "The Variable Nozzle Turbine (VNT) mechanism in the Golf Mk5 turbocharger is prone to sticking with carbon soot, causing overboost conditions and limp mode.",
      symptoms: "- Sudden loss of power (limp mode) during hard acceleration or climbing hills\n- Power returns to normal after restarting the engine\n- P0234 Overboost fault code\n- Whistling noise from turbo",
      cause: "Carbon from the exhaust builds up on the variable vanes inside the turbo. When accelerating, the ECU commands the vanes to move, but they stick, causing the turbo to produce too much boost. The ECU detects this and cuts fuel to protect the engine.",
      fix: "1. Confirm VNT actuator arm is stiff or seized by moving it manually\n2. 'Mr Muscle' oven cleaner trick: inject into exhaust side to dissolve carbon (DIY fix, temporary)\n3. Professional turbo removal and chemical clean\n4. Turbo replacement if bearings are worn (£500-900)",
      severity: "severe",
      mileage_start: 80000, mileage_end: 150000,
      repair_cost_low: 150, repair_cost_high: 900,
      diy_difficulty: "hard",
      affected_years: "2004-2009",
      obd_codes: ["P0234"],
      published: true,
    },
    {
      variant_id: v("mk5-20-tdi-140"),
      title: "Gearbox Dogbone Mount Bush Failure",
      slug: "vw-golf-mk5-tdi-dogbone-mount",
      summary: "The lower engine pendulum mount (often called the dogbone mount) bushes perish, causing excessive engine movement, clunking, and sloppy gear changes.",
      symptoms: "- Clunking noise from front subframe area when lifting off the throttle\n- Jerky gear changes\n- Wheel hop during hard acceleration\n- Vibration through cabin at idle",
      cause: "The heavy diesel engine produces significant torque. The rubber bushes in the lower mount deteriorate, crack, and tear over thousands of miles of torque transfer.",
      fix: "1. Inspect lower mount visually — look for cracked or missing rubber\n2. Replace the dogbone mount assembly or press in a polyurethane insert\n3. Poly inserts (£25) firm up the shifts but add cabin vibration\n4. OEM replacement mount: £50 parts, £120 fitted",
      severity: "minor",
      mileage_start: 70000, mileage_end: 140000,
      repair_cost_low: 50, repair_cost_high: 150,
      diy_difficulty: "easy",
      affected_years: "2004-2009",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("mk5-20-tdi-140"),
      title: "Water Pump and Timing Belt Failure",
      slug: "vw-golf-mk5-tdi-water-pump",
      summary: "The water pump on the 2.0 TDI is driven by the timing belt. If the pump fails or seizes, it destroys the timing belt, leading to catastrophic engine damage.",
      symptoms: "- Coolant leak from timing belt area\n- Engine overheating\n- Squealing bearing noise from timing cover\n- In failure: total loss of compression, bent valves",
      cause: "The plastic impeller on OEM water pumps can crack and spin freely on the shaft, or the pump bearing can seize. VW recommends changing the belt and pump every 4 years or 60,000 miles.",
      fix: "1. Never skip timing belt intervals\n2. ALWAYS replace the water pump and tensioners when doing the timing belt\n3. Upgraded water pumps with metal impellers are highly recommended\n4. Routine belt + pump change: £350-500. Engine rebuild if it snaps: £1,500+",
      severity: "critical",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 350, repair_cost_high: 1500,
      diy_difficulty: "professional_only",
      affected_years: "2004-2009",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("mk5-20-tdi-140"),
      title: "PD Injector Wiring Loom Degradation",
      slug: "vw-golf-mk5-tdi-injector-loom",
      summary: "The wiring loom that connects the PD injectors sits inside the cylinder head, submerged in hot engine oil. The insulation degrades, causing misfires and injector faults.",
      symptoms: "- Sudden severe misfire or stuttering under load\n- Car dropping to 3 cylinders\n- EML flashing\n- Fault codes for injector circuit malfunction (P0201-P0204 or P1666)",
      cause: "Heat and engine oil cause the wiring loom insulation to become brittle. Resistance increases at the injector spade connectors, causing intermittent electrical faults.",
      fix: "1. Don't immediately assume the expensive injector has failed\n2. Remove rocker cover\n3. Unplug and gently crimp the injector spade connectors tighter (temporary fix)\n4. Replace the internal injector wiring loom (VW Part ~£70)\n5. Total cost at indie: £150-250",
      severity: "moderate",
      mileage_start: 90000, mileage_end: 160000,
      repair_cost_low: 150, repair_cost_high: 250,
      diy_difficulty: "moderate",
      affected_years: "2004-2009",
      obd_codes: ["P0201", "P1666"],
      published: true,
    },
    {
      variant_id: v("mk5-20-tdi-140"),
      title: "Tandem Pump Fuel/Oil Leak",
      slug: "vw-golf-mk5-tdi-tandem-pump",
      summary: "The tandem pump (which provides vacuum for brakes and fuel pressure for injectors) is prone to leaking. It can leak diesel externally, or worse, leak diesel internally into the engine oil.",
      symptoms: "- Smell of diesel in the cabin\n- Rising engine oil level on dipstick\n- Hard starting after sitting overnight\n- Poor braking performance (hard pedal due to vacuum leak)",
      cause: "The seals inside the tandem pump fail. External leaks drip onto the coolant hoses below, destroying the rubber. Internal leaks dilute the engine oil, leading to major bearing damage if ignored.",
      fix: "1. Inspect pump (right side of cylinder head) for wet diesel\n2. Check coolant hoses below for swelling\n3. Repair kits (gaskets) available for £30, but replacement pump often better (£150-250)\n4. MUST change engine oil if internal leak suspected\n5. Total fitted cost: £250-400",
      severity: "severe",
      mileage_start: 80000, mileage_end: 140000,
      repair_cost_low: 250, repair_cost_high: 400,
      diy_difficulty: "moderate",
      affected_years: "2004-2009",
      obd_codes: [],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // MINI HATCH R56 1.6T (N14) — 4 additional faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("r56-cooper-s-16t"),
      title: "High Pressure Fuel Pump (HPFP) Failure",
      slug: "mini-r56-hpfp-failure",
      summary: "The High Pressure Fuel Pump on the N14 engine fails frequently. It is one of the most well-known and expensive failures on the R56 Cooper S.",
      symptoms: "- Long cranking times when cold\n- Misfiring and hesitation under load\n- Half-engine check light on dash\n- Car goes into limp mode\n- P0087 (Fuel Rail/System Pressure - Too Low)",
      cause: "Internal seals and mechanical wear within the pump. BMW redesigned the pump multiple times, but early R56 models suffer almost universally.",
      fix: "1. Confirm low rail pressure via live diagnostic data\n2. Replace High Pressure Fuel Pump (Genuine PSA/MINI part required, cheap copies fail quickly)\n3. Parts cost is high (£400-800)\n4. Labour is approx 1.5 hours\n5. Total indie cost: £600-900",
      severity: "severe",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 600, repair_cost_high: 900,
      diy_difficulty: "hard",
      affected_years: "2006-2010",
      obd_codes: ["P0087", "2880"],
      published: true,
    },
    {
      variant_id: v("r56-cooper-s-16t"),
      title: "Thermostat Housing Leak and Failure",
      slug: "mini-r56-thermostat-housing",
      summary: "The plastic thermostat housing on the R56 warps and cracks, causing coolant leaks. The integrated temperature sensor also fails, causing erratic fan behaviour.",
      symptoms: "- Coolant pooling on top of the gearbox casing\n- Sweet smell of coolant after driving\n- Radiator fan stays on maximum speed long after parking\n- Overheating warning\n- P0128 fault code",
      cause: "Thermal cycling weakens the plastic housing. The glued seams eventually separate. The integrated sensor fails internally, causing the ECU to panic and run the fan constantly.",
      fix: "1. Check for crusty coolant residue on gearbox below the housing\n2. Replace thermostat housing as a complete unit (£60-120 part)\n3. Requires draining and vacuum-bleeding the cooling system (system is notoriously hard to bleed)\n4. Fitted cost: £200-350",
      severity: "moderate",
      mileage_start: 40000, mileage_end: 90000,
      repair_cost_low: 200, repair_cost_high: 350,
      diy_difficulty: "moderate",
      affected_years: "2006-2013",
      obd_codes: ["P0128"],
      published: true,
    },
    {
      variant_id: v("r56-cooper-s-16t"),
      title: "Carbon Build-up on Intake Valves",
      slug: "mini-r56-carbon-buildup",
      summary: "Because the N14 is a direct-injection engine, fuel does not wash over the intake valves. Oil vapor from the PCV system bakes onto the hot valves, causing severe carbon build-up.",
      symptoms: "- Rough, unstable idle on cold start\n- Loss of top-end power\n- P0300 Random Misfire codes\n- Hesitation when pulling away",
      cause: "Direct injection design combined with an aggressive PCV system. Carbon slowly chokes the intake ports, disrupting airflow into the cylinders.",
      fix: "1. Walnut blasting is required. The intake manifold is removed and crushed walnut shells are blasted at the valves to clean them safely.\n2. Chemical cleaners poured into the intake are largely ineffective for severe buildup.\n3. Should be considered routine maintenance every 40k-50k miles.\n4. Walnut blast cost: £200-350 at a specialist",
      severity: "moderate",
      mileage_start: 40000, mileage_end: 80000,
      repair_cost_low: 200, repair_cost_high: 350,
      diy_difficulty: "professional_only",
      affected_years: "2006-2010",
      obd_codes: ["P0300", "P0301", "P0302"],
      published: true,
    },
    {
      variant_id: v("r56-cooper-s-16t"),
      title: "Turbo Oil Feed Pipe Leak",
      slug: "mini-r56-turbo-oil-pipe",
      summary: "The oil feed line to the turbocharger runs directly over the exhaust manifold. The extreme heat cooks the rubber O-rings in the banjo fittings, causing dangerous oil leaks.",
      symptoms: "- Smell of burning oil through cabin vents\n- Smoke rising from under the bonnet scoop\n- Oil pooling on top of the turbo heat shield\n- Rapid drop in engine oil level",
      cause: "Poor design placing a sealed pipe right next to a glowing hot turbocharger without adequate heat shielding. The rubber seals perish and leak pressurized oil.",
      fix: "1. Inspect turbo heat shield for fresh oil\n2. Replace OEM line with an aftermarket braided stainless-steel line with better heat shielding (£50 parts)\n3. Removal requires taking off the downpipe and heat shields in a tight space\n4. Labour: 2-3 hours. Total cost: £200-300\n5. *Fire risk if ignored*",
      severity: "critical",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 200, repair_cost_high: 300,
      diy_difficulty: "hard",
      affected_years: "2006-2013",
      obd_codes: [],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // NISSAN QASHQAI J10 1.5 dCi — 4 additional faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("j10-15-dci-106"),
      title: "CVT / Automatic Gearbox Failure",
      slug: "qashqai-j10-cvt-failure",
      summary: "Nissan's X-Tronic CVT gearbox is notoriously fragile. It suffers from belt slippage, bearing failure, and juddering, often requiring a complete replacement.",
      symptoms: "- Severe juddering or shaking when accelerating\n- RPMs flare up but car doesn't accelerate (slipping)\n- Whining noise that changes with road speed\n- Gearbox goes into limp mode",
      cause: "The steel push-belt slips on the internal pulleys, scoring the metal. Overheating fluid degrades quickly. Nissan claimed the fluid was 'lifetime', meaning many went un-serviced until failure.",
      fix: "1. If caught very early, a fluid and filter change may buy time\n2. Usually requires full gearbox rebuild or replacement\n3. Remanufactured CVT: £1,500 - £2,500\n4. Manual gearbox variants are highly recommended over the CVT",
      severity: "critical",
      mileage_start: 60000, mileage_end: 110000,
      repair_cost_low: 1500, repair_cost_high: 2500,
      diy_difficulty: "professional_only",
      affected_years: "2007-2013",
      obd_codes: ["P0868", "P0746"],
      published: true,
    },
    {
      variant_id: v("j10-15-dci-106"),
      title: "Rear Subframe Corrosion",
      slug: "qashqai-j10-subframe-rust",
      summary: "The rear subframe on early Qashqais is highly susceptible to severe corrosion. It rusts from the inside out, leading to MOT failure and structural weakness.",
      symptoms: "- Advisory or Failure on MOT for excessive corrosion\n- Flaking rust falling from rear suspension area\n- Clunking from rear suspension if mounts are weakened\n- Misaligned rear wheels",
      cause: "Poor factory rust protection and a tubular design that traps salty water and mud inside the subframe. UK winter roads accelerate the decay significantly.",
      fix: "1. Probe subframe with a screwdriver to check structural integrity\n2. Light rust can be wire-brushed and treated with rust converter/underseal\n3. Serious rot requires replacing the entire rear subframe assembly\n4. Subframe part: £200-400. Labour: 4-6 hours (bolts often seize)\n5. Total replacement cost: £600-1,000",
      severity: "severe",
      mileage_start: 70000, mileage_end: 150000,
      repair_cost_low: 600, repair_cost_high: 1000,
      diy_difficulty: "professional_only",
      affected_years: "2007-2010",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("j10-15-dci-106"),
      title: "Steering Column Clicking / Rack Failure",
      slug: "qashqai-j10-steering-clicking",
      summary: "A clicking or clunking noise when turning the steering wheel at low speeds is extremely common. It usually stems from the steering column universal joint or the rack itself.",
      symptoms: "- Distinct 'click' or 'clunk' felt through the steering wheel when turning\n- Vague steering feel\n- Noise is most obvious when parking\n- MOT advisory for play in steering",
      cause: "The universal joint (UJ) in the steering column shaft wears out and develops play. In some cases, the internal bushes in the steering rack itself wear down.",
      fix: "1. Diagnose: hold UJ under dashboard while turning wheel to feel for play\n2. If lower steering column shaft UJ is worn: replace shaft (£150-250 fitted)\n3. If rack is worn: remanufactured steering rack required (£400-600 fitted)",
      severity: "moderate",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 150, repair_cost_high: 600,
      diy_difficulty: "moderate",
      affected_years: "2007-2013",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("j10-15-dci-106"),
      title: "1.5 dCi Connecting Rod Bearing Failure",
      slug: "qashqai-j10-dci-rod-bearings",
      summary: "The Renault-sourced K9K 1.5 dCi engine is infamous for spinning its bottom-end connecting rod bearings, especially if oil change intervals are pushed too far.",
      symptoms: "- Heavy, rhythmic knocking noise from bottom of engine\n- Noise increases with RPM\n- Low oil pressure warning light\n- If ignored, conrod punches a hole through engine block",
      cause: "The bearing shells wear prematurely due to a combination of material choice and oil degradation. Extended 18,000-mile service intervals caused oil to thin out and lose protection.",
      fix: "1. If knocking is heard, STOP driving immediately\n2. PREVENTATIVE: Drop oil sump and replace big-end bearing shells every 70,000 miles (£250-350)\n3. If bearings have spun: Engine requires full rebuild or replacement\n4. Change oil every 9,000 miles maximum to prevent this",
      severity: "critical",
      mileage_start: 70000, mileage_end: 120000,
      repair_cost_low: 300, repair_cost_high: 1500,
      diy_difficulty: "hard",
      affected_years: "2007-2010",
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

  console.log(`✅ Phase 2b complete. Inserted ${inserted} faults.`);
}

seed().catch(console.error);
