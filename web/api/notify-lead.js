// Vercel serverless function: envía por email cada lead nuevo de la web.
// Se dispara desde insertLead() (client/src/lib/supabase.ts) tras guardar el lead.
//
// Dos vías de envío (las credenciales viven en variables de entorno, nunca en el código):
//   1) Gmail (preferida): si existen GMAIL_USER + GMAIL_APP_PASSWORD, envía DESDE tu Gmail.
//      Permite enviar a cualquier destinatario (p. ej. asturocasion@gmail.com) sin verificar dominio.
//   2) Resend (respaldo): si no hay credenciales de Gmail pero sí RESEND_API_KEY.
//      OJO: en modo gratuito Resend solo entrega al correo de la propia cuenta.
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }
  try {
    let lead = req.body;
    if (typeof lead === "string") { try { lead = JSON.parse(lead); } catch { lead = {}; } }
    lead = lead && typeof lead === "object" ? lead : {};

    const to = (process.env.LEAD_NOTIFY_TO || "asturocasion@gmail.com").split(",").map((s) => s.trim()).filter(Boolean);

    const TYPES = { valuation: "Tasación", contact: "Contacto", vehicle_inquiry: "Interés en vehículo" };
    const typeLabel = TYPES[lead.type] || "Lead";
    const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const vi = lead.vehicle_info || {};
    const vehLine = [vi.brand, vi.model, vi.year, vi.km != null ? `${vi.km} km` : null].filter(Boolean).join(" · ");

    const rows = [
      ["Tipo", typeLabel],
      ["Nombre", lead.name],
      ["Teléfono", lead.phone],
      ["Email", lead.email],
      vehLine ? ["Vehículo", vehLine] : null,
      lead.message ? ["Mensaje", lead.message] : null,
    ].filter(Boolean);

    const tableRows = rows.map(([k, v]) =>
      `<tr><td style="padding:6px 10px;color:#1F4E79;font-weight:bold;vertical-align:top;white-space:nowrap">${esc(k)}</td>`
      + `<td style="padding:6px 10px;color:#1D1D1F">${esc(v)}</td></tr>`
    ).join("");

    const html =
      `<div style="font-family:Arial,sans-serif;max-width:560px">`
      + `<h2 style="color:#1F4E79;margin:0 0 4px">Nuevo lead desde la web</h2>`
      + `<p style="color:#6B6B70;margin:0 0 14px;font-size:13px">asturocasion.es · ${new Date().toLocaleString("es-ES")}</p>`
      + `<table style="border-collapse:collapse;width:100%;background:#F5F8FC;border:1px solid #D9E2EC;border-radius:8px">${tableRows}</table>`
      + `</div>`;

    const subject = `Nuevo lead (${typeLabel}): ${lead.name || "sin nombre"}`;

    // --- Vía 1: Gmail (preferida) ---
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    if (gmailUser && gmailPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass },
      });
      const fromName = process.env.LEAD_NOTIFY_FROM_NAME || "Astur Ocasión · Leads web";
      const info = await transporter.sendMail({
        from: `"${fromName}" <${gmailUser}>`,
        to,
        subject,
        html,
        replyTo: lead.email || undefined,
      });
      res.status(200).json({ ok: true, via: "gmail", id: info.messageId });
      return;
    }

    // --- Vía 2: Resend (respaldo) ---
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      res.status(200).json({ ok: false, skipped: "no_transport" });
      return;
    }
    const from = process.env.LEAD_NOTIFY_FROM || "Astur Ocasion Leads <onboarding@resend.dev>";
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html, reply_to: lead.email || undefined }),
    });
    const data = await r.json().catch(() => ({}));
    res.status(200).json({ ok: r.ok, via: "resend", status: r.status, id: data.id, error: r.ok ? undefined : data });
  } catch (e) {
    // Nunca romper el flujo del formulario por un fallo de email.
    res.status(200).json({ ok: false, error: String(e && e.message ? e.message : e) });
  }
}
