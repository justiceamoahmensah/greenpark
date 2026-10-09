export type Development = {
  slug: string;
  name: string;
  description: string;
  image_url: string;
  active: boolean;
  sample: boolean;
  selectable: boolean;
  qr_enabled: boolean;
  property_types: string[];
};

export type PublicConfig = {
  company_name: string;
  placeholder_brand: boolean;
  contact_email: string;
  contact_phone_display: string;
  website_url: string;
  whatsapp_url: string | null;
  sheet_headers: string[];
  interested_in: string[];
  property_types: string[];
  budget_ranges: string[];
  purchase_timelines: string[];
  assistance_needed: string[];
  contact_preferences: string[];
  consent: string[];
  constraints: {
    full_name_min: number;
    full_name_max: number;
    additional_enquiry_max: number;
    email_max: number;
  };
  developments: Development[];
};

export type Answers = {
  full_name: string;
  phone_number: string;
  phone_country: string;
  email_address: string;
  interested_in: string;
  preferred_development: string;
  property_type: string;
  budget_usd: string;
  purchase_timeline: string;
  assistance_needed: string;
  contact_preference: string;
  additional_enquiry: string;
  may_we_contact_you: "" | "Yes" | "No";
};

export type Submission = {
  acknowledged: true;
  whatsapp_url: string | null;
  first_name: string;
  may_we_contact_you: "Yes" | "No";
  acknowledged_at: string;
};

export const emptyAnswers = (): Answers => ({
  full_name: "",
  phone_number: "",
  phone_country: "",
  email_address: "",
  interested_in: "",
  preferred_development: "",
  property_type: "",
  budget_usd: "",
  purchase_timeline: "",
  assistance_needed: "",
  contact_preference: "",
  additional_enquiry: "",
  may_we_contact_you: "",
});
