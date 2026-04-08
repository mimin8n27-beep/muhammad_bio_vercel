import { supabase } from "@/lib/supabase";

const CONTACT_RATE_LIMIT_KEY = "muhammad_bio_contact_last_submit";
const CONTACT_COOLDOWN_MS = 45_000;

export interface ContactPayload {
  name: string;
  email: string;
  company: string;
  message: string;
  website?: string;
  source?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactPayload(payload: ContactPayload) {
  if (payload.website?.trim()) {
    return "Unable to send your message right now.";
  }

  if (payload.name.trim().length < 2) {
    return "Please enter your full name.";
  }

  if (!emailRegex.test(payload.email.trim())) {
    return "Please enter a valid email address.";
  }

  if (payload.message.trim().length < 20) {
    return "Please share a bit more detail so I can understand your project.";
  }

  if (payload.message.trim().length > 4000) {
    return "Your message is too long. Please keep it under 4000 characters.";
  }

  const lastSubmission = Number(localStorage.getItem(CONTACT_RATE_LIMIT_KEY) || 0);
  if (Date.now() - lastSubmission < CONTACT_COOLDOWN_MS) {
    return "Please wait a little before sending another message.";
  }

  return null;
}

export async function submitContactForm(payload: ContactPayload) {
  const validationError = validateContactPayload(payload);
  if (validationError) {
    throw new Error(validationError);
  }

  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || "Unable to send your message right now.");
  }

  localStorage.setItem(CONTACT_RATE_LIMIT_KEY, String(Date.now()));
}

export async function signInAdmin(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}
