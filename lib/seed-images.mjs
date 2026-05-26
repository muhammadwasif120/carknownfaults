/**
 * CKF Visuals Update — Seed Script for Model Images
 * Generates generic high-quality Unsplash image URLs for models.
 * Run: node lib/seed-images.mjs
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

const genericImages = [
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80", // generic modern car
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80", // classic sports
  "https://images.unsplash.com/photo-1503376760367-1b61216b47c3?auto=format&fit=crop&w=1200&q=80", // white car
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80", // sports car
  "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80", // headlights
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80", // vintage
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80", // black car
];

async function seed() {
  console.log("Fetching models...");
  const { data: models, error } = await supabase.from("models").select("id, name");
  if (error) throw error;

  console.log(`Assigning placeholder images to ${models.length} models...`);

  const updates = models.map((model, index) => {
    // Pick an image sequentially to ensure variety
    const image_url = genericImages[index % genericImages.length];
    return {
      id: model.id,
      image_url: image_url
    };
  });

  const chunkSize = 20;
  let updated = 0;
  for (let i = 0; i < updates.length; i += chunkSize) {
    const chunk = updates.slice(i, i + chunkSize);
    try {
      await Promise.all(
        chunk.map((item) =>
          supabase.from("models").update({ image_url: item.image_url }).eq("id", item.id)
        )
      );
      updated += chunk.length;
    } catch (err) {
      console.error(`Failed on chunk ${i / chunkSize + 1}:`, err.message);
    }
  }

  console.log(`✅ Visuals Update complete. Assigned image_urls to ${updated} models.`);
}

seed().catch(console.error);
