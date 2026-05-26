/**
 * CKF Phase 5 — Buyer Intelligence Seed Script
 * Generates Buyer's Guides and Repair Scores for all models.
 * Run: node lib/seed-phase5-buyers.mjs
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

async function seed() {
  console.log("Fetching models...");
  const { data: models, error } = await supabase.from("models").select("id, name, slug, makes(slug, name)");
  if (error) throw error;

  const guides = [];

  for (const model of models) {
    const makeName = model.makes.name;
    let repairScore = 70;
    let reliability = 3;
    let runningCosts = 3;

    // Simulate realistic logic based on Make
    if (["Toyota", "Honda", "Kia", "Hyundai"].includes(makeName)) {
      repairScore = Math.floor(Math.random() * 15) + 80; // 80-95
      reliability = 5;
      runningCosts = 5;
    } else if (["BMW", "Mercedes-Benz", "Audi", "Volvo"].includes(makeName)) {
      repairScore = Math.floor(Math.random() * 20) + 40; // 40-60
      reliability = 3;
      runningCosts = 2;
    } else if (["Ford", "Vauxhall", "Seat", "Volkswagen"].includes(makeName)) {
      repairScore = Math.floor(Math.random() * 20) + 65; // 65-85
      reliability = 4;
      runningCosts = 4;
    }

    guides.push({
      model_id: model.id,
      repair_score: repairScore,
      reliability_rating: reliability,
      running_costs_rating: runningCosts,
      verdict: `The ${makeName} ${model.name} is a hugely popular choice on the UK used market. While it has some well-documented common faults, regular servicing and preventative maintenance mitigate the worst of the issues. Its repairability score of ${repairScore}/100 reflects the general availability of parts and ease of access for independent mechanics.`,
      what_to_look_for: "- Full service history (crucial for timing chains/belts)\n- Smooth gear changes on automatic variants\n- Evidence of water ingress in the boot or footwells\n- Dashboard warning lights on cold startup",
      what_to_avoid: "- Ex-rental or heavily abused examples\n- Cars with 'lifetime' gearbox oil that has never been changed\n- Specific early-year diesel engines without DPF/EGR history",
    });
  }

  console.log(`Generated Buyer Guides for ${guides.length} models. Upserting...`);

  const chunkSize = 20;
  let inserted = 0;
  for (let i = 0; i < guides.length; i += chunkSize) {
    const chunk = guides.slice(i, i + chunkSize);
    try {
      await upsertNoReturn("buyer_guides", chunk, "model_id");
      inserted += chunk.length;
    } catch (err) {
      console.error(`Failed on chunk ${i / chunkSize + 1}:`, err.message);
    }
  }

  console.log(`✅ Phase 5 Buyer Guides Seeding complete. Upserted ${inserted} records.`);
}

seed().catch(console.error);
