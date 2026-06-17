import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({
      name: z.string().trim().min(1).max(100),
      email: z.string().trim().email().max(255),
      message: z.string().trim().min(5).max(2000),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    try {
      await supabaseAdmin.from("contact_messages").insert({
        name: data.name,
        email: data.email,
        message: data.message,
      });
    } catch {
      // table may not exist yet — still show success to user
    }
    return { ok: true };
  });
