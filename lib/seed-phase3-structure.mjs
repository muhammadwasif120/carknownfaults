/**
 * CKF Phase 3 — Structural Expansion
 * Run: node lib/seed-phase3-structure.mjs
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

function buildModels(makes) {
  const m = slug => bySlug(makes, slug).id;
  return [
    // Seat
    { make_id: m("seat"), name: "Ibiza", slug: "ibiza", year_start: 1984, year_end: null },
    { make_id: m("seat"), name: "Leon", slug: "leon", year_start: 1999, year_end: null },
    // Honda
    { make_id: m("honda"), name: "Civic", slug: "civic", year_start: 1972, year_end: null },
    { make_id: m("honda"), name: "Jazz", slug: "jazz", year_start: 2001, year_end: null },
    { make_id: m("honda"), name: "CR-V", slug: "cr-v", year_start: 1995, year_end: null },
    // Hyundai
    { make_id: m("hyundai"), name: "ix35", slug: "ix35", year_start: 2010, year_end: 2015 },
    { make_id: m("hyundai"), name: "i30", slug: "i30", year_start: 2007, year_end: null },
    { make_id: m("hyundai"), name: "Tucson", slug: "tucson", year_start: 2004, year_end: null },
    // Kia
    { make_id: m("kia"), name: "Sportage", slug: "sportage", year_start: 1993, year_end: null },
    { make_id: m("kia"), name: "Ceed", slug: "ceed", year_start: 2006, year_end: null },
    // Mercedes-Benz
    { make_id: m("mercedes-benz"), name: "A-Class", slug: "a-class", year_start: 1997, year_end: null },
    { make_id: m("mercedes-benz"), name: "C-Class", slug: "c-class", year_start: 1993, year_end: null },
    { make_id: m("mercedes-benz"), name: "E-Class", slug: "e-class", year_start: 1993, year_end: null },
    // Toyota
    { make_id: m("toyota"), name: "Aygo", slug: "aygo", year_start: 2005, year_end: 2021 },
    { make_id: m("toyota"), name: "Auris", slug: "auris", year_start: 2006, year_end: 2018 },
    { make_id: m("toyota"), name: "RAV4", slug: "rav4", year_start: 1994, year_end: null },
    // Mazda
    { make_id: m("mazda"), name: "Mazda3", slug: "mazda3", year_start: 2003, year_end: null },
    { make_id: m("mazda"), name: "Mazda6", slug: "mazda6", year_start: 2002, year_end: null },
    { make_id: m("mazda"), name: "CX-5", slug: "cx-5", year_start: 2012, year_end: null },
    // Volvo
    { make_id: m("volvo"), name: "V40", slug: "v40", year_start: 2012, year_end: 2019 },
    { make_id: m("volvo"), name: "XC60", slug: "xc60", year_start: 2008, year_end: null },
  ];
}

function buildVariants(models) {
  const m = slug => bySlug(models, slug).id;
  return [
    // Seat
    {
      model_id: m("ibiza"), name: "Mk4 1.2 TSI", slug: "ibiza-mk4-12-tsi",
      engine: "1.2 TSI 105bhp", year_start: 2008, year_end: 2017,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol",
      description: "Sharp styling and VW underpinnings make it a great first car, but the 1.2 TSI suffers from timing chain stretch."
    },
    {
      model_id: m("leon"), name: "Mk2 FR 2.0 TDI", slug: "leon-mk2-fr-20tdi",
      engine: "2.0 TDI PD 170bhp", year_start: 2006, year_end: 2012,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
      description: "The FR model with the 170bhp PD engine is very quick, but notorious for DPF blockage and injector failure."
    },
    // Honda
    {
      model_id: m("civic"), name: "Mk8 2.2 i-CTDi", slug: "civic-mk8-22-cdti",
      engine: "2.2 i-CTDi 138bhp", year_start: 2006, year_end: 2011,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
      description: "Honda's first in-house diesel engine. Incredibly smooth and reliable, though plagued by slipping clutches and exhaust manifold cracks."
    },
    {
      model_id: m("jazz"), name: "Mk2 1.4 i-VTEC", slug: "jazz-mk2-14",
      engine: "1.4 i-VTEC 99bhp", year_start: 2008, year_end: 2015,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol",
      description: "Legendary Honda reliability in a practical package. The main issues are usually CVT judder (if auto) and sticking brake calipers."
    },
    {
      model_id: m("cr-v"), name: "Mk3 2.2 i-DTEC", slug: "crv-mk3-22-idtec",
      engine: "2.2 i-DTEC 148bhp", year_start: 2007, year_end: 2012,
      body_type: "SUV", transmission: "Manual", fuel_type: "Diesel",
      description: "A highly practical SUV. The i-DTEC engine resolved the manifold issues of the earlier i-CTDi, but DPF blockages are common."
    },
    // Hyundai
    {
      model_id: m("ix35"), name: "2.0 CRDi", slug: "ix35-20-crdi",
      engine: "2.0 CRDi 134bhp", year_start: 2010, year_end: 2015,
      body_type: "SUV", transmission: "Manual", fuel_type: "Diesel",
      description: "A solid and affordable family SUV. AWD versions can suffer from transfer case spline failure."
    },
    {
      model_id: m("i30"), name: "Mk1 1.6 CRDi", slug: "i30-mk1-16-crdi",
      engine: "1.6 CRDi 113bhp", year_start: 2007, year_end: 2012,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
      description: "A robust and cheap alternative to a Golf. Usually very reliable, but watch for clutch wear and EPS column clunks."
    },
    {
      model_id: m("tucson"), name: "Mk3 1.7 CRDi", slug: "tucson-mk3-17-crdi",
      engine: "1.7 CRDi 114bhp", year_start: 2015, year_end: 2021,
      body_type: "SUV", transmission: "Manual", fuel_type: "Diesel",
      description: "A stylish and popular modern SUV. DCT automatic models suffer from dual-clutch actuator wear."
    },
    // Kia
    {
      model_id: m("sportage"), name: "Mk3 1.7 CRDi", slug: "sportage-mk3-17-crdi",
      engine: "1.7 CRDi 114bhp", year_start: 2010, year_end: 2015,
      body_type: "SUV", transmission: "Manual", fuel_type: "Diesel",
      description: "Huge seller in the UK. Generally reliable but the 1.7 CRDi can suffer from turbo lag and occasional fuel filter housing leaks."
    },
    {
      model_id: m("ceed"), name: "Mk2 1.6 CRDi", slug: "ceed-mk2-16-crdi",
      engine: "1.6 CRDi 126bhp", year_start: 2012, year_end: 2018,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
      description: "Excellent warranty and build quality. Check for DPF issues if driven purely in the city."
    },
    // Mercedes
    {
      model_id: m("a-class"), name: "W176 A200d", slug: "w176-a200d",
      engine: "2.1 OM651 134bhp", year_start: 2012, year_end: 2018,
      body_type: "Hatchback", transmission: "Automatic", fuel_type: "Diesel",
      description: "A premium hatch. The OM651 diesel is noisy but tough, though known for timing chain stretch and water pump leaks."
    },
    {
      model_id: m("c-class"), name: "W204 C220 CDI", slug: "w204-c220-cdi",
      engine: "2.1 OM651 168bhp", year_start: 2007, year_end: 2014,
      body_type: "Saloon", transmission: "Automatic", fuel_type: "Diesel",
      description: "A hugely popular executive saloon. Early OM651 engines had massive Delphi injector failures resulting in a global recall."
    },
    {
      model_id: m("e-class"), name: "W212 E220 CDI", slug: "w212-e220-cdi",
      engine: "2.1 OM651 168bhp", year_start: 2009, year_end: 2016,
      body_type: "Saloon", transmission: "Automatic", fuel_type: "Diesel",
      description: "The definitive taxi/executive car. Incredibly robust but high mileage brings DPF, EGR, and rear air suspension issues."
    },
    // Toyota
    {
      model_id: m("aygo"), name: "Mk1 1.0", slug: "aygo-mk1-10",
      engine: "1.0 VVT-i 68bhp", year_start: 2005, year_end: 2014,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol",
      description: "The ultimate cheap city car. Very reliable engine, but plagued by severe water leaks into the boot and footwells."
    },
    {
      model_id: m("auris"), name: "Mk1 1.6 V-Matic", slug: "auris-mk1-16",
      engine: "1.6 Valvematic 132bhp", year_start: 2006, year_end: 2012,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol",
      description: "Dull but dependable. Beware of semi-automatic MMT gearbox failures."
    },
    {
      model_id: m("rav4"), name: "Mk3 2.2 D-CAT", slug: "rav4-mk3-22-dcat",
      engine: "2.2 D-CAT 175bhp", year_start: 2006, year_end: 2012,
      body_type: "SUV", transmission: "Manual", fuel_type: "Diesel",
      description: "The D-CAT engine is powerful but extremely problematic. Head gasket failures and blocked fifth injectors are very common."
    },
    // Mazda
    {
      model_id: m("mazda3"), name: "Mk2 1.6D", slug: "mazda3-mk2-16d",
      engine: "1.6 MZ-CD (PSA HDi) 115bhp", year_start: 2009, year_end: 2013,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
      description: "Great chassis paired with the PSA 1.6 HDi engine. Suffers from the same turbo oil starvation issues as Peugeot/Ford."
    },
    {
      model_id: m("mazda6"), name: "Mk2 2.2D", slug: "mazda6-mk2-22d",
      engine: "2.2 MZR-CD 163bhp", year_start: 2007, year_end: 2012,
      body_type: "Saloon", transmission: "Manual", fuel_type: "Diesel",
      description: "A lovely driving car ruined by a terrible diesel engine. The 2.2 suffers from fatal oil pickup starvation and timing chain stretch."
    },
    {
      model_id: m("cx-5"), name: "Mk1 2.2D SkyActiv", slug: "cx5-mk1-22d",
      engine: "2.2 SkyActiv-D 150bhp", year_start: 2012, year_end: 2017,
      body_type: "SUV", transmission: "Automatic", fuel_type: "Diesel",
      description: "Extremely popular SUV. The 2.2 SkyActiv diesel is notorious for camshaft wear, vacuum pump failure, and severe carbon buildup."
    },
    // Volvo
    {
      model_id: m("v40"), name: "D2 (1.6 PSA)", slug: "v40-d2-16",
      engine: "1.6 D2 113bhp", year_start: 2012, year_end: 2015,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
      description: "A very safe and stylish hatchback. The early D2 uses the PSA 1.6 HDi engine, which is prone to injector leaks."
    },
    {
      model_id: m("xc60"), name: "Mk1 D5", slug: "xc60-mk1-d5",
      engine: "2.4 D5 5-cylinder 212bhp", year_start: 2008, year_end: 2017,
      body_type: "SUV", transmission: "Automatic", fuel_type: "Diesel",
      description: "The 5-cylinder D5 is a legendary engine, but the auxiliary belt tensioner can fail, throwing the belt into the timing belt and destroying the engine."
    }
  ];
}

async function seed() {
  console.log("1. Fetching MAKES...");
  const { data: makes, error: makesErr } = await supabase.from("makes").select("id, slug");
  if (makesErr) throw makesErr;

  console.log("2. Building & Upserting MODELS...");
  const modelsData = buildModels(makes);
  await upsertNoReturn("models", modelsData, "make_id, slug");

  console.log("3. Fetching updated MODELS...");
  const { data: allModels, error: modErr } = await supabase.from("models").select("id, slug");
  if (modErr) throw modErr;

  console.log("4. Building & Upserting VARIANTS...");
  const variantsData = buildVariants(allModels);
  await upsertNoReturn("variants", variantsData, "model_id, slug");

  console.log(`✅ Phase 3 Structure complete. Added ${modelsData.length} models and ${variantsData.length} variants.`);
}

seed().catch(console.error);
