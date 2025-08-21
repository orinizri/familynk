export interface Person {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: "male" | "female" | "custom";
  gender_custom?: string;
  date_of_birth_from?: string;
  date_of_birth_to?: string;
  date_of_birth_qualifier?: "exact" | "approximate" | "before" | "after";
  date_of_death_from?: string;
  date_of_death_to?: string;
  date_of_death_qualifier?: "exact" | "approximate" | "before" | "after";
  created_by?: string;
  created_at?: string;
}
