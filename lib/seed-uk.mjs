/**
 * CKF — UK Market Seed Script (Phase 1)
 * Top 20 priority UK cars by search volume + repairability
 *
 * Run with:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node lib/seed-uk.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const ws = require("ws");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
  realtime: { transport: ws },
});

// ─── HELPERS ───────────────────────────────────────────────────────────────

async function upsert(table, rows, conflict) {
  const { data, error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: conflict })
    .select();
  if (error) throw new Error(`[${table}] ${error.message}`);
  return data;
}

async function upsertNoReturn(table, rows, conflict) {
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: conflict, ignoreDuplicates: true });
  if (error) throw new Error(`[${table}] ${error.message}`);
}

function bySlug(arr, slug) {
  const r = arr.find((x) => x.slug === slug);
  if (!r) throw new Error(`Could not find slug "${slug}" in result set`);
  return r;
}

// ─── MAKES ─────────────────────────────────────────────────────────────────

const MAKES = [
  { name: "Ford",           slug: "ford",           country: "UK"          },
  { name: "Vauxhall",       slug: "vauxhall",       country: "UK"          },
  { name: "Volkswagen",     slug: "volkswagen",     country: "Germany"     },
  { name: "BMW",            slug: "bmw",             country: "Germany"     },
  { name: "Audi",           slug: "audi",            country: "Germany"     },
  { name: "Nissan",         slug: "nissan",          country: "Japan"       },
  { name: "Peugeot",        slug: "peugeot",         country: "France"      },
  { name: "Renault",        slug: "renault",         country: "France"      },
  { name: "Mini",           slug: "mini",            country: "UK"          },
  { name: "Land Rover",     slug: "land-rover",      country: "UK"          },
  { name: "Skoda",          slug: "skoda",           country: "Czech Republic" },
  { name: "Toyota",         slug: "toyota",          country: "Japan"       },
  { name: "Honda",          slug: "honda",           country: "Japan"       },
  { name: "Fiat",           slug: "fiat",            country: "Italy"       },
  { name: "Seat",           slug: "seat",            country: "Spain"       },
  { name: "Hyundai",        slug: "hyundai",         country: "South Korea" },
  { name: "Kia",            slug: "kia",             country: "South Korea" },
  { name: "Mazda",          slug: "mazda",           country: "Japan"       },
  { name: "Mercedes-Benz",  slug: "mercedes-benz",   country: "Germany"     },
  { name: "Volvo",          slug: "volvo",           country: "Sweden"      },
];

// ─── MODELS ─────────────────────────────────────────────────────────────────
// Built dynamically after makes are inserted

function buildModels(makes) {
  const ford      = bySlug(makes, "ford").id;
  const vauxhall  = bySlug(makes, "vauxhall").id;
  const vw        = bySlug(makes, "volkswagen").id;
  const bmw       = bySlug(makes, "bmw").id;
  const audi      = bySlug(makes, "audi").id;
  const nissan    = bySlug(makes, "nissan").id;
  const peugeot   = bySlug(makes, "peugeot").id;
  const renault   = bySlug(makes, "renault").id;
  const mini      = bySlug(makes, "mini").id;
  const landrover = bySlug(makes, "land-rover").id;
  const skoda     = bySlug(makes, "skoda").id;
  const toyota    = bySlug(makes, "toyota").id;
  const fiat      = bySlug(makes, "fiat").id;

  return [
    // Ford
    { make_id: ford,      name: "Fiesta",       slug: "fiesta",       year_start: 2002, year_end: 2023 },
    { make_id: ford,      name: "Focus",        slug: "focus",        year_start: 2004, year_end: null },
    { make_id: ford,      name: "Mondeo",       slug: "mondeo",       year_start: 1993, year_end: 2022 },
    { make_id: ford,      name: "Transit",      slug: "transit",      year_start: 1965, year_end: null },
    { make_id: ford,      name: "Kuga",         slug: "kuga",         year_start: 2008, year_end: null },
    // Vauxhall
    { make_id: vauxhall,  name: "Corsa",        slug: "corsa",        year_start: 2000, year_end: null },
    { make_id: vauxhall,  name: "Astra",        slug: "astra",        year_start: 1991, year_end: null },
    { make_id: vauxhall,  name: "Insignia",     slug: "insignia",     year_start: 2008, year_end: null },
    { make_id: vauxhall,  name: "Zafira",       slug: "zafira",       year_start: 1999, year_end: 2019 },
    // VW
    { make_id: vw,        name: "Golf",         slug: "golf",         year_start: 1974, year_end: null },
    { make_id: vw,        name: "Polo",         slug: "polo",         year_start: 1975, year_end: null },
    { make_id: vw,        name: "Passat",       slug: "passat",       year_start: 1973, year_end: null },
    { make_id: vw,        name: "Tiguan",       slug: "tiguan",       year_start: 2007, year_end: null },
    // BMW
    { make_id: bmw,       name: "3 Series",     slug: "3-series",     year_start: 1975, year_end: null },
    { make_id: bmw,       name: "1 Series",     slug: "1-series",     year_start: 2004, year_end: null },
    { make_id: bmw,       name: "5 Series",     slug: "5-series",     year_start: 1972, year_end: null },
    // Audi
    { make_id: audi,      name: "A3",           slug: "a3",           year_start: 1996, year_end: null },
    { make_id: audi,      name: "A4",           slug: "a4",           year_start: 1994, year_end: null },
    { make_id: audi,      name: "Q5",           slug: "q5",           year_start: 2008, year_end: null },
    // Nissan
    { make_id: nissan,    name: "Qashqai",      slug: "qashqai",      year_start: 2006, year_end: null },
    { make_id: nissan,    name: "Juke",         slug: "juke",         year_start: 2010, year_end: null },
    { make_id: nissan,    name: "Note",         slug: "note",         year_start: 2004, year_end: null },
    // Peugeot
    { make_id: peugeot,   name: "207",          slug: "207",          year_start: 2006, year_end: 2012 },
    { make_id: peugeot,   name: "208",          slug: "208",          year_start: 2012, year_end: null },
    { make_id: peugeot,   name: "308",          slug: "308",          year_start: 2007, year_end: null },
    // Renault
    { make_id: renault,   name: "Clio",         slug: "clio",         year_start: 1990, year_end: null },
    { make_id: renault,   name: "Megane",       slug: "megane",       year_start: 1995, year_end: null },
    { make_id: renault,   name: "Scenic",       slug: "scenic",       year_start: 1996, year_end: 2023 },
    // Mini
    { make_id: mini,      name: "Hatch",        slug: "hatch",        year_start: 2001, year_end: null },
    { make_id: mini,      name: "Countryman",   slug: "countryman",   year_start: 2010, year_end: null },
    // Land Rover
    { make_id: landrover, name: "Freelander 2", slug: "freelander-2", year_start: 2006, year_end: 2015 },
    { make_id: landrover, name: "Discovery Sport", slug: "discovery-sport", year_start: 2014, year_end: null },
    { make_id: landrover, name: "Range Rover Evoque", slug: "range-rover-evoque", year_start: 2011, year_end: null },
    // Skoda
    { make_id: skoda,     name: "Octavia",      slug: "octavia",      year_start: 1996, year_end: null },
    { make_id: skoda,     name: "Fabia",        slug: "fabia",        year_start: 1999, year_end: null },
    // Toyota
    { make_id: toyota,    name: "Yaris",        slug: "yaris",        year_start: 1999, year_end: null },
    { make_id: toyota,    name: "Corolla",      slug: "corolla",      year_start: 1966, year_end: null },
    // Fiat
    { make_id: fiat,      name: "500",          slug: "500",          year_start: 2007, year_end: null },
    { make_id: fiat,      name: "Punto",        slug: "punto",        year_start: 1993, year_end: 2018 },
  ];
}

// ─── VARIANTS ───────────────────────────────────────────────────────────────

function buildVariants(models) {
  const m = (slug) => bySlug(models, slug).id;
  return [
    // ── Ford Fiesta ──────────────────────────────────────────────────────────
    {
      model_id: m("fiesta"), name: "Mk7 1.0 EcoBoost 100bhp",
      slug: "mk7-10-ecoboost-100",
      engine: "1.0 EcoBoost 100bhp", year_start: 2012, year_end: 2017,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol",
      description: "The three-cylinder EcoBoost is the defining Fiesta of its era. Light, punchy and very popular — but the timing chain is a known weakness on pre-2016 examples."
    },
    {
      model_id: m("fiesta"), name: "Mk7 1.5 TDCi 75bhp",
      slug: "mk7-15-tdci-75",
      engine: "1.5 TDCi 75bhp", year_start: 2013, year_end: 2017,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
      description: "The frugal diesel Fiesta. DPF issues are a recurring complaint on low-mileage city cars."
    },
    {
      model_id: m("fiesta"), name: "Mk6 1.25 82bhp",
      slug: "mk6-125-82",
      engine: "1.25 Duratec 82bhp", year_start: 2008, year_end: 2012,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol",
      description: "Simple, honest petrol. Extremely common in the UK — rust and worn wheel bearings are the main gremlins."
    },
    // ── Ford Focus ───────────────────────────────────────────────────────────
    {
      model_id: m("focus"), name: "Mk2 1.6 TDCi 110bhp",
      slug: "mk2-16-tdci",
      engine: "1.6 TDCi 110bhp", year_start: 2004, year_end: 2011,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
    },
    {
      model_id: m("focus"), name: "Mk3 1.0 EcoBoost 125bhp",
      slug: "mk3-10-ecoboost",
      engine: "1.0 EcoBoost 125bhp", year_start: 2011, year_end: 2018,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol",
    },
    {
      model_id: m("focus"), name: "Mk3 1.6 TDCi 115bhp",
      slug: "mk3-16-tdci",
      engine: "1.6 TDCi 115bhp", year_start: 2011, year_end: 2018,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
    },
    // ── Vauxhall Corsa D ─────────────────────────────────────────────────────
    {
      model_id: m("corsa"), name: "Corsa D 1.3 CDTi 75bhp",
      slug: "corsa-d-13-cdti",
      engine: "1.3 CDTi 75bhp", year_start: 2006, year_end: 2014,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
      description: "The 1.3 CDTi is one of the most common diesels on UK roads. EGR failure, DPF blockage and injector wear are the holy trinity of problems."
    },
    {
      model_id: m("corsa"), name: "Corsa D 1.2 85bhp",
      slug: "corsa-d-12-85",
      engine: "1.2 Twinport 85bhp", year_start: 2006, year_end: 2014,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol",
      description: "Bread-and-butter Corsa petrol. Coolant leaks, wheel bearings and power steering pumps are the weak spots."
    },
    {
      model_id: m("corsa"), name: "Corsa E 1.4 90bhp",
      slug: "corsa-e-14-90",
      engine: "1.4 90bhp", year_start: 2014, year_end: 2019,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol",
    },
    // ── Vauxhall Astra ───────────────────────────────────────────────────────
    {
      model_id: m("astra"), name: "Astra J 1.6 CDTi 110bhp",
      slug: "astra-j-16-cdti",
      engine: "1.6 CDTi 110bhp", year_start: 2012, year_end: 2015,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
      description: "The Euro-5 CDTi is notorious for timing chain and DPF issues. One of the most complained-about UK family hatchbacks."
    },
    {
      model_id: m("astra"), name: "Astra H 1.7 CDTi 100bhp",
      slug: "astra-h-17-cdti",
      engine: "1.7 CDTi 100bhp", year_start: 2004, year_end: 2010,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
    },
    // ── VW Golf ──────────────────────────────────────────────────────────────
    {
      model_id: m("golf"), name: "Mk5 2.0 TDI 140bhp",
      slug: "mk5-20-tdi-140",
      engine: "2.0 TDI 140bhp (PD)", year_start: 2004, year_end: 2009,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
      description: "The pumpe-düse 2.0 TDI is a bulletproof engine — until the cam follower destroys itself. A £15 part that causes £2,500 in damage if neglected."
    },
    {
      model_id: m("golf"), name: "Mk6 1.6 TDI 105bhp",
      slug: "mk6-16-tdi-105",
      engine: "1.6 TDI 105bhp", year_start: 2009, year_end: 2013,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
      description: "Common rail diesel but with emissions issues. DPF clogging and EGR failure are endemic, especially on urban-driven cars."
    },
    {
      model_id: m("golf"), name: "Mk7 1.4 TSI 125bhp",
      slug: "mk7-14-tsi-125",
      engine: "1.4 TSI 125bhp", year_start: 2012, year_end: 2019,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol",
      description: "The best all-round Golf for UK buyers. DSG-equipped variants suffer shudder issues; the manual is the safer choice."
    },
    // ── BMW 3 Series ─────────────────────────────────────────────────────────
    {
      model_id: m("3-series"), name: "E90 320d N47 2.0d 177bhp",
      slug: "e90-320d-n47",
      engine: "N47 2.0d 177bhp", year_start: 2007, year_end: 2012,
      body_type: "Saloon", transmission: "Manual", fuel_type: "Diesel",
      description: "The N47 engine is the most searched BMW fault on UK roads — its timing chain runs at the REAR of the engine, turning a £50 chain job into a £2,000 engine-out repair."
    },
    {
      model_id: m("3-series"), name: "F30 320d N47 2.0d 184bhp",
      slug: "f30-320d-n47",
      engine: "N47 2.0d 184bhp", year_start: 2012, year_end: 2016,
      body_type: "Saloon", transmission: "Automatic", fuel_type: "Diesel",
    },
    // ── BMW 1 Series ─────────────────────────────────────────────────────────
    {
      model_id: m("1-series"), name: "E87 118d N47 2.0d 143bhp",
      slug: "e87-118d-n47",
      engine: "N47 2.0d 143bhp", year_start: 2007, year_end: 2011,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
    },
    // ── Audi A3 ──────────────────────────────────────────────────────────────
    {
      model_id: m("a3"), name: "8P 2.0 TDI 140bhp PD",
      slug: "a3-8p-20-tdi-140",
      engine: "2.0 TDI 140bhp (PD)", year_start: 2003, year_end: 2013,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
      description: "Same PD engine as Golf Mk5. Cam follower wear is the critical check — inspect every 20,000 miles or risk total engine loss."
    },
    {
      model_id: m("a3"), name: "8V 2.0 TDI 150bhp",
      slug: "a3-8v-20-tdi-150",
      engine: "2.0 TDI 150bhp CR", year_start: 2012, year_end: 2020,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
    },
    // ── Nissan Qashqai ───────────────────────────────────────────────────────
    {
      model_id: m("qashqai"), name: "J10 1.5 dCi 106bhp",
      slug: "j10-15-dci-106",
      engine: "1.5 dCi 106bhp", year_start: 2006, year_end: 2013,
      body_type: "SUV", transmission: "Manual", fuel_type: "Diesel",
      description: "The crossover that spawned a thousand imitators. High in popularity, high in DPF failures and timing chain issues."
    },
    {
      model_id: m("qashqai"), name: "J11 1.5 dCi 110bhp",
      slug: "j11-15-dci-110",
      engine: "1.5 dCi 110bhp", year_start: 2013, year_end: 2021,
      body_type: "SUV", transmission: "Manual", fuel_type: "Diesel",
    },
    // ── Peugeot 207 ──────────────────────────────────────────────────────────
    {
      model_id: m("207"), name: "1.6 HDi 90bhp",
      slug: "207-16-hdi-90",
      engine: "1.6 HDi 90bhp", year_start: 2006, year_end: 2012,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
      description: "The PSA 1.6 HDi is an excellent engine but needs DPF care. Timing belt interval is only 60,000 miles — many UK owners miss it."
    },
    // ── Renault Clio ─────────────────────────────────────────────────────────
    {
      model_id: m("clio"), name: "Mk3 1.5 dCi 86bhp",
      slug: "clio-mk3-15-dci-86",
      engine: "1.5 dCi 86bhp", year_start: 2005, year_end: 2012,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
      description: "Renault's K9K 1.5 dCi is known for injector return pipe failure and swirl flap issues. The EDC auto clutch variant adds an expensive actuator to the list."
    },
    {
      model_id: m("clio"), name: "Mk4 0.9 TCe 90bhp",
      slug: "clio-mk4-09-tce-90",
      engine: "0.9 TCe 90bhp", year_start: 2012, year_end: 2019,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol",
    },
    // ── Mini Hatch ───────────────────────────────────────────────────────────
    {
      model_id: m("hatch"), name: "R56 Cooper S 1.6T 175bhp",
      slug: "r56-cooper-s-16t",
      engine: "1.6T N14 175bhp", year_start: 2006, year_end: 2013,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol",
      description: "The N14 engine is plagued by timing chain tensioner failure and carbon build-up. Fun to drive, expensive to maintain."
    },
    // ── Land Rover Freelander 2 ──────────────────────────────────────────────
    {
      model_id: m("freelander-2"), name: "2.2 SD4 190bhp",
      slug: "fl2-22-sd4-190",
      engine: "2.2 SD4 190bhp", year_start: 2011, year_end: 2015,
      body_type: "SUV", transmission: "Automatic", fuel_type: "Diesel",
      description: "The Freelander 2 SD4 is genuinely capable off-road. But timing belt failure and injector seal issues make regular servicing non-negotiable."
    },
    // ── Skoda Octavia ────────────────────────────────────────────────────────
    {
      model_id: m("octavia"), name: "Mk2 2.0 TDI 140bhp PD",
      slug: "octavia-mk2-20-tdi-140",
      engine: "2.0 TDI 140bhp (PD)", year_start: 2004, year_end: 2013,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Diesel",
      description: "Mechanically identical to the VW Golf Mk5 2.0 TDI. Cam follower wear is the must-check issue — often missed on service history."
    },
    // ── Toyota Yaris ─────────────────────────────────────────────────────────
    {
      model_id: m("yaris"), name: "Mk2 1.3 VVT-i 87bhp",
      slug: "yaris-mk2-13-vvti",
      engine: "1.3 VVT-i 87bhp", year_start: 2005, year_end: 2011,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol",
      description: "Exceptionally reliable by European standards. Steering rack knock and corrosion on high-mileage examples are about as bad as it gets."
    },
    // ── Fiat 500 ─────────────────────────────────────────────────────────────
    {
      model_id: m("500"), name: "1.2 69bhp",
      slug: "fiat-500-12-69",
      engine: "1.2 FIRE 69bhp", year_start: 2007, year_end: 2019,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol",
    },
    {
      model_id: m("500"), name: "0.9 TwinAir 85bhp",
      slug: "fiat-500-09-twinair",
      engine: "0.9 TwinAir 85bhp", year_start: 2010, year_end: 2019,
      body_type: "Hatchback", transmission: "Manual", fuel_type: "Petrol",
      description: "The clever TwinAir has a critical timing belt that is often overlooked by owners — and Fiat's belt intervals are shorter than most realise."
    },
  ];
}

// ─── FAULTS ─────────────────────────────────────────────────────────────────

function buildFaults(variants) {
  const v = (slug) => bySlug(variants, slug).id;
  return [

    // ════════════════════════════════════════════════════════════════════════
    // FORD FIESTA MK7 1.0 ECOBOOST
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("mk7-10-ecoboost-100"),
      title: "Timing Chain Stretch and Tensioner Failure",
      slug: "fiesta-mk7-ecoboost-timing-chain-failure",
      summary: "Pre-2016 Ford 1.0 EcoBoost engines suffer from premature timing chain stretch. The plastic tensioner can fail, causing catastrophic engine damage with little warning.",
      symptoms: "- Rattling noise on cold start that fades as engine warms\n- Check Engine / EML light\n- Rough idle or misfires\n- Metallic noise from front of engine\n- OBD codes P0016 or P0017",
      cause: "The early 1.0 EcoBoost timing chain uses a plastic guide and tensioner that wears faster than expected. The chain itself stretches over time, especially if oil changes have been neglected or if the car is frequently driven on short trips without reaching full operating temperature.",
      fix: "1. Confirm with a live data scan (P0016/P0017 confirm cam/crank correlation fault)\n2. Replace timing chain kit — chain, tensioner, guides and VCT solenoid as a set (Ford part 1697805)\n3. Use 5W-30 fully synthetic oil and change every 6,000 miles maximum\n4. Ford issued a Technical Service Bulletin for this repair on 2012-2015 engines — check if the repair has already been done\n5. Budget £600–£1,200 at an independent garage (engine-out not required on this engine)",
      severity: "critical",
      mileage_start: 40000, mileage_end: 100000,
      repair_cost_low: 600, repair_cost_high: 1200,
      diy_difficulty: "hard",
      affected_years: "2012-2015",
      obd_codes: ["P0016", "P0017", "P0011"],
      published: true,
    },
    {
      variant_id: v("mk7-10-ecoboost-100"),
      title: "Coolant Loss from Cylinder Head",
      slug: "fiesta-mk7-ecoboost-coolant-loss",
      summary: "The 1.0 EcoBoost has an integrated exhaust manifold cast into the cylinder head. This design causes head gasket stress and coolant loss, sometimes causing overheating.",
      symptoms: "- Coolant reservoir dropping without visible leak\n- Sweet smell from engine bay\n- White steam from exhaust on startup\n- Overheating warning\n- Heater blowing cold intermittently",
      cause: "Heat from the integral exhaust manifold causes repeated thermal cycling of the head gasket. On high-mileage examples the gasket fails between the water jacket and combustion chamber. Some early engines also had a casting defect in the coolant passage.",
      fix: "1. Pressure test the cooling system to confirm loss\n2. Check for combustion gases in coolant with a block tester kit (yellow turns green = positive)\n3. Replace head gasket — requires camshaft and VCT removal\n4. Inspect head for warping before refitting\n5. Fit an upgraded MLS (Multi-Layer Steel) head gasket if available",
      severity: "severe",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 500, repair_cost_high: 900,
      diy_difficulty: "hard",
      affected_years: "2012-2018",
      obd_codes: ["P0217", "P0128"],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // FORD FIESTA MK7 1.5 TDCi
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("mk7-15-tdci-75"),
      title: "DPF Blockage and Regeneration Failure",
      slug: "fiesta-mk7-tdci-dpf-blockage",
      summary: "The 1.5 TDCi diesel Fiesta is commonly used for short urban trips — exactly the wrong usage for a DPF-equipped car. Blocked DPF is the number one complaint.",
      symptoms: "- DPF warning light (orange/amber)\n- Reduced power / limp mode\n- More frequent 'regeneration' motorway drives needed\n- Excessive fuel consumption\n- Black smoke from exhaust\n- P2452 or P2453 fault code",
      cause: "DPF regeneration requires sustained high exhaust temperatures (above 550°C), only achieved at motorway speeds for 20+ minutes. Urban-only driving accumulates soot faster than passive regen can clear it. Blocked EGR valves worsen the situation.",
      fix: "1. Attempt an active forced regen using a suitable OBD diagnostic tool (Forscan free option)\n2. If soot load >85%, a forced regen will fail — remove and clean the DPF professionally (£150-300)\n3. Check and clean EGR valve at the same time\n4. As a last resort, replace the DPF — OEM £600-1,200, pattern £300-500\n5. Prevention: take the car on a 20-min motorway run every 2 weeks minimum",
      severity: "moderate",
      mileage_start: 30000, mileage_end: 80000,
      repair_cost_low: 150, repair_cost_high: 1200,
      diy_difficulty: "moderate",
      affected_years: "2013-2017",
      obd_codes: ["P2452", "P2453", "P0401"],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // FORD FIESTA MK6 1.25
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("mk6-125-82"),
      title: "Front Wheel Bearing Failure",
      slug: "fiesta-mk6-front-wheel-bearing",
      summary: "Front wheel bearing wear is extremely common on the Mk6 Fiesta. Most examples will need at least one bearing replaced between 60,000 and 100,000 miles.",
      symptoms: "- Humming or droning noise that increases with speed\n- Noise changes pitch when changing lanes / cornering\n- Vibration through steering wheel at speed\n- Noise worse on one side when turning",
      cause: "The wheel bearing units are sealed and non-adjustable. They wear naturally with mileage and suffer faster on cars driven on poor road surfaces or with misaligned tracking. Kerbing the wheel accelerates wear significantly.",
      fix: "1. Jack the wheel and check for play (grab wheel at 12 and 6 o'clock, rock it — play means worn bearing)\n2. Remove hub and drive out old bearing with a press\n3. Press in new bearing — OEM quality recommended (FAG, SKF or Timken)\n4. This is a DIY-able job with a hydraulic press. Many garages press bearings without replacing the hub.\n5. Cost at an indie garage: £150-250 per side including parts",
      severity: "moderate",
      mileage_start: 60000, mileage_end: 100000,
      repair_cost_low: 120, repair_cost_high: 250,
      diy_difficulty: "moderate",
      affected_years: "2008-2012",
      obd_codes: [],
      published: true,
    },
    {
      variant_id: v("mk6-125-82"),
      title: "Power Steering Pump Failure",
      slug: "fiesta-mk6-power-steering-pump-failure",
      summary: "The hydraulic power steering pump on the Mk6 Fiesta fails with age and mileage, making the steering very heavy — especially at low speeds and when parking.",
      symptoms: "- Heavy or stiff steering, especially when parking\n- Whining noise from engine bay when turning\n- Power steering fluid level dropping\n- Steering works fine at speed but heavy at low speed",
      cause: "The hydraulic power steering pump wears internally over time. Fluid leaks from the pump seal or rack can reduce pressure. Some failures are caused by contaminated fluid or low fluid level causing pump cavitation.",
      fix: "1. Check power steering fluid level first — top up if low and check for leaks\n2. If pump whines, it is on its way out — replacement is necessary\n3. Remanufactured pumps available from £80-150 (Meyle, Bosch)\n4. Flush steering system with fresh fluid on install\n5. DIY difficulty: moderate — requires drive belt removal and fluid bleeding",
      severity: "moderate",
      mileage_start: 70000, mileage_end: 130000,
      repair_cost_low: 180, repair_cost_high: 380,
      diy_difficulty: "moderate",
      affected_years: "2008-2012",
      obd_codes: [],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // VAUXHALL CORSA D 1.3 CDTi
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("corsa-d-13-cdti"),
      title: "EGR Valve Failure and Carbon Build-Up",
      slug: "corsa-d-cdti-egr-failure",
      summary: "The Fiat/GM 1.3 CDTi is a capable diesel but its EGR valve blocks with carbon deposits regularly. This is one of the most common Corsa D complaints.",
      symptoms: "- EML warning light\n- Reduced power / limp mode\n- Rough idle and hesitation\n- Increased fuel consumption\n- White or black smoke\n- OBD codes P0400, P0401 or P1401",
      cause: "The EGR system recirculates exhaust gases back into the intake to reduce NOx emissions. Over time, carbon from the exhaust coats the valve and intake manifold, eventually causing the valve to stick. Worse on city-driven cars.",
      fix: "1. Remove EGR valve — usually 2 bolts and one electrical connector on this engine\n2. Soak in EGR/carb cleaner for 30 minutes and scrub with a brush\n3. Clean the intake manifold passages with carb cleaner and long pipe brushes\n4. Refit or replace valve — OEM Fiat/Vauxhall £120, pattern from £40\n5. Consider fitting an EGR blanking plate (note: may cause MOT failure if lambda checked)",
      severity: "moderate",
      mileage_start: 50000, mileage_end: 100000,
      repair_cost_low: 80, repair_cost_high: 280,
      diy_difficulty: "moderate",
      affected_years: "2006-2014",
      obd_codes: ["P0400", "P0401", "P1401"],
      published: true,
    },
    {
      variant_id: v("corsa-d-13-cdti"),
      title: "Diesel Particulate Filter Blockage",
      slug: "corsa-d-cdti-dpf-blockage",
      summary: "DPF blockage is endemic on the 1.3 CDTi Corsa, largely because most owners use them for short trips where the DPF cannot self-clean.",
      symptoms: "- Orange DPF warning light\n- Power loss and stuttering\n- Limp mode at higher loads\n- Excessive fuel consumption\n- Strong diesel smell",
      cause: "Short trip, low-speed driving prevents the DPF from reaching regeneration temperature. Combined with a small 1.3-litre engine that takes longer to warm up in UK winters, soot accumulates faster than it burns off.",
      fix: "1. Take car on 30+ minute motorway drive at 2,500+ RPM to attempt passive regen\n2. If light remains, use an OBD tool to force active regeneration\n3. DPF cleaning service (professional): £150-300, restores flow\n4. Replacement DPF (if damaged): £400-800 for quality aftermarket\n5. Consider this car unsuitable for purely urban use — match car to usage",
      severity: "moderate",
      mileage_start: 40000, mileage_end: 90000,
      repair_cost_low: 150, repair_cost_high: 800,
      diy_difficulty: "moderate",
      affected_years: "2006-2014",
      obd_codes: ["P2452", "P2453", "P246C"],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // VAUXHALL CORSA D 1.2
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("corsa-d-12-85"),
      title: "Coolant Loss and Head Gasket Failure",
      slug: "corsa-d-12-coolant-loss",
      summary: "The Z12XE and Z12XEP 1.2-litre petrol engine in the Corsa D is known for coolant loss. In many cases this escalates to head gasket failure if not caught early.",
      symptoms: "- Coolant level dropping without visible external leak\n- Overheating warning light or temperature gauge rising\n- White smoke from exhaust, especially on cold starts\n- Mayonnaise-like residue under oil filler cap\n- Sweet smell from engine bay",
      cause: "The Z12XE family engines have a known weakness in the head gasket between cylinders 1 and 2. Coolant seeps into the combustion chamber. The problem is accelerated by overheating events, even brief ones.",
      fix: "1. Block test for combustion gases in coolant (combustion gas test kit, £10)\n2. If positive: head gasket replacement required\n3. Pressure test system to locate any external leaks first\n4. Replace head gasket — check for head warping with a straight edge\n5. Replace thermostat at the same time (they fail and cause overheating too)\n6. Full repair cost: £400-700 at an independent garage",
      severity: "severe",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 400, repair_cost_high: 700,
      diy_difficulty: "hard",
      affected_years: "2006-2014",
      obd_codes: ["P0217", "P0128"],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // VAUXHALL ASTRA J 1.6 CDTi
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("astra-j-16-cdti"),
      title: "Timing Chain Rattle and Tensioner Failure",
      slug: "astra-j-cdti-timing-chain",
      summary: "The 1.6 CDTi A16DTH/DTJ engine is notorious for timing chain noise and failure, often from as low as 60,000 miles. This is the most serious known fault on the Astra J diesel.",
      symptoms: "- Rattling or chain whipping sound on cold start from top of engine\n- Noise usually present only when cold, disappears as oil pressure builds\n- EML light with P0008, P0016 or P0017\n- In severe cases: loss of power, timing jumping, engine won't start\n- Metallic debris in oil",
      cause: "The A16DTH engine uses a timing chain with a hydraulically actuated tensioner. The tensioner relies on oil pressure — on cold starts there is a brief moment of low pressure. Combined with stretched chains and worn guides, this causes the characteristic rattle. Many examples were allowed to deteriorate too long before repair.",
      fix: "1. Do not drive the car if you hear the rattle — a jumped chain can bend valves\n2. Confirm with OBD codes P0016/P0017 (cam/crank correlation)\n3. Full timing chain kit replacement — chain, tensioners, guides, VVT actuator (if applicable)\n4. Oil and filter change on reassembly with quality 5W-30 synthetic\n5. This job requires engine timing tools (available on loan from Halfords)\n6. Labour: 6-8 hours. Total cost: £800-1,500",
      severity: "critical",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 800, repair_cost_high: 1500,
      diy_difficulty: "professional_only",
      affected_years: "2012-2015",
      obd_codes: ["P0008", "P0016", "P0017"],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // VW GOLF MK5 2.0 TDI
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("mk5-20-tdi-140"),
      title: "High Pressure Fuel Pump Cam Follower Wear",
      slug: "golf-mk5-tdi-cam-follower-wear",
      summary: "The PD (pumpe-düse) 2.0 TDI uses a mechanical cam follower to drive the high-pressure fuel pump. This follower wears rapidly and if not replaced destroys the camshaft — a £2,500 repair for a £15 part.",
      symptoms: "- No symptoms until catastrophic failure\n- Hard starting in cold weather\n- Reduced power\n- Engine noise from top of engine\n- In failure: car won't start, camshaft lobe destroyed",
      cause: "The HPFP cam follower (tappet) is made of steel running against a steel camshaft lobe with limited lubrication. It wears through to the camshaft, destroying the lobe. The follower should be inspected every 20,000 miles but is rarely on service schedules.",
      fix: "1. PREVENTION is everything — inspect follower every 20,000 miles via the HPFP access hole\n2. A worn follower shows a groove — replace immediately (£15-30 part, 30 minutes work)\n3. If camshaft lobe is damaged: full camshaft replacement required (£800-1,500)\n4. Check follower condition on purchase — this is the first thing to inspect on any PD TDI\n5. This applies to Golf Mk5, Octavia Mk2, A3 8P and any VAG 2.0 TDI PD engine",
      severity: "critical",
      mileage_start: 20000, mileage_end: 100000,
      repair_cost_low: 15, repair_cost_high: 1500,
      diy_difficulty: "easy",
      affected_years: "2004-2009",
      obd_codes: ["P0087", "P0093"],
      published: true,
    },
    {
      variant_id: v("mk5-20-tdi-140"),
      title: "Dual Mass Flywheel Failure",
      slug: "golf-mk5-tdi-dmf-failure",
      summary: "DMF failure on the Golf Mk5 2.0 TDI is a rite of passage for high-mileage cars. The flywheel absorbs diesel engine vibrations but wears out — often needing clutch replacement at the same time.",
      symptoms: "- Rattling from gearbox at idle, disappears with clutch pressed\n- Juddering on clutch engagement from standstill\n- Vibration through gear lever at idle\n- Difficulty engaging gears smoothly",
      cause: "The DMF uses internal spring dampers to smooth out the torque pulses from the diesel engine. These springs wear and lose their damping capacity. Towing, aggressive driving, and riding the clutch accelerate wear.",
      fix: "1. Depress clutch at idle — if rattle disappears, DMF is confirmed\n2. Replace DMF and clutch as a set — never fit a new clutch to a worn DMF\n3. Options: OEM LuK DMF + clutch kit (£400-600 parts), solid flywheel conversion (cheaper long-term)\n4. Labour: 4-6 hours. Total: £700-1,200 at an independent\n5. A solid flywheel conversion with uprated clutch costs similar but lasts longer",
      severity: "severe",
      mileage_start: 80000, mileage_end: 160000,
      repair_cost_low: 700, repair_cost_high: 1200,
      diy_difficulty: "professional_only",
      affected_years: "2004-2009",
      obd_codes: [],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // VW GOLF MK6 1.6 TDI
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("mk6-16-tdi-105"),
      title: "EGR Cooler Failure and Soot Ingestion",
      slug: "golf-mk6-tdi-egr-cooler-failure",
      summary: "The 1.6 TDI common-rail engine has a well-documented EGR cooler failure. Coolant can leak into the intake causing rough running or, in severe cases, catastrophic engine failure from hydro-lock.",
      symptoms: "- Coolant loss without external leaks\n- White smoke from exhaust with sweet smell\n- Rough running and misfires\n- Loss of coolant reservoir level over weeks\n- P0401 EGR flow fault code",
      cause: "The EGR cooler uses engine coolant to cool recirculated exhaust gas. Internal corrosion causes the coolant passages to develop pinholes. Coolant enters the intake manifold — initially causing rough running, potentially causing hydro-lock if severe.",
      fix: "1. Confirm: remove EGR cooler outlet pipe — look for coolant residue or steam\n2. Pressure test cooling system to confirm loss from EGR area\n3. Replace EGR cooler — OEM Valeo/Pierburg unit recommended (£150-300)\n4. Flush intake manifold of any coolant residue before restarting\n5. Replace EGR valve at the same time if mileage is over 100k\n6. Total repair: £400-800",
      severity: "severe",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 400, repair_cost_high: 800,
      diy_difficulty: "hard",
      affected_years: "2009-2013",
      obd_codes: ["P0401", "P0402", "P0128"],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // BMW E90 320d N47
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("e90-320d-n47"),
      title: "N47 Timing Chain Failure (Rear of Engine)",
      slug: "bmw-e90-n47-timing-chain-failure",
      summary: "The BMW N47 diesel engine has a timing chain positioned at the REAR of the engine, against the bulkhead. Chain failure is catastrophic, and repair requires engine removal. This is the most significant known fault in the BMW 3 Series range.",
      symptoms: "- Rattling noise from REAR of engine (not front) on cold start\n- Noise fades as oil pressure builds but returns on cold mornings\n- Timing warning codes: P0016, P0017\n- In failure: engine cuts out suddenly, timing jumps, bent valves, total engine destruction\n- Average failure mileage: 80,000-140,000",
      cause: "BMW made the cost-saving decision to run the timing chain on the gearbox end of the engine. The chain, guides and tensioner all wear — but access requires removing the engine from the car. Many owners were unaware of the issue until failure occurred.",
      fix: "1. Listen for the rattle — it comes from BEHIND the engine, not the front\n2. If you hear the rattle, stop driving and book in immediately\n3. Engine must come out for the repair — this is a £2,000-3,500 job at a specialist\n4. A full chain kit replacement (chain, guides, tensioner, sprockets) is required\n5. Ask any prospective purchase: 'has the timing chain been done?' — get written proof\n6. BMW Extended Warranty or SMMT claims have been made on some examples",
      severity: "critical",
      mileage_start: 80000, mileage_end: 160000,
      repair_cost_low: 2000, repair_cost_high: 3500,
      diy_difficulty: "professional_only",
      affected_years: "2007-2012",
      obd_codes: ["P0016", "P0017", "P0011"],
      published: true,
    },
    {
      variant_id: v("e90-320d-n47"),
      title: "Swirl Flap Failure and Engine Ingestion",
      slug: "bmw-e90-n47-swirl-flap-failure",
      summary: "The N47 intake manifold has metal swirl flaps on actuator rods. When the rods corrode and snap, the flap breaks off and gets ingested into the engine, causing severe internal damage.",
      symptoms: "- Sudden loss of power with no warning\n- Loud metallic knock or bang\n- EML with P2004, P2008 or similar intake manifold codes\n- Rough running or engine misfires\n- Metal debris visible in intake if inspected",
      cause: "The alloy swirl flap actuator rods corrode in the UK climate. When the rod snaps, the swirl flap is free to be sucked into the engine. The result ranges from a dented piston crown to a total engine write-off.",
      fix: "1. Prevention: remove swirl flaps entirely (blanking plugs available, £30-50)\n2. If failure has occurred: compression test all cylinders immediately\n3. Inspect pistons via spark plug holes with an endoscope\n4. If piston damage: engine rebuild or replacement engine required\n5. Preventative flap removal is a 2-3 hour DIY job — highly recommended on any N47 over 60,000 miles",
      severity: "critical",
      mileage_start: 60000, mileage_end: 120000,
      repair_cost_low: 30, repair_cost_high: 5000,
      diy_difficulty: "moderate",
      affected_years: "2007-2012",
      obd_codes: ["P2004", "P2005", "P2006", "P2008"],
      published: true,
    },
    {
      variant_id: v("e90-320d-n47"),
      title: "EGR Cooler and Valve Failure",
      slug: "bmw-e90-n47-egr-failure",
      summary: "EGR cooler failure on the N47 is common from 70,000 miles. Coolant leaks into the intake manifold and the EGR valve sticks, causing power loss and rough running.",
      symptoms: "- Coolant loss without external leak\n- White smoke on startup\n- Rough idle and hesitation\n- P0401 EGR fault codes\n- Smell of coolant from engine bay",
      cause: "The EGR cooler corrodes internally. Combined with the EGR valve carbonising, this becomes a double failure. The coolant leak into the intake can cause misfires and carbon build-up in the valves.",
      fix: "1. Replace EGR cooler (BMW part or quality OEM equivalent)\n2. Clean or replace EGR valve at same time\n3. Flush intake manifold\n4. Change coolant with BMW LL coolant specification\n5. Total repair: £600-1,200 at specialist",
      severity: "moderate",
      mileage_start: 70000, mileage_end: 130000,
      repair_cost_low: 600, repair_cost_high: 1200,
      diy_difficulty: "hard",
      affected_years: "2007-2012",
      obd_codes: ["P0401", "P0402", "P0128"],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // NISSAN QASHQAI J10 1.5 dCi
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("j10-15-dci-106"),
      title: "Timing Chain Failure (K9K Engine)",
      slug: "qashqai-j10-k9k-timing-chain",
      summary: "The Renault/Nissan K9K 1.5 dCi engine in the Qashqai J10 is known for timing chain wear. Unlike a timing belt, there is no scheduled replacement — but chains stretch and tensioners fail.",
      symptoms: "- Rattling or chattering from engine on cold start\n- EML with P0016/P0017\n- Engine running rough on startup\n- In severe cases: timing jump, engine damage\n- Oil consumption increasing",
      cause: "The K9K chain and hydraulic tensioner are wear items that VW and Nissan did not schedule for replacement. Low oil levels or infrequent oil changes accelerate wear. High mileage examples are at significant risk.",
      fix: "1. Change engine oil every 5,000-6,000 miles using 5W-40 fully synthetic\n2. On any example over 80k miles, inspect chain tension via OBD cam/crank correlation data\n3. Full chain kit replacement at first sign of rattle — do not delay\n4. Cost: £600-1,000 at a specialist\n5. This engine also powers Clio, Megane and Juke — same fix applies",
      severity: "severe",
      mileage_start: 80000, mileage_end: 140000,
      repair_cost_low: 600, repair_cost_high: 1000,
      diy_difficulty: "hard",
      affected_years: "2006-2013",
      obd_codes: ["P0016", "P0017"],
      published: true,
    },
    {
      variant_id: v("j10-15-dci-106"),
      title: "DPF Blockage and Sensor Failure",
      slug: "qashqai-j10-dpf-blockage",
      summary: "DPF issues on the J10 Qashqai are common because many are used as school-run and short-trip vehicles — exactly the wrong driving profile for a diesel with a DPF.",
      symptoms: "- DPF warning light on dashboard\n- Power reduction and limp mode\n- Engine oil level rising (diesel contamination from failed regen)\n- Black smoke\n- P2453 or P2454 pressure sensor codes",
      cause: "Soot accumulates in the DPF during short cold trips. Passive and active regeneration both require higher temperatures and RPM than typical urban use provides. A blocked DPF can contaminate engine oil with diesel fuel from failed regens.",
      fix: "1. Check engine oil dipstick — if it smells of diesel or is above max, change oil immediately\n2. Attempt forced regen via OBD (Consult software or generic EOBD)\n3. Professional DPF clean: £200-350 (removes and pressure cleans)\n4. If ash content too high, replacement required: £400-900\n5. Consider changing to a petrol Qashqai if urban use is predominant",
      severity: "moderate",
      mileage_start: 40000, mileage_end: 90000,
      repair_cost_low: 200, repair_cost_high: 900,
      diy_difficulty: "moderate",
      affected_years: "2007-2013",
      obd_codes: ["P2452", "P2453", "P2454"],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // PEUGEOT 207 1.6 HDi
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("207-16-hdi-90"),
      title: "Timing Belt Failure (60,000 Mile Interval)",
      slug: "peugeot-207-hdi-timing-belt",
      summary: "The PSA 1.6 HDi engine has a 60,000-mile or 4-year timing belt interval — much shorter than most competitors. Belt failure destroys the engine. Many 207 owners are unaware of this critical maintenance item.",
      symptoms: "- No symptoms before failure (this is a preventative maintenance issue)\n- On failure: engine stops immediately with no warning\n- Loud bang on failure\n- Engine will not restart — bent valves, damaged pistons\n- P0016 or P0017 if belt has slipped (not snapped)",
      cause: "The rubber timing belt degrades with age and mileage. The PSA interval of 60k miles or 4 years is strict — the belt WILL fail beyond this. Many second-hand 207s have no service history proving the belt has been changed.",
      fix: "1. If belt history unknown: replace immediately regardless of mileage\n2. Replace belt, tensioner, idler pulley and water pump as a kit\n3. Gates or Dayco kit recommended (not cheap pattern parts on a timing belt)\n4. This is a DIY job for an experienced mechanic but requires correct torque specs\n5. Cost: £300-600 at a garage including parts\n6. Always get a receipt — note the mileage and stick to the 60k/4 year rule",
      severity: "critical",
      mileage_start: 1, mileage_end: 60000,
      repair_cost_low: 300, repair_cost_high: 600,
      diy_difficulty: "hard",
      affected_years: "2006-2012",
      obd_codes: [],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // RENAULT CLIO MK3 1.5 dCi
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("clio-mk3-15-dci-86"),
      title: "Injector Return Pipe Failure",
      slug: "clio-mk3-dci-injector-return-pipe",
      summary: "The K9K 1.5 dCi in the Clio Mk3 has a known failure on the injector fuel return pipes. The plastic fittings crack and cause a fuel leak — a fire risk that must be addressed immediately.",
      symptoms: "- Strong diesel smell in engine bay, especially after running\n- Visible fuel staining around injectors\n- Difficulty starting when hot (fuel returning to tank)\n- Lumpy running\n- Engine bay fire risk if unaddressed",
      cause: "The plastic clip-on return pipe connections to the injectors become brittle with heat cycling and age. They develop hairline cracks that worsen over time. The pipes carry low-pressure return fuel but the fuel is hot and the leak is a serious fire risk.",
      fix: "1. Inspect all injector return pipe connections immediately on any high-mileage K9K\n2. Purchase the Renault injector return pipe repair kit (available from £30)\n3. Replace all clips/pipes at once — if one has gone, others will follow\n4. This is a straightforward DIY job: 1-2 hours\n5. Dealers often replace under goodwill if the car is newer — worth asking",
      severity: "severe",
      mileage_start: 60000, mileage_end: 130000,
      repair_cost_low: 30, repair_cost_high: 150,
      diy_difficulty: "easy",
      affected_years: "2005-2012",
      obd_codes: ["P0087", "P0093"],
      published: true,
    },
    {
      variant_id: v("clio-mk3-15-dci-86"),
      title: "EDC Automated Clutch Actuator Failure",
      slug: "clio-mk3-dci-edc-clutch-actuator",
      summary: "The EDC (Easy Drive) semi-automatic gearbox variant of the 1.5 dCi Clio uses an electric clutch actuator. When this fails, the car refuses to move — and replacements are expensive.",
      symptoms: "- Gear selection fault warning on dashboard\n- Car hesitates or refuses to pull away from a stop\n- Grinding or clunking when changing gear\n- EML with P1620 or transmission-related fault codes\n- Car stuck in neutral",
      cause: "The EDC actuator motor and mechanism wear with age and use. Cold weather exacerbates the issue. Many units fail entirely at 8-12 years of age regardless of mileage.",
      fix: "1. Confirm with diagnostic tool — EDC codes confirm actuator failure\n2. New actuator from Renault: £900-1,500 fitted\n3. Remanufactured actuators available from specialists: £300-500\n4. Some owners convert to a standard manual gearbox — parts car donor required\n5. Avoid the EDC transmission entirely if possible — buy the manual",
      severity: "severe",
      mileage_start: 50000, mileage_end: 120000,
      repair_cost_low: 300, repair_cost_high: 1500,
      diy_difficulty: "professional_only",
      affected_years: "2005-2012",
      obd_codes: ["P1620", "P0812"],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // MINI COOPER S R56 1.6T
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("r56-cooper-s-16t"),
      title: "Timing Chain Tensioner Failure (N14 Engine)",
      slug: "mini-r56-n14-timing-chain-tensioner",
      summary: "The BMW-designed N14 1.6T engine in the R56 Mini Cooper S has a plastic timing chain tensioner that fails prematurely. This is the most serious known fault on the R56 generation.",
      symptoms: "- Rattling from engine on cold start, louder in cold weather\n- EML with timing chain correlation codes\n- Loss of power and misfires\n- In catastrophic failure: engine stops, cannot be restarted\n- Metallic noise from top of engine",
      cause: "The N14 uses a plastic single-vane timing chain tensioner that loses tension as it wears. The chain then slaps against the guides. Combined with carbon build-up on the intake valves (direct injection + PCV system), the engine suffers from multiple compounding issues.",
      fix: "1. Replace timing chain, tensioner, guides and sprockets as a complete kit\n2. Also check for oil leaks from valve cover — refit gasket at same time\n3. Carbon clean intake valves while the engine is partially disassembled\n4. Genuine BMW Mini parts for this — pattern parts have been known to fail prematurely\n5. Total repair: £1,000-1,800 at a specialist",
      severity: "critical",
      mileage_start: 40000, mileage_end: 100000,
      repair_cost_low: 1000, repair_cost_high: 1800,
      diy_difficulty: "professional_only",
      affected_years: "2006-2013",
      obd_codes: ["P0016", "P0017", "P0011"],
      published: true,
    },
    {
      variant_id: v("r56-cooper-s-16t"),
      title: "Carbon Build-Up on Intake Valves",
      slug: "mini-r56-n14-carbon-build-up",
      summary: "The N14's direct injection system means fuel is injected directly into the cylinder, bypassing the intake valves. Oil vapour from the PCV system coats the valves with carbon, causing power loss and misfires.",
      symptoms: "- Rough idle and misfires on cold start\n- Hesitation and stumbling under light throttle\n- Loss of power compared to when car was new\n- Fuel economy declining\n- Carbon deposits visible via borescope through intake ports",
      cause: "Direct injection engines do not have fuel washing over the intake valves to remove deposits. The PCV (Positive Crankcase Ventilation) system routes oil vapour back into the intake. This vapour bakes onto the hot valves and builds up into hard carbon deposits over 40,000-60,000 miles.",
      fix: "1. Walnut blast intake clean — walnut shells blasted into the intake to remove carbon deposits\n2. Requires removal of intake manifold — 3-4 hours work\n3. Cost: £300-600 at a specialist\n4. Prevention: use quality fully synthetic 5W-30 oil, short oil change intervals\n5. Can be done DIY with a walnut blaster kit — rental available from some tool shops",
      severity: "moderate",
      mileage_start: 40000, mileage_end: 80000,
      repair_cost_low: 300, repair_cost_high: 600,
      diy_difficulty: "hard",
      affected_years: "2006-2013",
      obd_codes: ["P0300", "P0301", "P0302"],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // AUDI A3 8P 2.0 TDI PD
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("a3-8p-20-tdi-140"),
      title: "High Pressure Fuel Pump Cam Follower Wear",
      slug: "audi-a3-8p-tdi-cam-follower",
      summary: "The same critical cam follower issue as the Golf Mk5 — the HPFP cam follower wears through to the camshaft. A £15 inspection and part replacement prevents a £2,500 camshaft repair.",
      symptoms: "- No warning until failure — this is a silent destroyer\n- Hard starting in cold conditions when follower is badly worn\n- High-pressure fuel pump fault codes\n- In failure: car won't start, cam lobe destroyed",
      cause: "Identical to Golf Mk5 issue — the PD fuel pump actuator uses a cam follower that VAG failed to adequately specify for longevity. The follower wears through its coating and into the metal.",
      fix: "1. Inspect follower every 20,000 miles — access via 10mm bolt on HPFP top\n2. Remove HPFP cover, check follower for wear groove with a torch\n3. If grooved or worn flat: replace for £15-30 (Bosch, Elring or OEM)\n4. If camshaft lobe is damaged: cam replacement £800-1,500\n5. This is the #1 pre-purchase check on ALL VAG 2.0 TDI PD engines",
      severity: "critical",
      mileage_start: 20000, mileage_end: 100000,
      repair_cost_low: 15, repair_cost_high: 1500,
      diy_difficulty: "easy",
      affected_years: "2003-2013",
      obd_codes: ["P0087", "P0088", "P0093"],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // LAND ROVER FREELANDER 2 2.2 SD4
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("fl2-22-sd4-190"),
      title: "Timing Belt Failure and Water Pump Failure",
      slug: "freelander2-sd4-timing-belt",
      summary: "The 2.2 SD4 Freelander 2 has a timing belt with a 120,000-mile interval but the water pump is driven by the same belt — and water pump failure destroys the belt. This is a common and expensive failure.",
      symptoms: "- Coolant loss from front of engine\n- Belt tensioner noise\n- Overheating warning\n- In failure: sudden engine cut-out\n- Belt shredding or slipping visible\n- Engine cranks but does not start (timing lost)",
      cause: "Land Rover used a wet-belt timing system — the timing belt runs through coolant from the water pump. When the water pump bearing fails, it contaminates the belt and destroys it rapidly. The repair interval was later revised downward after failures in the field.",
      fix: "1. Replace timing belt, water pump, tensioner and idler as a complete kit\n2. Land Rover updated the part specification — use the revised kit only\n3. This should be done at 80,000 miles or 5 years regardless of official interval\n4. Cost: £800-1,500 at a Land Rover specialist\n5. If belt has failed: engine inspection for bent valves is mandatory before repair",
      severity: "critical",
      mileage_start: 80000, mileage_end: 130000,
      repair_cost_low: 800, repair_cost_high: 1500,
      diy_difficulty: "professional_only",
      affected_years: "2011-2015",
      obd_codes: ["P0016", "P0017"],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // SKODA OCTAVIA MK2 2.0 TDI PD
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("octavia-mk2-20-tdi-140"),
      title: "High Pressure Fuel Pump Cam Follower Wear",
      slug: "octavia-mk2-tdi-cam-follower",
      summary: "The Octavia Mk2 TDI PD engine shares the VAG cam follower weakness. Because Octavias are often high-mileage fleet or family cars, this issue is widespread — and many used cars are sold without the seller knowing the cam lobe is destroyed.",
      symptoms: "- Hard starting when cold\n- Rough running under load\n- Fuel pressure fault codes (P0087)\n- No visible symptoms until camshaft is destroyed\n- HPFP failure — car won't start",
      cause: "Identical to Golf Mk5 and A3 8P — VAG PD engine cam follower wearing through to camshaft. This engine is in the Octavia, Golf, A3, Passat, Leon — all share this fault.",
      fix: "1. Pre-purchase: inspect follower BEFORE buying any 2.0 TDI PD\n2. Remove HPFP dust cap, check follower condition\n3. Replace follower at 20,000-mile intervals\n4. If camshaft damaged: camshaft replacement or replacement engine\n5. Budget: £15-30 (preventative) to £1,500+ (camshaft damaged)",
      severity: "critical",
      mileage_start: 20000, mileage_end: 100000,
      repair_cost_low: 15, repair_cost_high: 1500,
      diy_difficulty: "easy",
      affected_years: "2004-2013",
      obd_codes: ["P0087", "P0088"],
      published: true,
    },

    // ════════════════════════════════════════════════════════════════════════
    // FIAT 500 0.9 TwinAir
    // ════════════════════════════════════════════════════════════════════════
    {
      variant_id: v("fiat-500-09-twinair"),
      title: "Timing Belt Failure (Short 36,000-Mile Interval)",
      slug: "fiat-500-twinair-timing-belt",
      summary: "The 0.9 TwinAir engine has an unusually short timing belt interval of just 36,000 miles or 3 years. This is poorly publicised and many owners miss it. Belt failure destroys the engine.",
      symptoms: "- No warning before failure\n- Sudden engine cut-out while driving\n- Engine will not restart after failure\n- Bent valves and damaged pistons\n- Engine cranks but makes no compression",
      cause: "The two-cylinder TwinAir engine places extreme stress on the timing belt due to its unusual firing interval. Fiat specified a very short replacement interval to compensate, but did not publicise it well. Many owners follow the service book without knowing about the shorter belt interval.",
      fix: "1. Check service history specifically for timing belt replacement at 36k miles or 3 years\n2. If history unclear: replace belt, tensioner and idler immediately\n3. Use only Fiat/Magneti Marelli OEM belt or Gates equivalent\n4. Cost: £350-600 at a Fiat specialist\n5. Budget a timing belt replacement into the cost of any TwinAir purchase",
      severity: "critical",
      mileage_start: 1, mileage_end: 40000,
      repair_cost_low: 350, repair_cost_high: 600,
      diy_difficulty: "hard",
      affected_years: "2010-2019",
      obd_codes: [],
      published: true,
    },
  ];
}

// ─── TAGS ───────────────────────────────────────────────────────────────────

const TAGS = [
  { name: "EGR",            slug: "egr"            },
  { name: "DPF",            slug: "dpf"            },
  { name: "Turbo",          slug: "turbo"          },
  { name: "Flywheel",       slug: "flywheel"       },
  { name: "Clutch",         slug: "clutch"         },
  { name: "Timing Chain",   slug: "timing-chain"   },
  { name: "Timing Belt",    slug: "timing-belt"    },
  { name: "Gearbox",        slug: "gearbox"        },
  { name: "Suspension",     slug: "suspension"     },
  { name: "Electrics",      slug: "electrics"      },
  { name: "Rust",           slug: "rust"           },
  { name: "Engine",         slug: "engine"         },
  { name: "Brakes",         slug: "brakes"         },
  { name: "Steering",       slug: "steering"       },
  { name: "Cooling",        slug: "cooling"        },
  { name: "Cam Follower",   slug: "cam-follower"   },
  { name: "Head Gasket",    slug: "head-gasket"    },
  { name: "Injectors",      slug: "injectors"      },
  { name: "Wheel Bearing",  slug: "wheel-bearing"  },
  { name: "Power Steering", slug: "power-steering" },
  { name: "Swirl Flaps",    slug: "swirl-flaps"    },
  { name: "Carbon Build-Up",slug: "carbon-buildup" },
];

// Map: fault slug -> tag slugs
const FAULT_TAG_MAP = {
  "fiesta-mk7-ecoboost-timing-chain-failure":     ["timing-chain", "engine"],
  "fiesta-mk7-ecoboost-coolant-loss":             ["cooling", "head-gasket", "engine"],
  "fiesta-mk7-tdci-dpf-blockage":                 ["dpf", "egr"],
  "fiesta-mk6-front-wheel-bearing":               ["wheel-bearing", "suspension"],
  "fiesta-mk6-power-steering-pump-failure":       ["power-steering", "steering"],
  "corsa-d-cdti-egr-failure":                     ["egr", "engine"],
  "corsa-d-cdti-dpf-blockage":                    ["dpf"],
  "corsa-d-12-coolant-loss":                      ["cooling", "head-gasket", "engine"],
  "astra-j-cdti-timing-chain":                    ["timing-chain", "engine"],
  "golf-mk5-tdi-cam-follower-wear":               ["cam-follower", "engine", "injectors"],
  "golf-mk5-tdi-dmf-failure":                     ["flywheel", "clutch", "gearbox"],
  "golf-mk6-tdi-egr-cooler-failure":              ["egr", "cooling", "engine"],
  "bmw-e90-n47-timing-chain-failure":             ["timing-chain", "engine"],
  "bmw-e90-n47-swirl-flap-failure":               ["swirl-flaps", "engine"],
  "bmw-e90-n47-egr-failure":                      ["egr", "cooling"],
  "qashqai-j10-k9k-timing-chain":                 ["timing-chain", "engine"],
  "qashqai-j10-dpf-blockage":                     ["dpf"],
  "peugeot-207-hdi-timing-belt":                  ["timing-belt", "engine"],
  "clio-mk3-dci-injector-return-pipe":            ["injectors", "engine"],
  "clio-mk3-dci-edc-clutch-actuator":             ["clutch", "gearbox", "electrics"],
  "mini-r56-n14-timing-chain-tensioner":          ["timing-chain", "engine"],
  "mini-r56-n14-carbon-build-up":                 ["carbon-buildup", "engine"],
  "audi-a3-8p-tdi-cam-follower":                  ["cam-follower", "engine", "injectors"],
  "freelander2-sd4-timing-belt":                  ["timing-belt", "cooling", "engine"],
  "octavia-mk2-tdi-cam-follower":                 ["cam-follower", "engine", "injectors"],
  "fiat-500-twinair-timing-belt":                 ["timing-belt", "engine"],
};

// ─── MAIN ───────────────────────────────────────────────────────────────────

async function seed() {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║       CKF — UK Market Seed  (Phase 1)               ║");
  console.log("╚══════════════════════════════════════════════════════╝\n");

  // 1. Makes
  process.stdout.write("1/6  Upserting makes…          ");
  const makes = await upsert("makes", MAKES, "slug");
  console.log(`✓  ${makes.length} makes`);

  // 2. Models
  process.stdout.write("2/6  Upserting models…         ");
  const modelData = buildModels(makes);
  const models = await upsert("models", modelData, "make_id,slug");
  console.log(`✓  ${models.length} models`);

  // 3. Variants
  process.stdout.write("3/6  Upserting variants…       ");
  const variantData = buildVariants(models);
  const variants = await upsert("variants", variantData, "model_id,slug");
  console.log(`✓  ${variants.length} variants`);

  // 4. Faults
  process.stdout.write("4/6  Upserting faults…         ");
  const faultData = buildFaults(variants);
  const faults = await upsert("faults", faultData, "slug");
  console.log(`✓  ${faults.length} faults`);

  // 5. Tags
  process.stdout.write("5/6  Upserting tags…           ");
  const tags = await upsert("tags", TAGS, "slug");
  console.log(`✓  ${tags.length} tags`);

  // 6. Fault–Tag links
  process.stdout.write("6/6  Linking fault tags…       ");
  const tagBySlug = Object.fromEntries(tags.map((t) => [t.slug, t.id]));
  const faultBySlug = Object.fromEntries(faults.map((f) => [f.slug, f.id]));

  const ftRows = [];
  for (const [faultSlug, tagSlugs] of Object.entries(FAULT_TAG_MAP)) {
    const faultId = faultBySlug[faultSlug];
    if (!faultId) { console.warn(`\n  ⚠  Unknown fault slug: ${faultSlug}`); continue; }
    for (const tagSlug of tagSlugs) {
      const tagId = tagBySlug[tagSlug];
      if (!tagId) { console.warn(`\n  ⚠  Unknown tag slug: ${tagSlug}`); continue; }
      ftRows.push({ fault_id: faultId, tag_id: tagId });
    }
  }
  await upsertNoReturn("fault_tags", ftRows, "fault_id,tag_id");
  console.log(`✓  ${ftRows.length} links`);

  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║  ✅  Seed complete!                                  ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log(`║  Makes:    ${String(makes.length).padEnd(42)}║`);
  console.log(`║  Models:   ${String(models.length).padEnd(42)}║`);
  console.log(`║  Variants: ${String(variants.length).padEnd(42)}║`);
  console.log(`║  Faults:   ${String(faults.length).padEnd(42)}║`);
  console.log(`║  Tags:     ${String(tags.length).padEnd(42)}║`);
  console.log("╚══════════════════════════════════════════════════════╝");
}

seed().catch((err) => {
  console.error("\n❌  Seed failed:", err.message);
  process.exit(1);
});
