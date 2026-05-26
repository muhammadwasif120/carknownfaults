/**
 * CKF Phase 2e — Remaining specific variants
 * Run: node lib/seed-phase2e.mjs
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
    // BMW F30 320d N47/B47 — 4 faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("f30-320d-n47"),
      title: "Steering Rack Clunk (EPS Failure)",
      slug: "bmw-f30-steering-rack",
      summary: "The F30 generation uses an Electronic Power Steering (EPS) rack which frequently develops an internal mechanical clunk, especially over uneven surfaces.",
      symptoms: "- Audible metallic clunking noise when driving over small bumps or cobblestones\n- Play felt through the steering wheel when stationary\n- Rhythmic knocking when rapidly moving the steering wheel left and right",
      cause: "The internal thrust piece inside the steering rack wears down, allowing the rack bar to rattle against the pinion gear.",
      fix: "1. BMW sells a revised thrust piece repair kit (£25).\n2. Fitting requires a special 3-pin tool to remove the large nut on the bottom of the rack.\n3. The rack must be recalibrated with ISTA after fitting.\n4. If the rack is internally corroded or damaged, a full replacement is £1,500+\n5. Cost of repair kit fitted: £150-250",
      severity: "moderate",
      mileage_start: 40000, mileage_end: 90000,
      repair_cost_low: 150, repair_cost_high: 250,
      diy_difficulty: "hard",
      affected_years: "2012-2019",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("f30-320d-n47"),
      title: "EGR Cooler Recall / Fire Risk",
      slug: "bmw-f30-egr-cooler-fire",
      summary: "A huge global recall affects the F30 320d due to the EGR cooler leaking glycol coolant into the intake manifold, which mixes with soot and can catch fire.",
      symptoms: "- Unexplained coolant loss\n- Smell of exhaust fumes or burning plastic in the cabin\n- 'Engine Coolant Low' warning message\n- Hesitation or limp mode",
      cause: "The internal fins of the EGR cooler crack under thermal stress. The leaking coolant combines with hot exhaust soot, creating a highly flammable mixture.",
      fix: "1. Check if the car has had the BMW safety recall performed.\n2. If not, STOP driving and contact a BMW dealer immediately. This is a free recall fix.\n3. The dealer will replace the EGR cooler, EGR valve, and sometimes the entire intake manifold if it is melted.\n4. Cost: £0 (Recall)",
      severity: "critical",
      mileage_start: 30000, mileage_end: 150000,
      repair_cost_low: 0, repair_cost_high: 0,
      diy_difficulty: "professional_only",
      affected_years: "2012-2018",
      obd_codes: ["290900", "2AB500"],
      published: true,
    },
    {
      variant_id: v("f30-320d-n47"),
      title: "ZF 8-Speed Automatic Gearbox Sump Leak",
      slug: "bmw-f30-zf8-sump-leak",
      summary: "The plastic sump pan on the excellent ZF 8-speed automatic gearbox warps over time, causing transmission fluid to leak.",
      symptoms: "- Puddles of oily fluid under the middle of the car\n- Jerky or delayed gear shifts (especially from 1st to 2nd)\n- Transmission warning message if fluid gets critically low",
      cause: "The ZF8 gearbox sump is made of plastic with an integrated filter. Thermal cycling causes the plastic to warp, breaking the seal on the rubber gasket.",
      fix: "1. The sump pan and filter are a single unit and must be replaced together.\n2. Drain fluid, replace pan/filter (£80 part).\n3. Refill with exact spec ZF Lifeguard 8 fluid (£20/litre, needs ~6 litres).\n4. Fluid must be filled at a specific temperature (40°C - 50°C) using diagnostics.\n5. Total cost at specialist: £350-500",
      severity: "moderate",
      mileage_start: 60000, mileage_end: 110000,
      repair_cost_low: 350, repair_cost_high: 500,
      diy_difficulty: "hard",
      affected_years: "2012-2019",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("f30-320d-n47"),
      title: "Timing Chain Failure (N47 Engine)",
      slug: "bmw-f30-timing-chain",
      summary: "While BMW revised the N47 engine for the F30, the timing chain can still stretch and snap, destroying the engine, especially if oil changes are stretched to 18,000 miles.",
      symptoms: "- Distinct, rhythmic 'ch-ch-ch' metallic scraping noise from the back of the engine\n- Noise increases with RPM\n- EML light for camshaft/crankshaft correlation faults",
      cause: "The chain guides wear and the chain stretches. The chain is located at the rear of the engine, meaning the entire engine must be removed to replace it.",
      fix: "1. Preventative: Halve the BMW oil change interval to 9,000 miles/1 year.\n2. If rattling: Engine out, replace upper and lower chains, tensioners, and guides.\n3. Cost of preventative chain replacement: £1,000-£1,400\n4. Cost if it snaps: £3,000+ for a replacement engine.",
      severity: "critical",
      mileage_start: 80000, mileage_end: 140000,
      repair_cost_low: 1000, repair_cost_high: 3000,
      diy_difficulty: "professional_only",
      affected_years: "2012-2015",
      obd_codes: [],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // AUDI A3 8V 2.0 TDI 150bhp — 4 faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("a3-8v-20-tdi-150"),
      title: "Water Pump / Coolant SIlca Bag Rupture",
      slug: "audi-a3-8v-silica-bag",
      summary: "The coolant expansion tank contains a 'Silica bag' designed to extend coolant life. This bag frequently bursts, sending silica gel through the engine and destroying the water pump and heater matrix.",
      symptoms: "- Engine overheating\n- No hot air from the interior heater vents\n- Coolant loss or brown, sludgy coolant\n- Water pump failure codes",
      cause: "The silica bag (marked 'Mit Silikat' on the reservoir) degrades and splits. The gel beads block the narrow channels in the heater matrix and jam the water pump impeller.",
      fix: "1. Preventative: Remove the silica bag from the expansion tank immediately if it hasn't burst.\n2. If burst: Replace heater matrix, water pump, expansion tank, and perform multiple deep chemical flushes of the block.\n3. Highly expensive repair if it bursts. Cost: £800-1,500",
      severity: "critical",
      mileage_start: 40000, mileage_end: 90000,
      repair_cost_low: 800, repair_cost_high: 1500,
      diy_difficulty: "professional_only",
      affected_years: "2013-2019",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("a3-8v-20-tdi-150"),
      title: "Haldex Gen 5 Pump Failure (quattro models)",
      slug: "audi-a3-8v-haldex-pump",
      summary: "On quattro models, the Generation 5 Haldex unit frequently fails because VW/Audi removed the filter present on older generations.",
      symptoms: "- Total loss of all-wheel drive (front wheels spin easily in the wet)\n- No warning light on the dashboard in most cases\n- VCDS fault code for Haldex pump mechanical failure",
      cause: "The Generation 5 unit does not have a replaceable filter. The oil strainer on the pump gets completely clogged with clutch friction material, burning out the pump.",
      fix: "1. The Haldex oil MUST be changed every 30,000 miles, and the pump MUST be removed to clean the strainer mesh.\n2. If the pump is dead, replace it (£250 part).\n3. Clean the housing out, fit new pump, and fill with correct fluid.\n4. Cost: £400-500",
      severity: "severe",
      mileage_start: 50000, mileage_end: 80000,
      repair_cost_low: 400, repair_cost_high: 500,
      diy_difficulty: "moderate",
      affected_years: "2013-2019",
      obd_codes: ["C111307", "C111204"],
      published: true,
    },
    {
      variant_id: v("a3-8v-20-tdi-150"),
      title: "MMI Infotainment Screen Mechanism Failure",
      slug: "audi-a3-8v-mmi-screen",
      summary: "The pop-up MMI screen in the dashboard frequently gets stuck or stops working entirely due to a broken wiring ribbon or failed motor mechanism.",
      symptoms: "- Screen refuses to rise when the car is started\n- Screen goes blank or flickers\n- Grinding noise from the dashboard",
      cause: "The fragile ribbon cable connecting the screen to the base unit flexes every time it opens/closes. Eventually, it snaps. The plastic gears lifting it also wear out.",
      fix: "1. If it's a blank screen: replace the ribbon cable (kits available for £40, requires delicate dismantling of the screen unit).\n2. If it won't rise: replace the motor/gear mechanism or the entire screen assembly.\n3. Used screen assemblies cost £150-250. Dealer replacement is £800+.",
      severity: "minor",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 150, repair_cost_high: 800,
      diy_difficulty: "hard",
      affected_years: "2013-2019",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("a3-8v-20-tdi-150"),
      title: "DSG DQ250 Dual Mass Flywheel Wear",
      slug: "audi-a3-8v-dq250-dmf",
      summary: "The 6-speed wet DSG gearbox (DQ250) is highly reliable, but the Dual Mass Flywheel (DMF) attached to it is a consumable item that fails predictably.",
      symptoms: "- Metallic clattering noise at idle in Park or Neutral\n- Noise disappears or changes tone when shifted into Drive or Reverse\n- Slight vibration through the seat at idle",
      cause: "Internal springs and dampeners in the DMF weaken under the high torque of the 2.0 TDI engine.",
      fix: "1. Do not ignore the rattle; a shattered DMF can destroy the DSG gearbox bellhousing.\n2. Replace the DMF (LUK OEM recommended).\n3. Because it's a DSG, the clutch packs do not usually need replacing at the same time.\n4. Cost: £700-1,000",
      severity: "moderate",
      mileage_start: 80000, mileage_end: 140000,
      repair_cost_low: 700, repair_cost_high: 1000,
      diy_difficulty: "professional_only",
      affected_years: "2013-2019",
      obd_codes: [],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // NISSAN QASHQAI J11 1.5 dCi 110bhp — 4 faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("j11-15-dci-110"),
      title: "Electronic Parking Brake (EPB) Motor Failure",
      slug: "qashqai-j11-epb-failure",
      summary: "The electronic parking brake actuators on the rear brake calipers frequently seize or burn out, leaving the handbrake stuck on or refusing to engage.",
      symptoms: "- 'Chassis Control System Fault' message on dashboard\n- Handbrake won't release (car immobile)\n- Loud grinding noise from the rear wheels when applying the handbrake",
      cause: "The plastic casing on the EPB motor cracks, allowing water and road salt inside. The motor rusts and seizes solid.",
      fix: "1. If stuck on: you may need to physically remove the motor from the caliper to wind back the piston and drive the car.\n2. Replace the EPB motor unit (£100-150 per side).\n3. Requires diagnostic tool to set the brakes into 'maintenance mode' before replacing pads or motors.\n4. Cost fitted: £200-300 per side",
      severity: "severe",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 200, repair_cost_high: 300,
      diy_difficulty: "moderate",
      affected_years: "2014-2021",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("j11-15-dci-110"),
      title: "Front Radar / Anti-Collision Sensor Failure",
      slug: "qashqai-j11-front-radar",
      summary: "The front radar sensor (used for emergency braking) is poorly sealed and highly vulnerable to water ingress and stone chips, causing the entire safety system to shut down.",
      symptoms: "- Constant 'Front Radar Unavailable' warning message\n- Cruise control stops working entirely\n- Autonomous Emergency Braking disabled",
      cause: "The sensor sits directly behind the front Nissan badge. Condensation builds up inside the unit, shorting the circuit board.",
      fix: "1. Check the sensor behind the badge. If the bracket is bent, it can simply be realigned and recalibrated.\n2. If water damaged, a new radar unit is required (£400-600).\n3. MUST be calibrated by a dealer or ADAS specialist after fitting.\n4. Cost fitted and calibrated: £600-800",
      severity: "minor",
      mileage_start: 40000, mileage_end: 90000,
      repair_cost_low: 600, repair_cost_high: 800,
      diy_difficulty: "professional_only",
      affected_years: "2014-2021",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("j11-15-dci-110"),
      title: "DPF Pressure Sensor Pipe Split",
      slug: "qashqai-j11-dpf-pipe",
      summary: "A tiny rubber hose connecting the DPF to the exhaust pressure sensor splits frequently, causing limp mode and preventing DPF regeneration.",
      symptoms: "- Red Engine Management Light\n- Limp mode (severe loss of power)\n- 'Stop/Start System Fault' message\n- P1525 and P2454 fault codes",
      cause: "The rubber hose cannot withstand the extreme heat of the DPF and perishes, splitting open. The ECU reads 0 pressure and panics, shutting down systems.",
      fix: "1. Locate the pressure sensor on the bulkhead and trace the rubber hose down to the exhaust.\n2. Find the split and replace the hose with high-temperature silicone hose (£5).\n3. The cheapest and easiest fix, but garages often misdiagnose this as a failed DPF and quote £1,000+.\n4. Clear fault codes and force a regeneration.",
      severity: "moderate",
      mileage_start: 60000, mileage_end: 100000,
      repair_cost_low: 5, repair_cost_high: 100,
      diy_difficulty: "easy",
      affected_years: "2014-2021",
      obd_codes: ["P1525", "P2454", "P0470"],
      published: true,
    },
    {
      variant_id: v("j11-15-dci-110"),
      title: "NissanConnect Infotainment Boot Loop",
      slug: "qashqai-j11-infotainment-loop",
      summary: "The NissanConnect touch screen system frequently freezes on the Nissan logo and reboot loops constantly, draining the battery if left.",
      symptoms: "- Screen stuck on Nissan logo\n- Radio turns off and on every 3 minutes\n- Reversing camera unavailable\n- System stays on after the car is locked, draining the battery overnight",
      cause: "Software glitch or corrupt SD card. In some cases, the internal eMMC memory chip on the head unit's motherboard fails.",
      fix: "1. First, remove the SD map card and reboot (hold power button for 10 seconds). If it fixes it, buy a new SD card.\n2. Try a software update via a USB stick (files available on Nissan forums).\n3. If hardware failure, replace the head unit with an aftermarket Android unit (£200-300) or used OEM unit (£150).\n4. OEM replacement from Nissan is £1,000+.",
      severity: "minor",
      mileage_start: 30000, mileage_end: 100000,
      repair_cost_low: 0, repair_cost_high: 300,
      diy_difficulty: "moderate",
      affected_years: "2014-2018",
      obd_codes: [],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // RENAULT CLIO MK4 0.9 TCe 90bhp — 4 faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("clio-mk4-09-tce-90"),
      title: "Timing Chain Stretch and Rattle",
      slug: "clio-mk4-09tce-timing-chain",
      summary: "The 0.9 TCe 3-cylinder engine suffers from premature timing chain stretch, causing an aggressive rattle and potentially fatal engine timing slip.",
      symptoms: "- Very loud rattling/clicking noise on cold start\n- 'Check Anti-Pollution System' warning light\n- P0011 or P0012 camshaft timing fault codes\n- Rough idle",
      cause: "The single-row timing chain is weak, and the hydraulic tensioner loses pressure over time, especially if oil changes are neglected or the wrong grade of oil is used.",
      fix: "1. Confirm the noise is the chain and not just the loud high-pressure fuel pump (which is normal).\n2. Replacement of the timing chain, tensioner, and guides is required.\n3. Must be done by a professional with locking tools.\n4. Cost: £600-800",
      severity: "severe",
      mileage_start: 50000, mileage_end: 90000,
      repair_cost_low: 600, repair_cost_high: 800,
      diy_difficulty: "professional_only",
      affected_years: "2012-2019",
      obd_codes: ["P0011", "P0012", "P0016"],
      published: true,
    },
    {
      variant_id: v("clio-mk4-09-tce-90"),
      title: "Thermostat Housing Leak",
      slug: "clio-mk4-09tce-thermostat",
      summary: "The plastic thermostat housing on the 0.9 TCe warps and cracks, leading to a rapid loss of engine coolant and severe overheating risk.",
      symptoms: "- Coolant level dropping rapidly\n- Red temperature warning light (the Clio has no temperature gauge!)\n- Sweet smell of hot coolant from the engine bay\n- Heater blowing cold air",
      cause: "The plastic housing degrades due to the intense heat cycling of the turbocharged engine. The rubber gasket flattens out and leaks.",
      fix: "1. Locate the thermostat housing on the right side of the engine (gearbox side).\n2. Replace the entire housing unit (DO NOT just replace the gasket as the plastic is warped).\n3. The part is cheap (£40-60) and relatively easy to access.\n4. Bleed the cooling system carefully. Cost fitted: £150-200",
      severity: "severe",
      mileage_start: 40000, mileage_end: 80000,
      repair_cost_low: 150, repair_cost_high: 200,
      diy_difficulty: "moderate",
      affected_years: "2012-2019",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("clio-mk4-09-tce-90"),
      title: "Keycard Failure / Not Detected",
      slug: "clio-mk4-keycard",
      summary: "Renault's hands-free keycard system frequently fails to recognise the key, refusing to unlock the car or start the engine.",
      symptoms: "- 'Card Not Detected' message on dashboard\n- Car refuses to start even when the card is in the slot\n- Buttons on the card stop locking/unlocking the doors",
      cause: "The internal soldered connections inside the thin plastic keycard break when the card is kept in a tight pocket or sat upon.",
      fix: "1. Change the CR2032 battery first.\n2. If it still fails, the internal coil has snapped off the circuit board.\n3. A specialist auto locksmith can cut the card open and resolder the coil (£40-50).\n4. A new programmed card from Renault is £180-250.",
      severity: "minor",
      mileage_start: 20000, mileage_end: 100000,
      repair_cost_low: 40, repair_cost_high: 250,
      diy_difficulty: "easy",
      affected_years: "2012-2019",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("clio-mk4-09-tce-90"),
      title: "VVT Solenoid Oil Leak",
      slug: "clio-mk4-09tce-vvt-leak",
      summary: "The Variable Valve Timing (VVT) solenoid located on the top of the cylinder head leaks oil, which runs down the front of the engine.",
      symptoms: "- Oil pooling on the top of the engine block\n- Smell of burning oil if it drips onto the exhaust manifold\n- Slight hesitation on acceleration if the solenoid is failing",
      cause: "The rubber O-ring seal on the VVT solenoid shrinks and hardens over time, allowing pressurised oil to escape past it.",
      fix: "1. Wipe the area clean to confirm the leak is from the solenoid.\n2. Simply unscrew the 10mm bolt, pull the solenoid out, and fit a new O-ring.\n3. Alternatively, replace the entire solenoid if the engine has been hesitating (£60-80).\n4. A very simple 10-minute DIY fix.",
      severity: "minor",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 10, repair_cost_high: 80,
      diy_difficulty: "easy",
      affected_years: "2012-2019",
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

  console.log(`✅ Phase 2e complete. Inserted ${inserted} faults.`);
}

seed().catch(console.error);
