/**
 * CKF Phase 6 — OBD Library Seed Script
 * Generates the top OBD-II diagnostic trouble codes.
 * Run: node lib/seed-phase6-obd.mjs
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

const codes = [
  {
    code: "P0300",
    title: "Random/Multiple Cylinder Misfire Detected",
    description: "The Engine Control Module (ECM) has detected a misfire occurring randomly or across multiple cylinders. A misfire means the air/fuel mixture in the cylinder is not burning properly.",
    symptoms: "- Flashing Check Engine Light (CEL)\n- Rough idle or shaking\n- Hesitation or jerking under acceleration\n- Strong smell of unburnt fuel from the exhaust",
    causes: "- Worn or fouled spark plugs\n- Failing ignition coil packs\n- Vacuum leaks\n- Low fuel pressure or failing fuel injectors",
    severity: "severe"
  },
  {
    code: "P0171",
    title: "System Too Lean (Bank 1)",
    description: "The engine is running 'lean' on Bank 1, meaning there is too much air and not enough fuel in the combustion mixture.",
    symptoms: "- Check Engine Light illuminated\n- Lack of power and sluggish acceleration\n- Rough or high idle\n- Poor fuel economy",
    causes: "- Vacuum leak past the Mass Airflow Sensor (MAF)\n- Dirty or failing MAF sensor\n- Weak fuel pump or clogged fuel filter\n- Faulty oxygen (O2) sensor",
    severity: "moderate"
  },
  {
    code: "P0420",
    title: "Catalyst System Efficiency Below Threshold (Bank 1)",
    description: "The downstream oxygen sensor is detecting that the catalytic converter on Bank 1 is not operating at maximum efficiency to reduce emissions.",
    symptoms: "- Check Engine Light illuminated\n- Failed emissions test\n- Smell of sulfur or 'rotten eggs' from the exhaust (if completely failed)",
    causes: "- Failing or degraded catalytic converter\n- Exhaust leak before the O2 sensor\n- Faulty upstream or downstream O2 sensor\n- Prolonged engine misfires damaging the catalyst",
    severity: "moderate"
  },
  {
    code: "P0128",
    title: "Coolant Thermostat (Coolant Temp Below Regulating Temp)",
    description: "The engine is not reaching its optimal operating temperature within the expected timeframe, usually because the thermostat is stuck open.",
    symptoms: "- Temperature gauge drops when driving at high speeds\n- Heater blows lukewarm air instead of hot\n- Noticeable drop in fuel economy (MPG)",
    causes: "- Thermostat stuck in the open position\n- Failing engine coolant temperature (ECT) sensor\n- Low engine coolant level",
    severity: "minor"
  },
  {
    code: "P0620",
    title: "Generator Control Circuit Malfunction",
    description: "The Engine Control Module (ECM) has detected a fault in the alternator's control circuit, meaning the battery may not be charging correctly.",
    symptoms: "- Red battery warning light on dashboard\n- Electrical systems dimming or shutting down\n- Vehicle fails to start (dead battery)",
    causes: "- Failing alternator or voltage regulator\n- Broken or slipping auxiliary serpentine belt\n- Corroded battery cables or poor ground connection",
    severity: "severe"
  },
  {
    code: "P0380",
    title: "Glow Plug/Heater Circuit 'A' Malfunction",
    description: "The ECM has detected a malfunction in the glow plug heating circuit, which is required to help ignite diesel fuel when the engine is cold.",
    symptoms: "- Hard starting or failure to start in cold weather\n- White smoke from exhaust on startup\n- Flashing glow plug or coil light on the dashboard",
    causes: "- Burned out or damaged glow plugs\n- Faulty glow plug relay or control module\n- Blown fuse in the glow plug circuit",
    severity: "moderate"
  },
  {
    code: "P0700",
    title: "Transmission Control System Malfunction",
    description: "This is an informational code indicating that the Transmission Control Module (TCM) has detected a fault and has requested the ECM to turn on the Check Engine Light.",
    symptoms: "- Check Engine Light illuminated\n- Transmission shifting harshly or slipping\n- Vehicle goes into 'Limp Mode' (stuck in one gear)",
    causes: "- Internal transmission failure (valve body, solenoids)\n- Low transmission fluid\n- Faulty wiring between the ECM and TCM",
    severity: "severe"
  },
  {
    code: "P0401",
    title: "Exhaust Gas Recirculation (EGR) Flow Insufficient",
    description: "The ECM is detecting that not enough exhaust gas is being recirculated back into the intake manifold by the EGR system.",
    symptoms: "- Check Engine Light illuminated\n- Increased combustion temperatures (knocking or pinging sound)\n- Failed emissions test for NOx",
    causes: "- Clogged or carbon-blocked EGR valve\n- Blocked EGR cooler or internal passages\n- Failed EGR vacuum solenoid or position sensor",
    severity: "moderate"
  },
  {
    code: "P2002",
    title: "Diesel Particulate Filter (DPF) Efficiency Below Threshold",
    description: "The pressure sensors across the DPF indicate that the filter is clogged with soot and ash, and is no longer able to regenerate efficiently.",
    symptoms: "- DPF warning light illuminated\n- Drastic loss of engine power (Limp Mode)\n- Increased fuel consumption",
    causes: "- Frequent short, low-speed journeys preventing active regeneration\n- Faulty DPF pressure difference sensor\n- Clogged or heavily loaded Diesel Particulate Filter",
    severity: "severe"
  },
  {
    code: "P0234",
    title: "Turbo/Supercharger Overboost Condition",
    description: "The manifold absolute pressure (MAP) sensor is detecting boost pressure from the turbocharger that exceeds the safe maximum limit set by the ECM.",
    symptoms: "- Sudden, violent loss of power under heavy acceleration (Limp Mode)\n- Check Engine Light illuminated\n- Possible engine knocking",
    causes: "- Sticking Variable Geometry Turbo (VGT) vanes due to carbon buildup\n- Faulty boost control solenoid (N75 valve)\n- Split or damaged vacuum lines to the turbo actuator",
    severity: "severe"
  }
];

async function seed() {
  console.log(`Prepared ${codes.length} OBD-II codes. Upserting...`);

  const chunkSize = 50;
  let inserted = 0;
  for (let i = 0; i < codes.length; i += chunkSize) {
    const chunk = codes.slice(i, i + chunkSize);
    try {
      await upsertNoReturn("obd_codes", chunk, "code");
      inserted += chunk.length;
    } catch (err) {
      console.error(`Failed on chunk ${i / chunkSize + 1}:`, err.message);
    }
  }

  console.log(`✅ Phase 6 OBD Seeding complete. Upserted ${inserted} records.`);
}

seed().catch(console.error);
