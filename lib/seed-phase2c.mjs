/**
 * CKF Phase 2c — Audi, Peugeot, Renault, Land Rover fault depth expansion
 * Run: node lib/seed-phase2c.mjs
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
    // AUDI A3 8P 2.0 TDI 140bhp PD — 4 faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("a3-8p-20-tdi-140"),
      title: "Porous Cylinder Head (BKD Engine)",
      slug: "audi-a3-8p-porous-head",
      summary: "Early 2.0 TDI 140bhp engines (engine code BKD) suffered from porous cylinder heads, causing coolant to leak directly into the combustion chambers or oil ways.",
      symptoms: "- Unexplained coolant loss with no external leaks\n- Hard starting in the morning\n- White smoke on cold start\n- Mayonnaise under the oil cap",
      cause: "A manufacturing defect in the casting of the cylinder head on early BKD engines allowed micro-cracks to form. Coolant slowly seeps into the cylinders when the engine cools down overnight.",
      fix: "1. Pressure test cooling system overnight\n2. The only fix is a replacement cylinder head (revision 'C' heads are safe)\n3. Very expensive repair: often writes off an older car\n4. Cost: £1,200 - £2,000",
      severity: "critical",
      mileage_start: 50000, mileage_end: 120000,
      repair_cost_low: 1200, repair_cost_high: 2000,
      diy_difficulty: "professional_only",
      affected_years: "2003-2008",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("a3-8p-20-tdi-140"),
      title: "Oil Pump Balancer Shaft Failure",
      slug: "audi-a3-8p-oil-pump-failure",
      summary: "Some 2.0 TDI PD engines suffer from a catastrophic failure of the oil pump hex drive, leading to immediate oil starvation and engine destruction.",
      symptoms: "- Sudden red 'Low Oil Pressure' warning on dashboard\n- Engine gets noticeably louder/rattley instantly\n- If ignored for even 60 seconds: seized turbo and engine failure",
      cause: "The oil pump is driven by a small hexagonal shaft that connects to the balancer shaft module. The hex shaft rounds off over time, causing the oil pump to stop spinning.",
      fix: "1. Stop driving IMMEDIATELY if the red oil pressure light appears\n2. Preventative fix: upgrade the hex shaft to the revised longer/hardened version\n3. Requires dropping the sump to replace (£300-400)\n4. If failed while driving: requires new turbo and potentially an engine rebuild (£2,000+)",
      severity: "critical",
      mileage_start: 80000, mileage_end: 150000,
      repair_cost_low: 300, repair_cost_high: 2000,
      diy_difficulty: "hard",
      affected_years: "2005-2008",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("a3-8p-20-tdi-140"),
      title: "EGR Valve Failure and Anti-Shudder Valve",
      slug: "audi-a3-8p-egr-failure",
      summary: "The EGR valve and the adjacent anti-shudder valve (throttle flap) are prone to failing due to heavy carbon buildup and stripped internal plastic gears.",
      symptoms: "- Engine management light (EML) illuminated\n- Engine shudders violently when turned off\n- Limp mode and reduced power\n- P0401 or P2108 codes",
      cause: "Soot mixes with oil vapour to create thick carbon sludge, jamming the valves. Additionally, the anti-shudder valve uses plastic internal gears which strip when fighting the carbon.",
      fix: "1. Remove and clean the EGR assembly\n2. If gears are stripped, replace the anti-shudder valve (£100-150)\n3. Consider replacing both units if heavily caked\n4. Cost: £200-350 fitted",
      severity: "moderate",
      mileage_start: 70000, mileage_end: 140000,
      repair_cost_low: 200, repair_cost_high: 350,
      diy_difficulty: "moderate",
      affected_years: "2003-2013",
      obd_codes: ["P0401", "P2108", "P2111"],
      published: true,
    },
    {
      variant_id: v("a3-8p-20-tdi-140"),
      title: "Flywheel / DMF Shudder",
      slug: "audi-a3-8p-dmf-shudder",
      summary: "Like the Golf Mk5, the A3 2.0 TDI consumes Dual Mass Flywheels. Worn DMFs cause significant vibration and require complete replacement.",
      symptoms: "- Rough vibration at idle\n- 'Clattering' noise from bellhousing that disappears when clutch is pressed\n- Judder when slipping the clutch in 1st gear",
      cause: "Internal springs in the DMF weaken and break over time. High torque at low RPM accelerates this wear.",
      fix: "1. Replace DMF and Clutch as a full kit\n2. Use LuK or Sachs components\n3. Do not fit a solid mass conversion on the 6-speed box as it can damage the gearbox input shaft over time\n4. Cost: £700-1,000",
      severity: "moderate",
      mileage_start: 80000, mileage_end: 160000,
      repair_cost_low: 700, repair_cost_high: 1000,
      diy_difficulty: "professional_only",
      affected_years: "2003-2013",
      obd_codes: [],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // PEUGEOT 207 1.6 HDi 90bhp — 4 faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("207-16-hdi-90"),
      title: "Turbo Oil Starvation and Destruction",
      slug: "peugeot-207-16hdi-turbo-starvation",
      summary: "The 1.6 HDi (DV6) engine is infamous for destroying turbos. The cause is almost always oil sludge blocking the tiny gauze filter in the turbo oil feed pipe.",
      symptoms: "- Sudden loss of power\n- Siren or screeching noise from turbo\n- Blue smoke from exhaust\n- Severe shaft play in the turbo compressor wheel",
      cause: "Peugeot fitted a small gauze filter inside the banjo bolt for the turbo oil feed. If oil changes are missed, sludge blocks this gauze. The turbo is starved of oil and fails.",
      fix: "1. DO NOT just fit a new turbo — it will fail again within 50 miles.\n2. You MUST remove the sump, clean the oil pickup, flush the engine, and replace the oil feed pipe.\n3. Discard the gauze filter from the new banjo bolt.\n4. Fit new turbo and fresh oil.\n5. Repair cost: £700-1,200",
      severity: "critical",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 700, repair_cost_high: 1200,
      diy_difficulty: "hard",
      affected_years: "2006-2012",
      obd_codes: ["P0299"],
      published: true,
    },
    {
      variant_id: v("207-16-hdi-90"),
      title: "Injector Seal Leak (Chuffing / Black Death)",
      slug: "peugeot-207-16hdi-injector-seals",
      summary: "Copper injector seals fail, allowing exhaust gases and unburnt diesel to escape and coat the top of the engine in a hard black tar affectionately known as 'Black Death'.",
      symptoms: "- Audible 'chuffing' or rhythmic ticking sound from engine\n- Smell of exhaust fumes in the cabin\n- Hard, black, tar-like substance pooling around the injectors",
      cause: "The copper crush washers at the base of the injectors loosen and degrade. Exhaust gas escapes past them, baking the leaking diesel into a solid carbon mass.",
      fix: "1. Catch it early: if you hear 'chuffing', get the seals changed immediately (£150)\n2. If 'Black Death' has formed, extraction becomes a nightmare. Injectors often seize.\n3. Requires specialist tooling to cut new injector seats in the head.\n4. Cost if severely carbonised: £300-600",
      severity: "severe",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 150, repair_cost_high: 600,
      diy_difficulty: "hard",
      affected_years: "2006-2012",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("207-16-hdi-90"),
      title: "DPF Blockage and Eolys Fluid Depletion",
      slug: "peugeot-207-16hdi-dpf-eolys",
      summary: "Peugeot uses a wet DPF system requiring an additive (Eolys/Cerine fluid) to lower the burning temperature of soot. The fluid runs out, or the DPF blocks from short trips.",
      symptoms: "- 'Depollution System Faulty' warning on dash\n- 'Risk of Particle Filter Blocking' warning\n- Limp mode\n- High fuel consumption",
      cause: "The Eolys fluid pouch/tank needs refilling every 60k-80k miles. If it runs empty, the DPF cannot regenerate properly. Ash also naturally fills the DPF over 100k miles.",
      fix: "1. Check Eolys fluid level via diagnostics and physically top up the tank/pouch (£150-200)\n2. Tell the ECU the fluid has been topped up (requires Peugeot Diagbox or good OBD tool)\n3. Force DPF regeneration\n4. If DPF is ash-filled, replace the DPF (£300-500)",
      severity: "moderate",
      mileage_start: 60000, mileage_end: 100000,
      repair_cost_low: 200, repair_cost_high: 500,
      diy_difficulty: "professional_only",
      affected_years: "2006-2012",
      obd_codes: ["P1445", "P1446", "P242F"],
      published: true,
    },
    {
      variant_id: v("207-16-hdi-90"),
      title: "Camshaft Chain Tensioner Wear (16v models)",
      slug: "peugeot-207-16hdi-cam-chain",
      summary: "On the 16-valve versions of the 1.6 HDi, there is a small timing chain connecting the two camshafts (driven by the main cambelt). The chain tensioner wears, causing a rattle and potential timing slip.",
      symptoms: "- Distinct chain rattle from the top of the engine on cold start\n- Rattle persists at idle\n- Can jump teeth if ignored, destroying the engine",
      cause: "The plastic pads on the hydraulic chain tensioner wear away, causing chain slack. This is heavily accelerated by poor oil change intervals or sludged oil (see Turbo failure).",
      fix: "1. Remove the camshaft cover and replace the chain and tensioner set\n2. Must be done carefully as it requires locking the timing\n3. Recommend changing the main timing belt and water pump at the same time\n4. Cost: £400-600",
      severity: "severe",
      mileage_start: 80000, mileage_end: 140000,
      repair_cost_low: 400, repair_cost_high: 600,
      diy_difficulty: "hard",
      affected_years: "2006-2010",
      obd_codes: [],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // RENAULT CLIO MK3 1.5 dCi 86bhp — 4 faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("clio-mk3-15-dci-86"),
      title: "Delphi Fuel Injector Failure",
      slug: "renault-clio-15dci-delphi-injectors",
      summary: "Early 1.5 dCi engines (K9K) used Delphi fuel injectors that were highly prone to failure, causing misfires and sometimes producing metal swarf that destroys the entire fuel system.",
      symptoms: "- Hard to start\n- Severe knocking sound (diesel knock) under load\n- Black smoke\n- 'Check Injection' message on dashboard\n- Car cuts out while driving",
      cause: "The Delphi high-pressure pump can wear internally, shedding microscopic metal flakes into the fuel lines. These flakes enter the injectors and ruin them.",
      fix: "1. Check fuel filter for metallic glitter\n2. If glitter is found: requires new HP pump, new injectors, new fuel lines, and dropping/cleaning the fuel tank (Cost: £1,200+)\n3. If no glitter: just replace the faulty injector and code it (£200-300)\n4. Always use high-quality diesel filters (Delphi/Purflux) and change regularly",
      severity: "critical",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 300, repair_cost_high: 1500,
      diy_difficulty: "professional_only",
      affected_years: "2005-2009",
      obd_codes: ["DF137", "DF026", "DF027"],
      published: true,
    },
    {
      variant_id: v("clio-mk3-15-dci-86"),
      title: "EGR Valve Blockage",
      slug: "renault-clio-15dci-egr",
      summary: "The EGR valve on the Clio 1.5 dCi clogs with soot frequently, leading to the dreaded 'Check Injection' warning light and limp mode.",
      symptoms: "- 'Check Injection' or 'Check Emissions' message\n- Sluggish performance\n- Excessive black smoke when accelerating\n- Jerky driving",
      cause: "City driving and low revs prevent the engine from burning off soot. The EGR valve gets jammed open by carbon, starving the engine of clean air.",
      fix: "1. Remove the EGR valve (can be stiff to pull out of the manifold)\n2. Clean thoroughly with carb cleaner\n3. If electronic section is broken, replace entire valve (£80-150)\n4. Very manageable DIY job",
      severity: "moderate",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 50, repair_cost_high: 200,
      diy_difficulty: "easy",
      affected_years: "2005-2012",
      obd_codes: ["DF084", "DF114", "P0400"],
      published: true,
    },
    {
      variant_id: v("clio-mk3-15-dci-86"),
      title: "Connecting Rod Bearing (Big End) Failure",
      slug: "renault-clio-15dci-big-end-bearings",
      summary: "A known design flaw in the K9K engine means the bottom-end rod bearings can spin or fail prematurely, especially if oil changes are neglected.",
      symptoms: "- Heavy metallic knocking from the bottom of the engine\n- Noise gets faster with RPM\n- Low oil pressure light\n- Catastrophic engine failure if ignored",
      cause: "The material of the bearing shells was poor on early models, and Renault's 18,000-mile service intervals were much too long. The oil degrades, protection is lost, and the bearings wear down to the copper.",
      fix: "1. Preventative: drop the sump and replace the big-end shells every 70,000 miles (£300-400 at a specialist)\n2. If it's already knocking: stop driving immediately. Engine requires a full rebuild or replacement block (£1,000-£1,800)\n3. Service the car every 9,000 miles",
      severity: "critical",
      mileage_start: 70000, mileage_end: 120000,
      repair_cost_low: 350, repair_cost_high: 1800,
      diy_difficulty: "professional_only",
      affected_years: "2005-2010",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("clio-mk3-15-dci-86"),
      title: "Scuttle Panel Drain Blockage (Water Ingress)",
      slug: "renault-clio-mk3-scuttle-drains",
      summary: "Leaves and debris block the drains under the windscreen wipers. Rainwater builds up and overflows directly onto the wiper motor or into the cabin via the heater matrix.",
      symptoms: "- Wiper motor failure (wipers stop working entirely)\n- Damp carpets in the front footwells\n- Sloshing sound of water when cornering\n- Electrical gremlins in the cabin",
      cause: "The rubber drain valves at the bottom of the scuttle panel are too narrow and clog easily with pine needles and dirt. Water pools up like a bathtub.",
      fix: "1. Remove wiper arms and plastic scuttle panel\n2. Clear the drains manually and flush with water\n3. Many owners permanently cut the rubber flaps off the bottom of the drain tubes to prevent recurrence\n4. If wiper motor is submerged, it will need replacing (£150-250 fitted)\n5. Cost to clear drains: £0 (DIY)",
      severity: "moderate",
      mileage_start: 10000, mileage_end: 200000,
      repair_cost_low: 0, repair_cost_high: 250,
      diy_difficulty: "easy",
      affected_years: "2005-2012",
      obd_codes: [],
      published: true,
    },

    // ══════════════════════════════════════════════════════════════════════════
    // LAND ROVER FREELANDER 2 2.2 SD4 — 4 faults
    // ══════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("fl2-22-sd4-190"),
      title: "Haldex Pump Failure (AWD System)",
      slug: "freelander2-haldex-pump",
      summary: "The Freelander 2 relies on a Haldex generation 4 unit for its All-Wheel Drive. The Haldex pump fails because Land Rover didn't include a filter change in the service schedule.",
      symptoms: "- 'Traction Reduced' warning message\n- Car becomes Front-Wheel Drive only (spins front wheels easily)\n- Fault code P1889-14 (Oil pressure pump performance)",
      cause: "The Haldex unit creates friction material/sludge as it works. Because Land Rover deemed it 'sealed for life', the gauze filter blocks, the pump overworks, burns out, and fails.",
      fix: "1. Remove and replace the Haldex pump\n2. MUST clean the Haldex unit internally and replace the hidden filter (Volvo part #31325173 fits perfectly)\n3. Refill with specific Haldex fluid\n4. Cost: Pump £200, Filter £30, Labour 2 hours. Total: £350-500",
      severity: "severe",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 350, repair_cost_high: 500,
      diy_difficulty: "hard",
      affected_years: "2011-2015",
      obd_codes: ["P1889"],
      published: true,
    },
    {
      variant_id: v("fl2-22-sd4-190"),
      title: "Rear Differential Pinion Bearing Failure",
      slug: "freelander2-rear-diff-bearing",
      summary: "A howling or droning noise from the rear of the car is almost always the rear differential pinion bearing failing. This is incredibly common on all Freelander 2s.",
      symptoms: "- Loud humming or droning noise from the rear, sounding like a bad wheel bearing\n- Noise increases with road speed, peaks around 40-50mph\n- Metal shavings in the rear diff oil",
      cause: "The factory-fitted nose bearing in the rear differential wears prematurely. The pre-load on the bearing from the factory was often incorrect.",
      fix: "1. If caught early, a specialist can replace just the pinion bearing and re-shim the diff (£350-500)\n2. If left too long, the metal shavings destroy the crown wheel and pinion, requiring a fully reconditioned differential (£800-1,200)\n3. Change diff oil every 40k miles to prolong life",
      severity: "critical",
      mileage_start: 60000, mileage_end: 110000,
      repair_cost_low: 400, repair_cost_high: 1200,
      diy_difficulty: "professional_only",
      affected_years: "2006-2015",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("fl2-22-sd4-190"),
      title: "Throttle Body / Anti-Shudder Valve Strip",
      slug: "freelander2-throttle-body-gears",
      summary: "The electronic throttle body (anti-shudder valve) strips its internal plastic gears, causing an unpleasant engine shutdown and a warning light.",
      symptoms: "- Engine management light comes on\n- Engine stops with a violent judder or rattle when you push the Stop button\n- High-pitched whining from the throttle body after engine is off",
      cause: "The plastic gears inside the throttle body strip their teeth after years of slamming shut to cut off air to the diesel engine smoothly.",
      fix: "1. Replace the throttle body assembly (£100-180 for Pierburg OEM part)\n2. Easy DIY replacement — located right at the front of the engine, takes 20 minutes and 4 bolts.\n3. Cost fitted at indie: £200-250",
      severity: "moderate",
      mileage_start: 70000, mileage_end: 130000,
      repair_cost_low: 150, repair_cost_high: 250,
      diy_difficulty: "easy",
      affected_years: "2011-2015",
      obd_codes: ["P02E1", "P02E8"],
      published: true,
    },
    {
      variant_id: v("fl2-22-sd4-190"),
      title: "Intercooler Hose Split",
      slug: "freelander2-intercooler-hose",
      summary: "The large rubber boost hoses connected to the intercooler frequently split, causing a massive loss of boost, black smoke, and limp mode.",
      symptoms: "- 'Reduced Engine Performance' warning on dashboard\n- Loud rushing air or hissing sound on acceleration\n- Lots of black smoke from the exhaust\n- Oily residue sprayed around the engine bay near the split",
      cause: "Oil vapour degrades the rubber hoses over time, softening them. The high boost pressure from the SD4 turbo eventually splits the weakened rubber.",
      fix: "1. Visually inspect the top and bottom intercooler hoses for cracks or splits (usually greasy around the split)\n2. Replace the split hose. Silicone upgrades are popular as they don't degrade from oil (£40-70).\n3. Easy DIY fix with a screwdriver for the jubilee clips.\n4. Cost at garage: £100-150",
      severity: "moderate",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 50, repair_cost_high: 150,
      diy_difficulty: "easy",
      affected_years: "2011-2015",
      obd_codes: ["P0299"],
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

  console.log(`✅ Phase 2c complete. Inserted ${inserted} faults.`);
}

seed().catch(console.error);
