import { useState, useEffect, useRef } from "react";
import { X, Send, Car, Euro, Phone, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Vehicle } from "@/lib/supabase";

type Message = {
  id: number;
  from: "bot" | "user";
  text: string;
  options?: { label: string; value: string }[];
};

const BOT_NAME = "Astur Bot";
const BOT_AVATAR = "AO";

const INITIAL_MESSAGE: Message = {
  id: 0,
  from: "bot",
  text: "¡Hola! Soy el asistente virtual de **Astur Ocasión**. ¿En qué puedo ayudarte hoy?",
  options: [
    { label: "🚗 Ver coches disponibles", value: "catalogo" },
    { label: "💰 Vender mi coche", value: "vender" },
    { label: "📋 Información y precios", value: "info" },
    { label: "📞 Hablar con un asesor", value: "asesor" },
  ],
};

const BOT_RESPONSES: Record<string, { text: string; options?: { label: string; value: string }[] }> = {
  catalogo: {
    text: "Tenemos una amplia selección de vehículos de ocasión: Mercedes, BMW, Audi, Peugeot, Jaguar y más. Todos revisados, con ITV al día y garantía incluida. ¿Qué tipo de coche buscas?",
    options: [
      { label: "🔍 Ver catálogo completo", value: "ir_catalogo" },
      { label: "💶 Por precio", value: "precio" },
      { label: "⛽ Por combustible", value: "combustible" },
      { label: "← Volver", value: "inicio" },
    ],
  },
  vender: {
    text: "¡Perfecto! En Astur Ocasión compramos tu coche al mejor precio del mercado asturiano. El proceso es muy sencillo:\n\n1️⃣ Rellenas el formulario de tasación\n2️⃣ Te contactamos en menos de 24h con una oferta real\n3️⃣ Visita y verificación en nuestras instalaciones\n4️⃣ Pago inmediato y nosotros gestionamos el papeleo",
    options: [
      { label: "📝 Solicitar tasación gratis", value: "ir_tasacion" },
      { label: "📞 Hablar con un asesor", value: "asesor" },
      { label: "← Volver", value: "inicio" },
    ],
  },
  info: {
    text: "Todo lo que incluimos en el precio:\n\n✅ Revisión mecánica completa\n✅ ITV en vigor\n✅ Garantía incluida\n✅ Transferencia sin coste adicional\n✅ Sin letra pequeña\n\n¿Algo más en lo que pueda ayudarte?",
    options: [
      { label: "💳 ¿Tienen financiación?", value: "financiacion" },
      { label: "📍 ¿Dónde están?", value: "ubicacion" },
      { label: "⏰ Horario", value: "horario" },
      { label: "← Volver", value: "inicio" },
    ],
  },
  financiacion: {
    text: "Sí, ofrecemos opciones de financiación adaptadas a tu presupuesto con las mejores condiciones del mercado asturiano. Para obtener información personalizada, lo mejor es que contactes con uno de nuestros asesores.",
    options: [
      { label: "📞 Hablar con un asesor", value: "asesor" },
      { label: "← Volver al menú", value: "inicio" },
    ],
  },
  ubicacion: {
    text: "Estamos en **José Manuel Fuente, 2 · 33002 Oviedo, Asturias**.\n\nMuy fácil de encontrar en el centro de Oviedo. Puedes visitarnos de lunes a viernes y también los sábados por la mañana.",
    options: [
      { label: "⏰ Ver horario", value: "horario" },
      { label: "📞 Contactar", value: "asesor" },
      { label: "← Volver", value: "inicio" },
    ],
  },
  horario: {
    text: "Nuestro horario de atención es:\n\n🕙 **Lunes a Viernes**\n10:00 – 13:30 y 16:00 – 20:00\n\n🕙 **Sábados**\n10:00 – 13:30\n\n❌ Domingos: cerrado\n\n📞 También puedes llamarnos al **629 574 957** o escribirnos por WhatsApp.",
    options: [
      { label: "📞 Llamar ahora", value: "llamar" },
      { label: "💬 WhatsApp", value: "whatsapp" },
      { label: "← Volver al menú", value: "inicio" },
    ],
  },
  domingo: {
    text: "Los domingos permanecemos **cerrados**.\n\nPuedes visitarnos de **lunes a viernes** de 10:00 a 13:30 y de 16:00 a 20:00, o los **sábados** de 10:00 a 13:30.\n\n💬 Si tienes prisa, escríbenos por WhatsApp y te respondemos lo antes posible.",
    options: [
      { label: "💬 WhatsApp", value: "whatsapp" },
      { label: "⏰ Ver horario completo", value: "horario" },
      { label: "← Volver al menú", value: "inicio" },
    ],
  },
  sabado: {
    text: "¡Sí, abrimos los sábados! 🎉\n\n🕙 **Sábados: 10:00 – 13:30**\n\nLos sábados por la tarde estamos cerrados. De lunes a viernes tenemos horario partido: 10:00–13:30 y 16:00–20:00.",
    options: [
      { label: "📍 ¿Dónde estáis?", value: "ubicacion" },
      { label: "📞 Llamar para confirmar", value: "llamar" },
      { label: "← Volver al menú", value: "inicio" },
    ],
  },
  garantia: {
    text: "Sí, todos nuestros vehículos incluyen **garantía**. Además:\n\n✅ Revisión mecánica completa antes de la venta\n✅ ITV en vigor\n✅ Transferencia sin coste adicional\n✅ Sin letra pequeña ni sorpresas\n\nSi quieres más detalles sobre la garantía de un vehículo concreto, llámanos o escríbenos.",
    options: [
      { label: "📞 Preguntar por un coche", value: "asesor" },
      { label: "🔍 Ver catálogo", value: "ir_catalogo" },
      { label: "← Volver", value: "inicio" },
    ],
  },
  transferencia: {
    text: "Sí, **la transferencia está incluida en el precio** de todos nuestros vehículos. Nosotros nos encargamos de todo el papeleo, sin coste adicional para ti.\n\nTambién gestionamos el cambio de seguro si lo necesitas.",
    options: [
      { label: "🔍 Ver vehículos disponibles", value: "ir_catalogo" },
      { label: "📞 Hablar con un asesor", value: "asesor" },
      { label: "← Volver", value: "inicio" },
    ],
  },
  contacto: {
    text: "Puedes contactarnos por:\n\n📞 **Teléfono:** 629 574 957\n💬 **WhatsApp:** 629 574 957\n✉️ **Email:** asturocasion@gmail.com\n📍 **Dirección:** José Manuel Fuente, 2 · Oviedo\n\n**Horario de atención:**\nL–V: 10:00–13:30 y 16:00–20:00\nSáb: 10:00–13:30",
    options: [
      { label: "📞 Llamar ahora", value: "llamar" },
      { label: "💬 WhatsApp", value: "whatsapp" },
      { label: "← Volver al menú", value: "inicio" },
    ],
  },
  itv: {
    text: "Sí, todos los vehículos que vendemos tienen la **ITV en vigor** en el momento de la entrega. Es parte de nuestra revisión estándar, sin coste adicional.",
    options: [
      { label: "ℹ️ ¿Qué más incluye el precio?", value: "info" },
      { label: "🔍 Ver vehículos", value: "ir_catalogo" },
      { label: "← Volver", value: "inicio" },
    ],
  },
  asesor: {
    text: "¡Claro! Puedes contactar con nuestro equipo por teléfono o WhatsApp y te atenderemos encantados.\n\n⏰ Horario: L–V 10:00–13:30 y 16:00–20:00 · Sáb 10:00–13:30",
    options: [
      { label: "📞 Llamar: 629 574 957", value: "llamar" },
      { label: "💬 WhatsApp: 629 574 957", value: "whatsapp" },
      { label: "← Volver al menú", value: "inicio" },
    ],
  },
  precio: {
    text: "Tenemos vehículos para todos los presupuestos, desde 8.000€ hasta más de 40.000€. Todos con garantía y transferencia incluida. ¿Quieres ver el catálogo completo?",
    options: [
      { label: "🔍 Ver catálogo", value: "ir_catalogo" },
      { label: "← Volver", value: "inicio" },
    ],
  },
  combustible: {
    text: "Disponemos de vehículos en todas las opciones de combustible: Diésel, Gasolina, Híbrido y Eléctrico. ¿Tienes preferencia?",
    options: [
      { label: "⛽ Diésel", value: "ir_catalogo" },
      { label: "🔋 Híbrido / Eléctrico", value: "ir_catalogo" },
      { label: "🔍 Ver todos", value: "ir_catalogo" },
    ],
  },
  no_entiendo: {
    text: "No he entendido bien tu pregunta 😅 Pero puedo ayudarte con esto:",
    options: INITIAL_MESSAGE.options,
  },
  inicio: {
    text: "¿En qué más puedo ayudarte?",
    options: INITIAL_MESSAGE.options,
  },
};

function renderText(text: string) {
  return text.split("\n").map((line, i) => {
    const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return (
      <span key={i}>
        <span dangerouslySetInnerHTML={{ __html: formatted }} />
        {i < text.split("\n").length - 1 && <br />}
      </span>
    );
  });
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  let msgId = useRef(1);

  // Load real vehicle data once
  useEffect(() => {
    supabase
      .from("vehicles")
      .select("brand, model, year, price, fuel_type, status")
      .eq("status", "available")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setVehicles(data as Vehicle[]);
      });
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const buildDynamicResponse = (key: string): { text: string; options?: { label: string; value: string }[] } => {
    const base = BOT_RESPONSES[key];
    if (!base) return { text: "¿En qué más puedo ayudarte?", options: INITIAL_MESSAGE.options };

    if (key === "catalogo" && vehicles.length > 0) {
      const list = vehicles
        .slice(0, 6)
        .map((v) => `• ${v.brand} ${v.model} (${v.year}) — ${Number(v.price).toLocaleString("es-ES")}€`)
        .join("\n");
      return {
        text: `Tenemos **${vehicles.length} vehículos disponibles** ahora mismo:\n\n${list}${vehicles.length > 6 ? `\n…y ${vehicles.length - 6} más` : ""}\n\nTodos revisados, con ITV al día y garantía incluida.`,
        options: base.options,
      };
    }

    if (key === "precio" && vehicles.length > 0) {
      const prices = vehicles.map((v) => Number(v.price)).filter(Boolean);
      const min = Math.min(...prices).toLocaleString("es-ES");
      const max = Math.max(...prices).toLocaleString("es-ES");
      return {
        text: `Tenemos vehículos desde **${min}€** hasta **${max}€**. Todos con garantía y transferencia incluida. ¿Quieres ver el catálogo completo?`,
        options: base.options,
      };
    }

    if (key === "combustible" && vehicles.length > 0) {
      const fuelSet = Array.from(new Set(vehicles.map((v) => v.fuel_type).filter(Boolean)));
      return {
        text: `Disponemos de vehículos en: **${fuelSet.join(", ")}**. ¿Tienes preferencia?`,
        options: base.options,
      };
    }

    return base;
  };

  const addBotMessage = (key: string) => {
    const resp = buildDynamicResponse(key);
    if (!resp) return;

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: msgId.current++, from: "bot", text: resp.text, options: resp.options },
      ]);
    }, 800);
  };

  const handleOption = (value: string) => {
    if (value === "ir_catalogo") {
      window.location.href = "/catalogo";
      return;
    }
    if (value === "ir_tasacion") {
      window.location.href = "/compramos-tu-coche";
      return;
    }
    if (value === "llamar") {
      window.location.href = "tel:629574957";
      return;
    }
    if (value === "whatsapp") {
      const summary = vehicles.length > 0
        ? `Hola, vi que tenéis ${vehicles.length} vehículos disponibles (${vehicles.slice(0, 3).map(v => `${v.brand} ${v.model}`).join(", ")}…) y me gustaría obtener más información.`
        : "Hola, me gustaría obtener información sobre vuestros vehículos de ocasión.";
      window.open(`https://wa.me/34629574957?text=${encodeURIComponent(summary)}`, "_blank");
      return;
    }

    const label = INITIAL_MESSAGE.options?.find((o) => o.value === value)?.label
      ?? messages.flatMap((m) => m.options ?? []).find((o) => o.value === value)?.label
      ?? value;

    setMessages((prev) => [
      ...prev,
      { id: msgId.current++, from: "user", text: label },
    ]);
    addBotMessage(value);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [...prev, { id: msgId.current++, from: "user", text }]);

    // Keyword matching — orden de mayor a menor especificidad
    const lower = text.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // quita tildes para comparar
    let key = "no_entiendo";

    if (lower.includes("domingo")) key = "domingo";
    else if (lower.includes("sabado") || lower.includes("sabados")) key = "sabado";
    else if (lower.includes("horario") || lower.includes("abre") || lower.includes("cierra") || lower.includes("cierre") || lower.includes("cuando abri") || lower.includes("a que hora") || lower.includes("apertura") || lower.includes("tarde") || lower.includes("manana") || lower.includes("mañana") || lower.includes("lunes") || lower.includes("viernes") || lower.includes("festivo")) key = "horario";
    else if (lower.includes("garantia") || lower.includes("garantias") || lower.includes("garantizado")) key = "garantia";
    else if (lower.includes("transferencia") || lower.includes("papeleo") || lower.includes("tramite") || lower.includes("documentacion")) key = "transferencia";
    else if (lower.includes("itv") || lower.includes("revision") || lower.includes("inspeccion")) key = "itv";
    else if (lower.includes("financ") || lower.includes("credito") || lower.includes("cuota") || lower.includes("plazos") || lower.includes("pago")) key = "financiacion";
    else if (lower.includes("vend") || lower.includes("tasac") || lower.includes("cambio") || lower.includes("quiero vender")) key = "vender";
    else if (lower.includes("precio") || lower.includes("€") || lower.includes("cuanto cuesta") || lower.includes("cuanto vale") || lower.includes("coste")) key = "precio";
    else if (lower.includes("combustible") || lower.includes("diesel") || lower.includes("gasolina") || lower.includes("hibrido") || lower.includes("electrico") || lower.includes("gasoil")) key = "combustible";
    else if (lower.includes("coche") || lower.includes("catalogo") || lower.includes("vehiculo") || lower.includes("stock") || lower.includes("comprar") || lower.includes("disponible") || lower.includes("modelo") || lower.includes("marca")) key = "catalogo";
    else if (lower.includes("donde") || lower.includes("ubic") || lower.includes("direccion") || lower.includes("calle") || lower.includes("oviedo") || lower.includes("como llegar") || lower.includes("instalacion")) key = "ubicacion";
    else if (lower.includes("telefono") || lower.includes("numero") || lower.includes("email") || lower.includes("correo") || lower.includes("contacto") || lower.includes("contactar")) key = "contacto";
    else if (lower.includes("whatsapp") || lower.includes("wsp") || lower.includes("wasap")) key = "asesor";
    else if (lower.includes("hablar") || lower.includes("asesor") || lower.includes("persona") || lower.includes("llamar") || lower.includes("agente")) key = "asesor";
    else if (lower.includes("info") || lower.includes("incluye") || lower.includes("que dan") || lower.includes("servicio")) key = "info";

    addBotMessage(key);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat con asistente"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 1000,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: open ? "#1D1D1F" : "#25D366",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: open ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(37,211,102,0.45)",
          transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
          transform: "scale(1)",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
      >
        {open
          ? <X size={24} color="#FFFFFF" />
          : (
            <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          )
        }
      </button>

      {/* Notification dot */}
      {!open && (
        <span style={{
          position: "fixed",
          bottom: "calc(1.5rem + 40px)",
          right: "calc(1.5rem + 2px)",
          zIndex: 1001,
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "#34C759",
          border: "2px solid #FFFFFF",
        }} />
      )}

      {/* Chat panel */}
      <div
        className="chatbot-panel"
        style={{
          position: "fixed",
          bottom: "calc(1.5rem + 68px)",
          right: "1.5rem",
          zIndex: 999,
          width: "340px",
          maxHeight: "520px",
          background: "#FFFFFF",
          borderRadius: "20px",
          boxShadow: "0 16px 60px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transform: open ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}
      >
        {/* Header */}
        <div style={{ background: "#0071E3", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: "800", fontSize: "0.8rem", color: "#FFFFFF", flexShrink: 0 }}>
            {BOT_AVATAR}
          </div>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: "700", color: "#FFFFFF", margin: 0 }}>{BOT_NAME}</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.7)", margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34C759", display: "inline-block" }} />
              En línea ahora
            </p>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.from === "bot" ? "flex-start" : "flex-end", gap: "0.5rem" }}>
              <div
                style={{
                  maxWidth: "85%",
                  background: msg.from === "bot" ? "#F5F5F7" : "#0071E3",
                  color: msg.from === "bot" ? "#1D1D1F" : "#FFFFFF",
                  borderRadius: msg.from === "bot" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                  padding: "0.65rem 0.9rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.83rem",
                  lineHeight: 1.55,
                }}
              >
                {renderText(msg.text)}
              </div>
              {msg.options && msg.from === "bot" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", width: "100%" }}>
                  {msg.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleOption(opt.value)}
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E8E8ED",
                        borderRadius: "10px",
                        padding: "0.5rem 0.85rem",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.8rem",
                        color: "#0071E3",
                        fontWeight: "500",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "background 0.15s, border-color 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#F0F6FF"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#0071E3"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8E8ED"; }}
                    >
                      {opt.label}
                      <ChevronRight size={12} style={{ flexShrink: 0, opacity: 0.5 }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "0.65rem 0.9rem", background: "#F5F5F7", borderRadius: "4px 16px 16px 16px", width: "fit-content" }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#86868B", display: "block", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid #F0F0F5", display: "flex", gap: "0.5rem", background: "#FFFFFF" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe tu pregunta..."
            style={{
              flex: 1,
              border: "1px solid #E8E8ED",
              borderRadius: "10px",
              padding: "0.55rem 0.85rem",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.83rem",
              color: "#1D1D1F",
              outline: "none",
              background: "#F5F5F7",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: input.trim() ? "#0071E3" : "#E8E8ED",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: input.trim() ? "pointer" : "default",
              transition: "background 0.15s",
              flexShrink: 0,
            }}
          >
            <Send size={15} color={input.trim() ? "#FFFFFF" : "#86868B"} />
          </button>
        </div>

        <p style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", color: "#C0C0C0", padding: "0.4rem 0 0.6rem" }}>
          Asistente virtual · Astur Ocasión
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @media (max-width: 400px) {
          .chatbot-panel { width: calc(100vw - 2rem) !important; right: 1rem !important; }
        }
      `}</style>
    </>
  );
}
