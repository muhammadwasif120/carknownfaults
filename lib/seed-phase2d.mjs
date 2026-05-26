/**
 * CKF Phase 2d — Final remaining variants expansion
 * Run: node lib/seed-phase2d.mjs
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
    // VAUXHALL CORSA E 1.4 90bhp — 4 faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("corsa-e-14-90"),
      title: "Coil Pack Failure and Misfires",
      slug: "corsa-e-14-coil-pack",
      summary: "The ignition coil pack on the 1.4 engine frequently fails, causing severe misfires, sluggish performance, and a flashing engine management light.",
      symptoms: "- Flashing or solid EML\n- Severe hesitation under acceleration\n- Car shaking at idle\n- P0300, P0301-P0304 Misfire codes",
      cause: "The coil pack is a single 'rail' unit that sits over all four spark plugs. Internal electrical insulation breaks down due to engine heat, causing a spark short.",
      fix: "1. Read codes to confirm which cylinder is misfiring\n2. Replace the entire coil pack rail (OEM Delphi recommended, £80-120)\n3. Always replace the 4 spark plugs at the same time to prevent the new pack from overworking\n4. Cost: £150-200 fitted",
      severity: "moderate",
      mileage_start: 40000, mileage_end: 90000,
      repair_cost_low: 150, repair_cost_high: 200,
      diy_difficulty: "easy",
      affected_years: "2014-2019",
      obd_codes: ["P0300", "P0301", "P0302", "P0303", "P0304"],
      published: true,
    },
    {
      variant_id: v("corsa-e-14-90"),
      title: "Water Pump Leak",
      slug: "corsa-e-14-water-pump-leak",
      summary: "Coolant loss on the Corsa E 1.4 is frequently traced back to a leaking water pump seal. If ignored, the engine will overheat rapidly.",
      symptoms: "- Low coolant warning or dropping reservoir level\n- Pink/orange crusty residue on the driver's side of the engine\n- Overheating in traffic",
      cause: "The mechanical water pump seal degrades, allowing coolant to weep out of the weep hole. Eventually, the bearing fails entirely.",
      fix: "1. Pressure test cooling system\n2. Replace water pump and auxiliary belt\n3. Flush and refill with correct Dex-Cool OAT coolant\n4. Cost: £180-300 at an indie",
      severity: "severe",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 180, repair_cost_high: 300,
      diy_difficulty: "moderate",
      affected_years: "2014-2019",
      obd_codes: [],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // VAUXHALL ASTRA H 1.7 CDTi — 4 faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("astra-h-17-cdti"),
      title: "Alternator Failure",
      slug: "astra-h-17cdti-alternator",
      summary: "The alternator on the 1.7 CDTi Astra is a notorious weak point. It fails without much warning, draining the battery and leaving the car stranded.",
      symptoms: "- Battery warning light on dash\n- Whining noise from engine bay\n- Power steering suddenly goes heavy (electric pump loses power)\n- Dashboard lights dimming or flickering",
      cause: "The diode pack inside the Denso/Bosch alternator overheats and burns out. Oil leaks from the vacuum pump (mounted on the alternator in some versions) accelerate failure.",
      fix: "1. Test charging voltage across battery with engine running (should be 13.8V - 14.4V, if <12.5V alternator has failed)\n2. Replace alternator\n3. Ensure battery is fully charged using a wall charger before starting with new alternator\n4. Cost: £250-400",
      severity: "critical",
      mileage_start: 70000, mileage_end: 120000,
      repair_cost_low: 250, repair_cost_high: 400,
      diy_difficulty: "moderate",
      affected_years: "2004-2010",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("astra-h-17-cdti"),
      title: "M32 Gearbox Bearing Failure",
      slug: "astra-h-m32-gearbox",
      summary: "If fitted with the 6-speed M32 gearbox, the Astra H suffers from catastrophic end-case bearing failure. A whining noise in 5th and 6th gear is the hallmark sign.",
      symptoms: "- Whining noise in 1st, 2nd, 5th, and 6th gears\n- Gear stick moves violently when lifting off the throttle in 1st gear\n- Crunching when selecting gears",
      cause: "Poor internal lubrication design and inadequate pre-load on the bearings from the factory causes the mainshaft bearings to overheat and pit.",
      fix: "1. If caught early (whining just starting): gearbox can be repaired in-situ by replacing the end-case bearings (£400-600)\n2. If left until crunching starts: the casing is likely destroyed, requiring a fully reconditioned gearbox (£800-1,200)\n3. Overfill the new gearbox with 2.2-2.4 litres of high-quality oil (Fuchs Titan Sintofluid) rather than the factory 1.9L.",
      severity: "critical",
      mileage_start: 60000, mileage_end: 110000,
      repair_cost_low: 400, repair_cost_high: 1200,
      diy_difficulty: "professional_only",
      affected_years: "2004-2010",
      obd_codes: [],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // VW GOLF MK6 1.6 TDI — 4 faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("mk6-16-tdi-105"),
      title: "Piezo Injector Failure (Siemens/Continental)",
      slug: "vw-golf-mk6-16tdi-injectors",
      summary: "The 1.6 TDI uses Siemens/Continental piezo injectors which are incredibly prone to sudden electrical failure, causing immediate engine shutdown.",
      symptoms: "- Sudden loss of power and engine cuts out while driving\n- Coil light flashing on dash\n- Car refuses to restart\n- P0201-P0204 or P2146/P2147 fault codes",
      cause: "The piezoelectric crystal stack inside the injector shorts to ground. The ECU detects the short and shuts down the entire injector bank to protect itself, killing the engine.",
      fix: "1. Read fault codes to identify the shorted injector\n2. Disconnect the faulty injector: the engine will now start on 3 cylinders (confirms the diagnosis)\n3. Replace the faulty injector (£300-500). Once one fails, the others usually follow shortly after.\n4. Requires VCDS to code the new injector flow rate into the ECU.",
      severity: "critical",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 300, repair_cost_high: 1500,
      diy_difficulty: "professional_only",
      affected_years: "2009-2013",
      obd_codes: ["P0201", "P2146", "P2147"],
      published: true,
    },
    {
      variant_id: v("mk6-16-tdi-105"),
      title: "EGR Valve and Cooler Blockage",
      slug: "vw-golf-mk6-16tdi-egr",
      summary: "The EGR valve and cooler unit is buried at the back of the engine and frequently blocks with carbon or fails electrically. Replacement is labour-intensive.",
      symptoms: "- Flashing glow plug light and limp mode\n- EML illuminated constantly\n- P0403 or P046C EGR fault codes\n- Hesitation and poor fuel economy",
      cause: "Soot build-up jams the EGR flap, and the internal position sensor fails. The design of the combined EGR valve and cooler unit makes it highly susceptible to clogging.",
      fix: "1. Do not attempt to just clean it; the electronic sensor usually fails alongside the mechanical blockage.\n2. Replace the entire EGR unit.\n3. Requires dropping the subframe or removing the DPF to access on 4MOTION models, highly difficult on 2WD models.\n4. Cost: Parts £200-300, Labour £300-500. Total: £500-800",
      severity: "severe",
      mileage_start: 70000, mileage_end: 130000,
      repair_cost_low: 500, repair_cost_high: 800,
      diy_difficulty: "professional_only",
      affected_years: "2009-2013",
      obd_codes: ["P0403", "P046C"],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // VW GOLF MK7 1.4 TSI — 4 faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("mk7-14-tsi-125"),
      title: "Turbo Actuator Wastegate Rattle",
      slug: "vw-golf-mk7-14tsi-wastegate-rattle",
      summary: "A metallic rattling noise from the turbocharger on a cold start or when decelerating is a common annoyance caused by a loose wastegate actuator rod.",
      symptoms: "- Metallic rattling or jingling noise from the engine bay\n- Most obvious on cold starts as the revs drop\n- Rattle when lifting off the throttle around 2,000 RPM\n- Rarely causes an EML unless it jams completely",
      cause: "The linkage connecting the electric wastegate actuator to the turbo wastegate flap develops play. This causes the metal parts to vibrate against each other.",
      fix: "1. VW released a specific metal spring clip (Part: 04E145220) to fit over the linkage to dampen the vibration.\n2. Very cheap and easy DIY fix (£20 for the clip).\n3. If the wastegate flap itself is seized, the entire turbo requires replacement (£800+), but this is rare.",
      severity: "minor",
      mileage_start: 30000, mileage_end: 90000,
      repair_cost_low: 20, repair_cost_high: 100,
      diy_difficulty: "easy",
      affected_years: "2012-2019",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("mk7-14-tsi-125"),
      title: "DSG Mechatronic Unit Failure (DQ200 7-Speed)",
      slug: "vw-golf-mk7-dq200-mechatronic",
      summary: "If fitted with the 7-speed dry clutch DSG (DQ200), the mechatronic control unit is highly prone to internal pressure leaks and electrical failure.",
      symptoms: "- Flashing PRNDS on dashboard (spanner symbol)\n- Total loss of drive (car stuck in neutral)\n- Shuddering badly when pulling away in 1st or reverse\n- Only even or odd gears available",
      cause: "The hydraulic accumulator inside the mechatronic unit cracks due to high pressure, causing a loss of hydraulic fluid. The internal TCU board can also fry.",
      fix: "1. Read gearbox fault codes (P17BF is the classic accumulator leak code)\n2. Mechatronic repair kits exist (Kinergo kit) for £400-600 fitted by a specialist\n3. Full replacement mechatronic from VW is £1,500+\n4. The dry clutches also wear out by 80k miles and cost £700 to replace.",
      severity: "critical",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 500, repair_cost_high: 1500,
      diy_difficulty: "professional_only",
      affected_years: "2012-2019",
      obd_codes: ["P17BF", "P189C"],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // SKODA OCTAVIA MK2 2.0 TDI PD — 4 faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("octavia-mk2-20-tdi-140"),
      title: "Rear Wiper Motor Failure",
      slug: "skoda-octavia-mk2-rear-wiper",
      summary: "The rear wiper motor frequently fails due to the washer fluid pipe leaking directly into the motor housing.",
      symptoms: "- Rear wiper stops working\n- Rear wiper moves erratically or stays on constantly\n- Washer fluid leaks down the inside of the tailgate\n- Smell of burning electronics in the boot",
      cause: "The washer jet tube passes straight through the centre of the wiper motor spindle. The seal degrades, and washer fluid leaks into the electrical circuit board of the motor, shorting it out.",
      fix: "1. Remove interior tailgate trim (often requires force to unclip)\n2. Replace the entire wiper motor assembly (Valeo OEM part £70-90)\n3. Check the washer pipe connector hasn't split\n4. Cost fitted: £120-150",
      severity: "minor",
      mileage_start: 50000, mileage_end: 120000,
      repair_cost_low: 70, repair_cost_high: 150,
      diy_difficulty: "easy",
      affected_years: "2004-2013",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("octavia-mk2-20-tdi-140"),
      title: "Air Conditioning Compressor Failure",
      slug: "skoda-octavia-mk2-ac-compressor",
      summary: "The Sanden/Sanden-style variable displacement AC compressors used on the Mk2 Octavia are notoriously weak. The internal swash plate seizes.",
      symptoms: "- AC blows warm air\n- No 'click' or change in engine RPM when AC is turned on\n- Metallic grinding noise from the auxiliary belt area\n- Metal shavings found inside the AC lines",
      cause: "Internal mechanical failure of the compressor. The central bolt on the compressor pulley often unscrews itself as a safety mechanism when the internals seize.",
      fix: "1. Check the central bolt on the AC pulley — if it's sticking out or missing, the compressor is dead.\n2. DO NOT just fit a new compressor. The system MUST be flushed to remove metal shavings, and the condenser and expansion valve replaced.\n3. If you don't flush it, the new compressor will die in 2 weeks.\n4. Total cost: £500-900",
      severity: "moderate",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 500, repair_cost_high: 900,
      diy_difficulty: "professional_only",
      affected_years: "2004-2013",
      obd_codes: [],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // TOYOTA YARIS MK2 1.3 VVT-i — 4 faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("yaris-mk2-13-vvti"),
      title: "Water Pump Leak and Bearing Failure",
      slug: "toyota-yaris-mk2-water-pump",
      summary: "While incredibly reliable, the 1.3 VVT-i engine's most common weak point is the water pump, which develops a leak and noisy bearing.",
      symptoms: "- Pink crusty coolant residue on the front of the engine\n- Grinding or rumbling noise from the auxiliary belt area\n- Dropping coolant level",
      cause: "The internal seal of the water pump perishes over time. Toyota's pink Super Long Life Coolant leaves a very obvious crusty trail when it leaks.",
      fix: "1. Very easy to spot visually.\n2. Replace the water pump (Aisin OEM part recommended, £50)\n3. Replace the auxiliary drive belt at the same time\n4. Cost fitted: £150-250",
      severity: "moderate",
      mileage_start: 60000, mileage_end: 100000,
      repair_cost_low: 150, repair_cost_high: 250,
      diy_difficulty: "moderate",
      affected_years: "2005-2011",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("yaris-mk2-13-vvti"),
      title: "MMT Semi-Automatic Gearbox Actuator Failure",
      slug: "toyota-yaris-mk2-mmt-gearbox",
      summary: "Models fitted with the Multi-Mode Transmission (MMT) — an automated manual — suffer from severe actuator wear, causing the car to drop into neutral while driving.",
      symptoms: "- Flashing 'N' on the dashboard\n- Car suddenly loses drive and revs freely\n- Extremely jerky gear changes, especially 1st to 2nd\n- Burning clutch smell",
      cause: "The electric clutch actuator motors burn out, and the internal sensors fail. The ECU gets confused about clutch position. The physical clutch also wears out very quickly in urban driving.",
      fix: "1. Buy a manual Yaris if possible!\n2. If MMT: Try an ECU relearn/calibration via Toyota Techstream software first (£50-100)\n3. If actuator is dead, replacement is £600-900.\n4. If clutch is worn, replacement is £500-700.",
      severity: "critical",
      mileage_start: 50000, mileage_end: 90000,
      repair_cost_low: 500, repair_cost_high: 1500,
      diy_difficulty: "professional_only",
      affected_years: "2005-2011",
      obd_codes: ["P0810", "P0900"],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // FIAT 500 1.2 69bhp / 0.9 TwinAir — 5 faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("fiat-500-12-69"),
      title: "Body Control Module (BCM) / Wiring Loom Failure (Hatch Wiring)",
      slug: "fiat-500-wiring-loom-bcm",
      summary: "Electrical gremlins are common on the Fiat 500. The most notorious is the wiring loom snapping where it passes from the body into the boot lid/hatch.",
      symptoms: "- Boot won't open\n- Rear wiper turns on when you brake\n- Number plate lights fail\n- Warning lights on the dashboard for blown bulbs",
      cause: "The rubber gaiter housing the wires flexes every time the boot is opened. The wire insulation goes brittle and snaps, causing shorts.",
      fix: "1. Pull back the rubber boot between the roof and the tailgate.\n2. You will likely see snapped wires.\n3. Repair kits with highly flexible silicone wires are available (£30).\n4. Solder and heat-shrink the new wires in. Takes 1-2 hours DIY.\n5. Garage cost: £100-200",
      severity: "moderate",
      mileage_start: 30000, mileage_end: 80000,
      repair_cost_low: 30, repair_cost_high: 200,
      diy_difficulty: "moderate",
      affected_years: "2007-2019",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("fiat-500-12-69"),
      title: "Exhaust Back Box Corrosion",
      slug: "fiat-500-exhaust-corrosion",
      summary: "The mild steel exhaust back box rots through exceptionally quickly, often causing the exhaust to snap and drag on the floor.",
      symptoms: "- Car sounds much louder/sportier\n- Clanking noise from the rear over bumps\n- Visual inspection shows the outer skin of the silencer peeling off like an onion",
      cause: "Condensation builds up inside the back box on short city journeys. The mild steel rusts from the inside out. Very common MOT failure.",
      fix: "1. Replace the exhaust back box and centre pipe.\n2. Genuine Fiat exhausts are expensive; aftermarket options (e.g., Klarius or Bosal) are cheap but only last 3-4 years.\n3. Cost fitted: £100-150.",
      severity: "minor",
      mileage_start: 30000, mileage_end: 70000,
      repair_cost_low: 100, repair_cost_high: 150,
      diy_difficulty: "easy",
      affected_years: "2007-2019",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("fiat-500-09-twinair"),
      title: "TwinAir UniAir Module Failure",
      slug: "fiat-500-twinair-uniair-failure",
      summary: "The 0.9 TwinAir engine uses a complex electro-hydraulic 'UniAir' module to actuate the intake valves instead of a traditional camshaft. This module fails if oil changes are neglected.",
      symptoms: "- Severe misfire, car drops to 1 cylinder\n- Flashing EML light\n- P1061 or P1062 fault codes (Cylinder 1/2 UniAir actuation signal)\n- Engine sounds like a tractor",
      cause: "The UniAir module relies entirely on clean engine oil to hydraulically push the valves open. Dirty oil blocks the micro-filters in the module, destroying the solenoids.",
      fix: "1. Must use the exact spec oil (Selenia Digitek PE) and change it strictly every 9,000 miles.\n2. If failed, the entire UniAir module must be replaced.\n3. Parts are very expensive (£600-800).\n4. Total repair cost: £900-1,200",
      severity: "critical",
      mileage_start: 40000, mileage_end: 90000,
      repair_cost_low: 900, repair_cost_high: 1200,
      diy_difficulty: "professional_only",
      affected_years: "2010-2019",
      obd_codes: ["P1061", "P1062"],
      published: true,
    },
    {
      variant_id: v("fiat-500-09-twinair"),
      title: "Dual Mass Flywheel Failure (TwinAir only)",
      slug: "fiat-500-twinair-dmf",
      summary: "Unusually for a tiny petrol engine, the two-cylinder TwinAir requires a Dual Mass Flywheel to smooth out its intense vibrations. This DMF wears out surprisingly fast.",
      symptoms: "- Severe vibration through the cabin at low RPM\n- Clattering noise from the gearbox\n- Shuddering when pulling away",
      cause: "The 2-cylinder engine produces massive torsional vibrations. The DMF works overtime and the internal springs fail much faster than on 4-cylinder cars.",
      fix: "1. Replace DMF and clutch together.\n2. Do NOT fit a solid flywheel conversion — it will snap the gearbox input shaft on a TwinAir.\n3. Cost: Parts £400, Labour £300. Total: £600-800",
      severity: "severe",
      mileage_start: 50000, mileage_end: 90000,
      repair_cost_low: 600, repair_cost_high: 800,
      diy_difficulty: "hard",
      affected_years: "2010-2019",
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

  console.log(`✅ Phase 2d complete. Inserted ${inserted} faults.`);
}

seed().catch(console.error);
