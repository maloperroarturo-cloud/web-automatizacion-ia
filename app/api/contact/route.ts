import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type ContactPayload = {
  nombre?: string;
  negocio?: string;
  telefono?: string;
  email?: string;
  mensaje?: string;
};

function sanitize(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, 1200);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { message: "La solicitud no tiene un formato valido." },
      { status: 400 }
    );
  }

  const payload: Required<ContactPayload> = {
    nombre: sanitize(body.nombre),
    negocio: sanitize(body.negocio),
    telefono: sanitize(body.telefono),
    email: sanitize(body.email),
    mensaje: sanitize(body.mensaje)
  };

  if (!payload.nombre) {
    return NextResponse.json(
      { message: "El nombre es obligatorio." },
      { status: 400 }
    );
  }

  if (!payload.telefono && !payload.email) {
    return NextResponse.json(
      { message: "Indica al menos un telefono o un email." },
      { status: 400 }
    );
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return NextResponse.json({ message: "El email no es valido." }, { status: 400 });
  }

  if (!payload.mensaje) {
    return NextResponse.json(
      { message: "El mensaje es obligatorio." },
      { status: 400 }
    );
  }

  if (!resendApiKey || !toEmail) {
    return NextResponse.json(
      { message: "Faltan las variables RESEND_API_KEY o CONTACT_TO_EMAIL." },
      { status: 500 }
    );
  }

  const resend = new Resend(resendApiKey);
  const subject = `Nueva solicitud: ${payload.nombre}${payload.negocio ? ` - ${payload.negocio}` : ""}`;
  const rows = [
    ["Nombre", payload.nombre],
    ["Negocio", payload.negocio || "No indicado"],
    ["Telefono", payload.telefono || "No indicado"],
    ["Email", payload.email || "No indicado"],
    ["Mensaje", payload.mensaje]
  ];

  try {
    const { data, error } = await resend.emails.send({
      from: "NexaFlow <onboarding@resend.dev>",
      to: [toEmail],
      replyTo: payload.email || undefined,
      subject,
      text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; background: #080c14; padding: 32px; color: #ffffff; line-height: 1.5;">
          <div style="max-width: 640px; margin: 0 auto; background: #101827; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; overflow: hidden;">
            <div style="padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.12);">
              <p style="margin: 0 0 8px; color: #00e5ff; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;">Nueva solicitud web</p>
              <h1 style="margin: 0; font-size: 24px;">Contacto desde NexaFlow</h1>
            </div>
            <div style="padding: 24px;">
              ${rows
                .map(
                  ([label, value]) => `
                    <div style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.10);">
                      <p style="margin: 0 0 6px; color: rgba(255,255,255,0.52); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;">${escapeHtml(label)}</p>
                      <p style="margin: 0; color: #ffffff; font-size: 16px;">${escapeHtml(value)}</p>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error("Resend rejected contact email", error);

      return NextResponse.json(
        {
          message:
            error.message ??
            "Resend ha rechazado el envio. Revisa RESEND_API_KEY y CONTACT_TO_EMAIL."
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (error) {
    console.error("Contact email failed", error);

    return NextResponse.json(
      { message: "No se pudo enviar el email. Revisa la configuracion de Resend." },
      { status: 500 }
    );
  }
}
