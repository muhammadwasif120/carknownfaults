/**
 * CKF Phase 4 — MOT Intelligence Seed Script
 * Generates MOT failure rate statistics for all models in the database.
 * Run: node lib/seed-phase4-mot.mjs
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

const FAILURE_CATEGORIES = [
  "Suspension & Steering",
  "Lighting & Signalling",
  "Brakes",
  "Tyres",
  "Visibility (Wipers/Glass)",
  "Exhaust & Emissions",
  "Body & Structure (Rust)"
];

function getRandomFailureCategory(exclude = []) {
  const valid = FAILURE_CATEGORIES.filter(c => !exclude.includes(c));
  return valid[Math.floor(Math.random() * valid.length)];
}

async function seed() {
  console.log("Fetching models...");
  const { data: models, error } = await supabase.from("models").select("id, name, year_start, year_end");
  if (error) throw error;

  const motData = [];

  for (const model of models) {
    // Generate pass rate based loosely on vehicle age
    // Newer cars pass more often. Older cars pass less often.
    const averageYear = ((model.year_start || 2010) + (model.year_end || 2024)) / 2;
    let baseRate = 60; // 60% base
    if (averageYear > 2015) baseRate = 80;
    else if (averageYear > 2010) baseRate = 70;
    
    // Add some random variation
    const passRate = (baseRate + (Math.random() * 15)).toFixed(1); 
    const testedCount = Math.floor(Math.random() * 50000) + 10000;

    const top1 = getRandomFailureCategory();
    const top2 = getRandomFailureCategory([top1]);
    const top3 = getRandomFailureCategory([top1, top2]);

    motData.push({
      model_id: model.id,
      pass_rate: parseFloat(passRate),
      tested_count: testedCount,
      top_failure_1: top1,
      top_failure_2: top2,
      top_failure_3: top3,
    });
  }

  console.log(`Generated MOT data for ${motData.length} models. Upserting...`);

  // Insert in chunks
  const chunkSize = 20;
  let inserted = 0;
  for (let i = 0; i < motData.length; i += chunkSize) {
    const chunk = motData.slice(i, i + chunkSize);
    try {
      await upsertNoReturn("mot_stats", chunk, "model_id");
      inserted += chunk.length;
    } catch (err) {
      console.error(`Failed on chunk ${i / chunkSize + 1}:`, err.message);
    }
  }

  console.log(`✅ Phase 4 MOT Seeding complete. Upserted ${inserted} records.`);
}

seed().catch(console.error);
