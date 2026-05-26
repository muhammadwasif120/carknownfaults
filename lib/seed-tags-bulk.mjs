/**
 * CKF — Bulk Tag Assignment
 * Reads every published fault title+summary and assigns tags via keyword matching.
 * Safe to re-run — uses ignoreDuplicates on fault_tags.
 */
import { createClient } from "@supabase/supabase-js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const ws = require("ws");

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false }, realtime: { transport: ws } }
);

// Keyword → tag slug mapping (order matters — more specific first)
const RULES = [
  { tag: "timing-chain",   keywords: ["timing chain", "chain tensioner", "chain stretch", "chain rattle", "chain noise", "chain whip"] },
  { tag: "timing-belt",    keywords: ["timing belt", "cam belt", "cambelt"] },
  { tag: "cam-follower",   keywords: ["cam follower", "fuel pump follower", "hpfp follower", "pump follower"] },
  { tag: "head-gasket",    keywords: ["head gasket", "headgasket", "blown head", "cylinder head gasket"] },
  { tag: "egr",            keywords: ["egr valve", "egr cooler", "egr failure", "exhaust gas recirculation", "egr system"] },
  { tag: "dpf",            keywords: ["dpf", "diesel particulate", "particulate filter", "regen", "regeneration failure"] },
  { tag: "turbo",          keywords: ["turbocharger", "turbo failure", "turbo bearing", "boost leak", "boost pressure", "wastegate", "vnt actuator", "intercooler", "underboost"] },
  { tag: "injectors",      keywords: ["injector", "fuel injection", "fuel pump", "hpfp", "common rail", "glow plug", "injector seal", "return pipe", "piezoelectric"] },
  { tag: "flywheel",       keywords: ["dual mass flywheel", "dmf", "flywheel failure", "flywheel wear"] },
  { tag: "clutch",         keywords: ["clutch wear", "clutch failure", "clutch slip", "clutch judder", "biting point", "clutch actuator", "edc actuator", "clutch kit"] },
  { tag: "gearbox",        keywords: ["gearbox", "dsg", "cvt", "transmission", "dq200", "dq250", "automatic gearbox", "gear selection", "diff ", "differential"] },
  { tag: "cooling",        keywords: ["coolant", "overheating", "thermostat", "radiator", "water pump", "cooling system", "coolant loss", "coolant leak", "temperature", "antifreeze"] },
  { tag: "engine",         keywords: ["piston", "cylinder", "camshaft", "crankshaft", "oil consumption", "engine failure", "engine damage", "engine oil", "compression", "misfire", "misfires", "glow plug", "swirl flap", "valve", "carbon build", "intake manifold", "throttle body"] },
  { tag: "swirl-flaps",    keywords: ["swirl flap", "swirl plate", "intake flap"] },
  { tag: "carbon-buildup", keywords: ["carbon build", "carbon deposit", "carbon clean", "walnut blast", "carbon fouling", "intake carbon"] },
  { tag: "suspension",     keywords: ["suspension", "shock absorber", "strut", "spring", "control arm", "wishbone", "subframe", "bush ", "bushes", "trailing arm", "torsion beam", "axle beam", "wheel bearing", "knocking from", "clunking from"] },
  { tag: "wheel-bearing",  keywords: ["wheel bearing", "hub bearing", "bearing failure", "bearing wear", "droning noise", "humming noise"] },
  { tag: "steering",       keywords: ["power steering", "steering rack", "steering column", "eps failure", "electric steering", "steering heavy", "steering noise", "steering wheel warning"] },
  { tag: "power-steering", keywords: ["power steering pump", "power steering failure", "eps motor", "steering pump", "hydraulic steering"] },
  { tag: "brakes",         keywords: ["brake", "braking", "abs pump", "brake servo", "brake pad", "brake disc", "handbrake", "parking brake"] },
  { tag: "rust",           keywords: ["corrosion", "rust", "sill rust", "arch rust", "bodywork", "underbody", "underseal", "waxoyl"] },
  { tag: "electrics",      keywords: ["electrical", "electrics", "sensor fault", "ecu", "bcm", "module failure", "wiring", "short circuit", "battery drain", "alternator"] },
];

async function seed() {
  console.log("CKF — Bulk Tag Assignment\n");

  // Load all tags
  const { data: tags, error: tErr } = await sb.from("tags").select("id, slug");
  if (tErr) throw new Error(tErr.message);
  const tagBySlug = Object.fromEntries(tags.map(t => [t.slug, t.id]));

  // Load all published faults
  const { data: faults, error: fErr } = await sb.from("faults").select("id, title, summary, slug").eq("published", true);
  if (fErr) throw new Error(fErr.message);
  console.log(`Loaded ${faults.length} published faults\n`);

  // Load existing fault_tags to avoid duplicates
  const { data: existing } = await sb.from("fault_tags").select("fault_id, tag_id");
  const existingSet = new Set(existing.map(ft => ft.fault_id + "|" + ft.tag_id));

  const toInsert = [];
  let matchedFaults = 0;

  for (const fault of faults) {
    const text = (fault.title + " " + fault.summary).toLowerCase();
    const matched = new Set();

    for (const rule of RULES) {
      if (rule.keywords.some(kw => text.includes(kw))) {
        const tagId = tagBySlug[rule.tag];
        if (tagId) matched.add(rule.tag);
      }
    }

    if (matched.size > 0) matchedFaults++;

    for (const tagSlug of matched) {
      const tagId = tagBySlug[tagSlug];
      const key = fault.id + "|" + tagId;
      if (!existingSet.has(key)) {
        toInsert.push({ fault_id: fault.id, tag_id: tagId });
        existingSet.add(key);
      }
    }
  }

  console.log(`Matched tags on ${matchedFaults}/${faults.length} faults`);
  console.log(`New tag links to insert: ${toInsert.length}`);

  if (toInsert.length === 0) {
    console.log("\nNothing new to insert.");
    return;
  }

  // Insert in chunks of 500
  const CHUNK = 500;
  let inserted = 0;
  for (let i = 0; i < toInsert.length; i += CHUNK) {
    const chunk = toInsert.slice(i, i + CHUNK);
    const { error } = await sb.from("fault_tags").upsert(chunk, { onConflict: "fault_id,tag_id", ignoreDuplicates: true });
    if (error) throw new Error(error.message);
    inserted += chunk.length;
    process.stdout.write(`\rInserted ${inserted}/${toInsert.length} links...`);
  }

  // Final counts
  const { count: total } = await sb.from("fault_tags").select("*", { count: "exact", head: true });
  const { count: taggedCount } = await sb.from("faults").select("fault_tags(fault_id)", { count: "exact", head: true }).not("fault_tags", "is", null);

  console.log(`\n\nTag links in DB: ${total}`);
  console.log("Done.");
}

seed().catch(e => { console.error("Error:", e.message); process.exit(1); });
