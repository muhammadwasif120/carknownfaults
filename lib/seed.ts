/**
 * Seed script — run with:
 *   npx ts-node --esm lib/seed.ts
 * OR paste the SQL below directly into Supabase SQL editor.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, serviceKey);

async function seed() {
  console.log("Seeding makes…");

  const makeData = [
    { name: "Ford", slug: "ford", country: "UK" },
    { name: "Volkswagen", slug: "volkswagen", country: "Germany" },
    { name: "BMW", slug: "bmw", country: "Germany" },
    { name: "Vauxhall", slug: "vauxhall", country: "UK" },
    { name: "Toyota", slug: "toyota", country: "Japan" },
    { name: "Audi", slug: "audi", country: "Germany" },
    { name: "Nissan", slug: "nissan", country: "Japan" },
    { name: "Mercedes-Benz", slug: "mercedes-benz", country: "Germany" },
    { name: "Peugeot", slug: "peugeot", country: "France" },
    { name: "Renault", slug: "renault", country: "France" },
    { name: "Honda", slug: "honda", country: "Japan" },
    { name: "Hyundai", slug: "hyundai", country: "South Korea" },
    { name: "Kia", slug: "kia", country: "South Korea" },
    { name: "Mazda", slug: "mazda", country: "Japan" },
    { name: "Volvo", slug: "volvo", country: "Sweden" },
  ];

  const { data: makes, error: makesError } = await supabase
    .from("makes")
    .upsert(makeData, { onConflict: "slug" })
    .select();

  if (makesError) { console.error("Makes error:", makesError.message); return; }
  console.log(`Inserted ${makes?.length} makes`);

  const ford = makes?.find((m) => m.slug === "ford");
  if (!ford) { console.error("Ford not found"); return; }

  console.log("Seeding Ford models…");
  const modelData = [
    { make_id: ford.id, name: "Focus", slug: "focus", year_start: 2004, year_end: null },
    { make_id: ford.id, name: "Fiesta", slug: "fiesta", year_start: 1976, year_end: 2023 },
    { make_id: ford.id, name: "Mondeo", slug: "mondeo", year_start: 1993, year_end: 2022 },
    { make_id: ford.id, name: "Transit", slug: "transit", year_start: 1965, year_end: null },
    { make_id: ford.id, name: "Kuga", slug: "kuga", year_start: 2008, year_end: null },
  ];

  const { data: models, error: modelsError } = await supabase
    .from("models")
    .upsert(modelData, { onConflict: "make_id,slug" })
    .select();

  if (modelsError) { console.error("Models error:", modelsError.message); return; }
  const focus = models?.find((m) => m.slug === "focus");
  if (!focus) { console.error("Focus not found"); return; }

  console.log("Seeding Focus variants…");
  const variantData = [
    { model_id: focus.id, name: "Mk2 1.6 TDCi", slug: "mk2-16-tdci", engine: "1.6 TDCi 110bhp", year_start: 2004, year_end: 2011, body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel" },
    { model_id: focus.id, name: "Mk2 1.8 TDCi", slug: "mk2-18-tdci", engine: "1.8 TDCi 115bhp", year_start: 2004, year_end: 2011, body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel" },
    { model_id: focus.id, name: "Mk3 1.0 EcoBoost", slug: "mk3-10-ecoboost", engine: "1.0 EcoBoost 125bhp", year_start: 2011, year_end: 2018, body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol" },
    { model_id: focus.id, name: "Mk3 2.0 TDCi", slug: "mk3-20-tdci", engine: "2.0 TDCi 163bhp", year_start: 2011, year_end: 2018, body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel" },
  ];

  const { data: variants, error: variantsError } = await supabase
    .from("variants")
    .upsert(variantData, { onConflict: "model_id,slug" })
    .select();

  if (variantsError) { console.error("Variants error:", variantsError.message); return; }
  const mk2 = variants?.find((v) => v.slug === "mk2-16-tdci");
  if (!mk2) { console.error("Mk2 1.6 TDCi not found"); return; }

  console.log("Seeding faults for Mk2 1.6 TDCi…");
  const faultData = [
    {
      variant_id: mk2.id,
      title: "EGR Valve Failure",
      slug: "egr-valve-failure",
      summary: "The EGR valve is a common failure on the 1.6 TDCi engine, causing power loss, rough idle, and excessive smoke.",
      symptoms: "- Loss of power, especially under load\n- Rough idle\n- Black or blue smoke from exhaust\n- EML warning light\n- OBD code P0401",
      cause: "Carbon deposits build up inside the EGR valve over time, eventually causing it to stick open or closed. More common on city/short-trip driving where the engine rarely reaches full operating temperature.",
      fix: "1. Clean the EGR valve with EGR cleaner spray (DIY, 2-3 hours)\n2. Replace EGR valve with OEM or quality aftermarket part\n3. Consider an EGR blanking plate as a permanent solution (note: may affect emissions testing in some regions)",
      severity: "moderate",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 80, repair_cost_high: 300,
      diy_difficulty: "moderate",
      affected_years: "2005-2011",
      obd_codes: ["P0401", "P0403"],
      published: true,
    },
    {
      variant_id: mk2.id,
      title: "Dual Mass Flywheel (DMF) Failure",
      slug: "dual-mass-flywheel-failure",
      summary: "DMF failure is one of the most expensive known faults on the 1.6 TDCi. Typically requires replacement of flywheel and clutch together.",
      symptoms: "- Rattling noise from gearbox at idle\n- Juddering on clutch engagement\n- Vibration through gear lever",
      cause: "The DMF absorbs drivetrain vibrations but wears out, especially with high mileage or aggressive driving. Exacerbated by towing.",
      fix: "Full flywheel and clutch replacement. This is not a DIY job for most. Requires gearbox removal. Always replace clutch and DMF together.",
      severity: "severe",
      mileage_start: 80000, mileage_end: 150000,
      repair_cost_low: 600, repair_cost_high: 1200,
      diy_difficulty: "professional_only",
      affected_years: "2004-2011",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: mk2.id,
      title: "Turbocharger Failure",
      slug: "turbocharger-failure",
      summary: "Turbo failure on the 1.6 TDCi is common at higher mileages, often caused by oil starvation or sludge blockage.",
      symptoms: "- Loss of boost / power\n- Loud whining from turbo\n- Blue smoke on acceleration\n- Oil in intake hoses",
      cause: "Oil feed pipe to turbo can block with sludge, starving the turbo bearings. More common if oil changes have been infrequent.",
      fix: "1. Check oil feed pipe for blockage first\n2. Replace turbo if bearings are worn\n3. Always flush oil system and use fresh oil on new turbo install",
      severity: "severe",
      mileage_start: 100000, mileage_end: 180000,
      repair_cost_low: 400, repair_cost_high: 900,
      diy_difficulty: "hard",
      affected_years: "2004-2011",
      obd_codes: ["P0299"],
      published: true,
    },
  ];

  const { error: faultsError } = await supabase
    .from("faults")
    .upsert(faultData, { onConflict: "slug" });

  if (faultsError) { console.error("Faults error:", faultsError.message); return; }
  console.log("Inserted 3 faults");

  console.log("Seeding tags…");
  const tagData = [
    "EGR", "DPF", "Turbo", "Flywheel", "Clutch",
    "Timing Chain", "Gearbox", "Suspension", "Electrics",
    "Rust", "Engine", "Brakes", "Steering", "Cooling",
  ].map((name) => ({ name, slug: name.toLowerCase().replace(/\s+/g, "-") }));

  const { error: tagsError } = await supabase.from("tags").upsert(tagData, { onConflict: "slug" });
  if (tagsError) { console.error("Tags error:", tagsError.message); }
  else console.log("Tags seeded");

  console.log("\n✅ Seed complete!");
}

seed().catch(console.error);
