export type Severity = "minor" | "moderate" | "severe" | "critical";
export type DiyDifficulty = "easy" | "moderate" | "hard" | "professional_only";

export interface Make {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  country: string | null;
  description: string | null;
  fault_count: number;
  created_at: string;
}

export interface Model {
  id: string;
  make_id: string;
  name: string;
  slug: string;
  year_start: number | null;
  year_end: number | null;
  description: string | null;
  fault_count: number;
  created_at: string;
  makes?: Make;
}

export interface Variant {
  id: string;
  model_id: string;
  name: string;
  slug: string;
  engine: string | null;
  year_start: number | null;
  year_end: number | null;
  body_type: string | null;
  transmission: string | null;
  fuel_type: string | null;
  description: string | null;
  fault_count: number;
  created_at: string;
  models?: Model & { makes?: Make };
}

export interface Fault {
  id: string;
  variant_id: string;
  title: string;
  slug: string;
  summary: string;
  symptoms: string;
  cause: string;
  fix: string;
  severity: Severity;
  mileage_start: number | null;
  mileage_end: number | null;
  repair_cost_low: number | null;
  repair_cost_high: number | null;
  diy_difficulty: DiyDifficulty | null;
  affected_years: string | null;
  obd_codes: string[] | null;
  search_vector: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  variants?: Variant & {
    models?: Model & { makes?: Make };
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface FaultTag {
  fault_id: string;
  tag_id: string;
}

export interface FaultWithRelations extends Fault {
  variants: Variant & {
    models: Model & {
      makes: Make;
    };
  };
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
