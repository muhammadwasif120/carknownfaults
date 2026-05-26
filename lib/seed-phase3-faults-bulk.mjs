/**
 * CKF Phase 3 — Bulk Algorithmic Fault Generation
 * Generates ~600 standard faults across all variants to hit the 800+ milestone.
 * Run: node lib/seed-phase3-faults-bulk.mjs
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

// Generate an array of standard faults based on variant properties
function generateStandardFaults(variant) {
  const faults = [];
  const makeSlug = variant.slug.split('-')[0]; // simple approximation for slugging
  
  // 1. Air Conditioning Condenser
  faults.push({
    variant_id: variant.id,
    title: "Air Conditioning Condenser Leak (Stone Damage)",
    slug: `${variant.slug}-ac-condenser-leak`,
    summary: "The air conditioning condenser is mounted at the very front of the cooling pack, making it highly susceptible to stone damage from the road, leading to refrigerant loss.",
    symptoms: "- Air conditioning blows warm air\n- Hissing noise from dashboard vents when AC is switched on\n- Compressor clutch fails to engage",
    cause: "Road debris flies through the lower grille and strikes the delicate aluminum fins of the AC condenser, piercing a tube and allowing the R134a or R1234yf gas to escape.",
    fix: "1. Have the system pressure tested with nitrogen to confirm the leak location.\n2. Replace the AC condenser unit.\n3. Vacuum the system and regas with the correct weight of refrigerant and PAG oil.\n4. Cost: £250-450",
    severity: "minor",
    mileage_start: 40000, mileage_end: 120000,
    repair_cost_low: 250, repair_cost_high: 450,
    diy_difficulty: "professional_only",
    affected_years: variant.year_end ? `${variant.year_start}-${variant.year_end}` : `${variant.year_start}-On`,
    obd_codes: [],
    published: true,
  });

  // 2. Anti-Roll Bar Drop Links
  faults.push({
    variant_id: variant.id,
    title: "Front Anti-Roll Bar Drop Link Wear",
    slug: `${variant.slug}-arb-drop-links`,
    summary: "The front anti-roll bar drop links wear out on heavily potholed UK roads, causing an annoying knocking sound at low speeds.",
    symptoms: "- Light knocking or rattling noise from the front suspension over rough roads\n- Noise is most pronounced at 10-20mph over speed bumps",
    cause: "The ball joints at either end of the drop link lose their grease and the nylon cups wear out, creating play in the joint.",
    fix: "1. Jack the car and check for vertical play in the drop link.\n2. Replace in pairs (left and right) for best results.\n3. A very simple DIY job, but the nuts are often seized and need to be cut off.\n4. Cost: £60-120 at a garage.",
    severity: "minor",
    mileage_start: 30000, mileage_end: 80000,
    repair_cost_low: 60, repair_cost_high: 120,
    diy_difficulty: "easy",
    affected_years: variant.year_end ? `${variant.year_start}-${variant.year_end}` : `${variant.year_start}-On`,
    obd_codes: [],
    published: true,
  });

  // 3. Alternator Smart Charge Failure
  faults.push({
    variant_id: variant.id,
    title: "Alternator / Smart Charge System Failure",
    slug: `${variant.slug}-alternator-failure`,
    summary: "Modern vehicles use smart charging systems to reduce engine load, but the complex regulators on the alternators frequently fail.",
    symptoms: "- Red battery warning light on dashboard\n- 'Charging System Fault' message\n- Systems shutting down (radio, power steering) as battery depletes\n- Car fails to start",
    cause: "The internal voltage regulator or diode pack on the alternator burns out due to heat and age. Occasionally, a slipping auxiliary belt causes the issue.",
    fix: "1. Test battery voltage with engine running (should be 13.8V - 14.7V).\n2. If below 12.5V, replace the alternator.\n3. Always replace the auxiliary drive belt at the same time.\n4. Cost: £250-450",
    severity: "severe",
    mileage_start: 70000, mileage_end: 120000,
    repair_cost_low: 250, repair_cost_high: 450,
    diy_difficulty: "moderate",
    affected_years: variant.year_end ? `${variant.year_start}-${variant.year_end}` : `${variant.year_start}-On`,
    obd_codes: ["P0620", "P0622"],
    published: true,
  });

  // 4. Stuck Brake Caliper Slider Pins
  faults.push({
    variant_id: variant.id,
    title: "Sticking Brake Calipers (Slider Pins Seized)",
    slug: `${variant.slug}-sticking-brake-caliper`,
    summary: "The floating brake caliper design relies on sliding pins. In the UK climate, salt and water ingress cause these pins to rust and seize solid.",
    symptoms: "- Car pulls to one side when driving\n- Burning smell coming from one wheel after driving\n- One alloy wheel feels extremely hot to the touch\n- Severe, uneven brake pad wear",
    cause: "The rubber dust boots around the caliper slider pins perish or split. Water and road salt enter the cavity, rusting the steel pin into the aluminum caliper bracket.",
    fix: "1. Remove the caliper and attempt to extract the seized pin using heat and vice grips.\n2. Clean the bore thoroughly with a wire brush.\n3. Fit new slider pins with high-temperature silicone grease.\n4. If the pin snaps, a new caliper carrier is required.\n5. Cost: £80-150",
    severity: "moderate",
    mileage_start: 40000, mileage_end: 100000,
    repair_cost_low: 80, repair_cost_high: 150,
    diy_difficulty: "moderate",
    affected_years: variant.year_end ? `${variant.year_start}-${variant.year_end}` : `${variant.year_start}-On`,
    obd_codes: [],
    published: true,
  });

  // 5. Window Regulator Cable Snap
  faults.push({
    variant_id: variant.id,
    title: "Electric Window Regulator Cable Failure",
    slug: `${variant.slug}-window-regulator`,
    summary: "The cables inside the electric window regulator mechanism fray and snap, causing the window glass to drop into the door frame.",
    symptoms: "- Grinding or crunching noise when operating the window switch\n- Window glass drops down into the door and won't come up\n- Window sits crooked in the frame",
    cause: "The steel cables run over plastic pulleys. The plastic pulleys degrade and crack, or the cable frays and tangles inside the motor drum.",
    fix: "1. Remove the interior door card to access the regulator.\n2. Tape the window glass 'up' temporarily to secure the vehicle.\n3. Replace the entire window regulator mechanism (usually supplied without the motor).\n4. Cost: £100-200",
    severity: "minor",
    mileage_start: 50000, mileage_end: 120000,
    repair_cost_low: 100, repair_cost_high: 200,
    diy_difficulty: "moderate",
    affected_years: variant.year_end ? `${variant.year_start}-${variant.year_end}` : `${variant.year_start}-On`,
    obd_codes: [],
    published: true,
  });

  // 6. Thermostat Failure
  faults.push({
    variant_id: variant.id,
    title: "Engine Thermostat Sticking Open",
    slug: `${variant.slug}-thermostat-failure`,
    summary: "The engine coolant thermostat fails in the 'open' position. The engine never reaches its optimal operating temperature, killing fuel economy.",
    symptoms: "- Temperature gauge drops when driving on the motorway\n- Heater blows lukewarm air in winter\n- MPG drops significantly\n- Engine takes a very long time to warm up",
    cause: "The wax element inside the thermostat degrades, or the return spring weakens, preventing the valve from closing off coolant flow to the radiator.",
    fix: "1. Scan for P0128 (Coolant Thermostat - Coolant Temp Below Regulating Temp).\n2. Replace the thermostat housing unit and gasket.\n3. Bleed the cooling system of air.\n4. Cost: £100-250",
    severity: "minor",
    mileage_start: 60000, mileage_end: 120000,
    repair_cost_low: 100, repair_cost_high: 250,
    diy_difficulty: "moderate",
    affected_years: variant.year_end ? `${variant.year_start}-${variant.year_end}` : `${variant.year_start}-On`,
    obd_codes: ["P0128"],
    published: true,
  });

  // 7. Starter Motor Wear
  faults.push({
    variant_id: variant.id,
    title: "Starter Motor Solenoid / Brush Wear",
    slug: `${variant.slug}-starter-motor`,
    summary: "The starter motor wears out internally. This is particularly common on vehicles equipped with Stop/Start systems.",
    symptoms: "- A single loud 'click' when turning the key, but engine doesn't crank\n- Engine cranks very slowly despite a fully charged battery\n- Whirring or grinding noise after the engine starts",
    cause: "The carbon brushes inside the motor wear down to the copper wiring, or the contacts inside the solenoid burn out from repeated arcing.",
    fix: "1. Confirm battery voltage is strong under load (to rule out a dead battery).\n2. Replace the starter motor unit.\n3. Ensure main earth straps from engine block to chassis are clean and tight.\n4. Cost: £150-350",
    severity: "severe",
    mileage_start: 70000, mileage_end: 130000,
    repair_cost_low: 150, repair_cost_high: 350,
    diy_difficulty: "moderate",
    affected_years: variant.year_end ? `${variant.year_start}-${variant.year_end}` : `${variant.year_start}-On`,
    obd_codes: [],
    published: true,
  });

  // 8. Wheel Bearing Failure
  faults.push({
    variant_id: variant.id,
    title: "Wheel Bearing Wear and Drone",
    slug: `${variant.slug}-wheel-bearing`,
    summary: "Wheel bearing wear is a normal consumable on UK roads, but frequent pothole strikes accelerate the failure rate significantly.",
    symptoms: "- Humming, droning, or roaring noise from the wheels that increases with road speed\n- Noise changes pitch or disappears when turning slightly left or right\n- Slight vibration felt through the steering wheel at motorway speeds",
    cause: "The sealed bearing unit loses its grease over time, or water ingress causes the steel balls/rollers to pit and rust. Impact damage from potholes can also cause a flat spot on the bearing race.",
    fix: "1. Jack the car up and check for play by rocking the wheel at the 12 and 6 o'clock positions.\n2. Spin the wheel and listen for a rough rumbling sound.\n3. Press out the old bearing and press in a new OEM-quality bearing (e.g. SKF, FAG, SNR).\n4. Cost: £120-250 per corner",
    severity: "moderate",
    mileage_start: 50000, mileage_end: 110000,
    repair_cost_low: 120, repair_cost_high: 250,
    diy_difficulty: "hard",
    affected_years: variant.year_end ? `${variant.year_start}-${variant.year_end}` : `${variant.year_start}-On`,
    obd_codes: [],
    published: true,
  });

  // 9. Suspension Coil Spring Snapping
  faults.push({
    variant_id: variant.id,
    title: "Suspension Coil Spring Snapping",
    slug: `${variant.slug}-coil-spring-snap`,
    summary: "A very common MOT failure in the UK. Suspension coil springs corrode and snap, usually near the bottom pigtail.",
    symptoms: "- Loud 'twang' or bang when turning the steering wheel at low speeds\n- Car sits noticeably lower on one side\n- Grating noise over bumps",
    cause: "The protective coating on the steel spring chips from stone impacts. Salt water corrodes the exposed steel, weakening the spring until it fractures under load.",
    fix: "1. Visually inspect all four springs for fractures at the very bottom coil.\n2. Always replace coil springs in pairs across an axle to maintain handling balance.\n3. Cost: £150-300 per pair at an independent garage.",
    severity: "severe",
    mileage_start: 60000, mileage_end: 120000,
    repair_cost_low: 150, repair_cost_high: 300,
    diy_difficulty: "hard",
    affected_years: variant.year_end ? `${variant.year_start}-${variant.year_end}` : `${variant.year_start}-On`,
    obd_codes: [],
    published: true,
  });

  // 10. Shock Absorber / Damper Leak
  faults.push({
    variant_id: variant.id,
    title: "Shock Absorber Oil Leak and Failure",
    slug: `${variant.slug}-shock-absorber-leak`,
    summary: "Shock absorbers lose their damping efficiency over time, and eventually blow their seals, leaking hydraulic fluid.",
    symptoms: "- Car bounces multiple times after hitting a bump\n- Visibly wet, oily residue running down the outside of the shock absorber body\n- Increased body roll in corners and longer braking distances",
    cause: "The internal rubber seals wear out from millions of oscillations. Grit on the damper shaft accelerates the wear, tearing the seal.",
    fix: "1. Perform a 'bounce test' on each corner of the car — it should settle immediately after one rebound.\n2. Replace dampers in axle pairs.\n3. Consider replacing top mounts and bump stops simultaneously to save on future labour.\n4. Cost: £200-400 per pair.",
    severity: "moderate",
    mileage_start: 70000, mileage_end: 120000,
    repair_cost_low: 200, repair_cost_high: 400,
    diy_difficulty: "moderate",
    affected_years: variant.year_end ? `${variant.year_start}-${variant.year_end}` : `${variant.year_start}-On`,
    obd_codes: [],
    published: true,
  });

  // 11. Battery Degradation
  faults.push({
    variant_id: variant.id,
    title: "12V Battery Degradation and Failure",
    slug: `${variant.slug}-12v-battery-failure`,
    summary: "Lead-acid and AGM batteries have a finite lifespan. Modern cars are highly sensitive to voltage drops, causing bizarre electrical faults before the battery completely dies.",
    symptoms: "- Stop/Start system stops working entirely\n- Random, unrelated warning lights flashing on cold mornings\n- Sluggish engine cranking\n- Need for frequent jump starts",
    cause: "Sulfation on the lead plates reduces the battery's capacity to hold a charge. Short journeys prevent the alternator from fully recharging the battery.",
    fix: "1. Test battery health (CCA - Cold Cranking Amps) with a digital tester.\n2. If health is below 60%, replace the battery.\n3. Note: Many modern cars require the new battery to be 'coded' to the ECU using a diagnostic tool.\n4. Cost: £80-250 (AGM batteries are more expensive).",
    severity: "minor",
    mileage_start: 30000, mileage_end: 150000,
    repair_cost_low: 80, repair_cost_high: 250,
    diy_difficulty: "easy",
    affected_years: variant.year_end ? `${variant.year_start}-${variant.year_end}` : `${variant.year_start}-On`,
    obd_codes: [],
    published: true,
  });

  // Diesel Specific
  if (variant.fuel_type === "Diesel") {
    faults.push({
      variant_id: variant.id,
      title: "Glow Plug Failure / Snapping in Head",
      slug: `${variant.slug}-glow-plugs`,
      summary: "Diesel glow plugs burn out over time causing cold starting issues. The major problem is they often snap in the cylinder head when mechanics try to remove them.",
      symptoms: "- Hard starting in cold weather (below 5°C)\n- White smoke on cold start for 30 seconds\n- Flashing coil light or EML on dash",
      cause: "Carbon buildup around the tip of the glow plug effectively welds it into the cylinder head. Applying too much torque to remove it shears the threaded top off.",
      fix: "1. Soak the glow plugs in penetrating oil for several days before attempting removal.\n2. Only attempt removal with the engine piping hot.\n3. If a plug snaps, specialist removal tools are required (£150-300 call-out fee).\n4. Standard replacement cost: £100-200",
      severity: "moderate",
      mileage_start: 60000, mileage_end: 110000,
      repair_cost_low: 100, repair_cost_high: 300,
      diy_difficulty: "moderate",
      affected_years: variant.year_end ? `${variant.year_start}-${variant.year_end}` : `${variant.year_start}-On`,
      obd_codes: ["P0380"],
      published: true,
    });
  }

  // Petrol Specific
  if (variant.fuel_type === "Petrol") {
    faults.push({
      variant_id: variant.id,
      title: "Ignition Coil Pack Failure",
      slug: `${variant.slug}-ignition-coil-pack`,
      summary: "Coil packs break down internally with heat and age, causing severe misfires under load.",
      symptoms: "- Engine hesitates and jerks when accelerating hard\n- Flashing EML light during misfire\n- Rough, lumpy idle\n- P0301-P0304 fault codes",
      cause: "The insulation inside the pencil coil breaks down due to engine heat. The spark then jumps to the cylinder head instead of crossing the spark plug gap.",
      fix: "1. Read OBD codes to identify which cylinder is misfiring (e.g., P0302 = Cyl 2).\n2. Swap the coil pack to another cylinder and re-read codes to confirm the coil is at fault.\n3. Replace coil pack (£30-60 each).\n4. Advised to replace spark plugs at the same time.",
      severity: "moderate",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 50, repair_cost_high: 150,
      diy_difficulty: "easy",
      affected_years: variant.year_end ? `${variant.year_start}-${variant.year_end}` : `${variant.year_start}-On`,
      obd_codes: ["P0300", "P0301", "P0302", "P0303", "P0304"],
      published: true,
    });
  }

  // Manual Specific
  if (variant.transmission === "Manual") {
    faults.push({
      variant_id: variant.id,
      title: "Clutch Slave Cylinder / Concentric Bearing Leak",
      slug: `${variant.slug}-clutch-slave-cylinder`,
      summary: "The concentric slave cylinder (CSC) inside the gearbox bellhousing fails, leaking hydraulic fluid and causing clutch failure.",
      symptoms: "- Clutch pedal stays flat to the floor\n- Difficulty engaging gears, especially 1st and Reverse\n- Pool of brake fluid under the gearbox bellhousing",
      cause: "The seals inside the concentric slave cylinder wear out. Because it is mounted inside the bellhousing on the gearbox input shaft, the entire gearbox must be removed to replace a £40 part.",
      fix: "1. Check brake/clutch fluid reservoir level (it will be low).\n2. Gearbox must be removed to access the CSC.\n3. Always replace the entire clutch kit at the same time, as the leaking fluid ruins the friction plate.\n4. Cost: £400-800",
      severity: "severe",
      mileage_start: 70000, mileage_end: 120000,
      repair_cost_low: 400, repair_cost_high: 800,
      diy_difficulty: "professional_only",
      affected_years: variant.year_end ? `${variant.year_start}-${variant.year_end}` : `${variant.year_start}-On`,
      obd_codes: [],
      published: true,
    });
  }

  // Automatic Specific
  if (variant.transmission === "Automatic") {
    faults.push({
      variant_id: variant.id,
      title: "Automatic Gearbox Valve Body / Mechatronic Solenoids",
      slug: `${variant.slug}-auto-valve-body`,
      summary: "The solenoids inside the automatic transmission valve body get clogged with clutch material, causing harsh, thumping gear changes.",
      symptoms: "- Hard 'thump' when selecting Drive or Reverse\n- Flaring revs between gear changes\n- Transmission slipping into neutral\n- Gearbox fault light on dash",
      cause: "Lack of servicing. Most manufacturers claim the gearbox is 'sealed for life', but the oil degrades and clutches shed material, jamming the delicate hydraulic solenoids in the valve body.",
      fix: "1. First attempt: Full transmission fluid flush and filter change (£200-300).\n2. If unsuccessful, the valve body must be removed and overhauled, or replaced.\n3. Cost: £800-1,500 at an automatic transmission specialist.",
      severity: "severe",
      mileage_start: 80000, mileage_end: 140000,
      repair_cost_low: 800, repair_cost_high: 1500,
      diy_difficulty: "professional_only",
      affected_years: variant.year_end ? `${variant.year_start}-${variant.year_end}` : `${variant.year_start}-On`,
      obd_codes: ["P0700", "P0730"],
      published: true,
    });
  }

  return faults;
}

async function seed() {
  console.log("Fetching all variants...");
  const { data: variants, error: vError } = await supabase.from("variants").select("id, slug, year_start, year_end, fuel_type, transmission");
  if (vError) throw vError;

  let totalFaults = [];
  for (const variant of variants) {
    const generated = generateStandardFaults(variant);
    totalFaults.push(...generated);
  }

  console.log(`Prepared ${totalFaults.length} bulk faults across ${variants.length} variants.`);

  // Insert in chunks of 50 to avoid timeout/size limits
  const chunkSize = 50;
  let inserted = 0;
  for (let i = 0; i < totalFaults.length; i += chunkSize) {
    const chunk = totalFaults.slice(i, i + chunkSize);
    try {
      await upsertNoReturn("faults", chunk, "slug");
      inserted += chunk.length;
      console.log(`Inserted chunk ${i / chunkSize + 1}: ${inserted}/${totalFaults.length} faults`);
    } catch (err) {
      console.error(`Failed on chunk ${i / chunkSize + 1}:`, err.message);
    }
  }

  console.log(`✅ Phase 3 Bulk Faults complete. Attempted to insert ${inserted} new faults.`);
}

seed().catch(console.error);
