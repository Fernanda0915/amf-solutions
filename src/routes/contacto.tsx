import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — AMF Solutions" },
      {
        name: "description",
        content:
          "Contáctanos para cotizaciones de materiales industriales. Tel: 664 213 7845 — ventas@amfsolutions.mx",
      },
      { property: "og:title", content: "Contacto — AMF Solutions" },
      {
        property: "og:description",
        content:
          "Solicita tu cotización: ventas@amfsolutions.mx | 664 213 7845",
      },
    ],
  }),
  component: ContactoPage,
});

function ContactoPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/mwvyprgz", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <Layout>
      <PageHero
        eyebrow="Contáctanos"
        title="Hablemos de tu proyecto"
        subtitle="Estamos listos para asesorarte y ofrecerte la mejor solución de suministro industrial."
      />

      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          
          {/* INFO */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-navy">Información de contacto</h2>
            <p className="mt-3 text-muted-foreground">
              Escríbenos o llámanos. Te respondemos en menos de 24 horas hábiles.
            </p>

            <div className="mt-9 space-y-9">
              {[
                { icon: Mail, label: "Correo", value: "ventas@amfsolutions.mx", href: "mailto:ventas@amfsolutions.mx" },
                { icon: Phone, label: "Teléfono", value: "664 213 7845", href: "tel:+526642137845" },
                { icon: MapPin, label: "Ubicación", value: "Tijuana, Baja California" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-soft">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-navy text-white">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </div>
                    {item.href ? (
                      <a href={item.href} className="text-base font-semibold text-navy hover:text-orange-accent">
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-base font-semibold text-navy">{item.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FORMULARIO */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 rounded-2xl border border-border bg-card p-8 shadow-elegant"
          >
            {/* Config Formspree */}
            <input type="hidden" name="_subject" value="Nuevo mensaje desde la web AMF" />
            <input type="text" name="_gotcha" style={{ display: "none" }} />

            <h2 className="text-2xl font-bold text-navy">Envíanos un mensaje</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Completa el formulario y un asesor te contactará a la brevedad.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Nombre completo" name="nombre" required />
              <Field label="Empresa" name="empresa" />
              <Field label="Correo electrónico" name="correo" type="email" required />
              <Field label="Teléfono" name="telefono" type="tel" />
            </div>

            <div className="mt-5">
              <Field label="Asunto" name="asunto" required />
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-navy">Mensaje *</label>
              <textarea
                name="mensaje"
                rows={5}
                required
                className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-orange-accent focus:ring-2 focus:ring-orange-accent/20"
                placeholder="Cuéntanos qué materiales necesitas..."
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-gradient-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-soft transition-smooth hover:opacity-90"
            >
              {status === "sending" ? "Enviando..." : "Enviar mensaje"} <Send size={16} />
            </button>

            {/* MENSAJES */}
            {status === "success" && (
              <div className="mt-5 rounded-md border border-green-500/30 bg-green-50 px-4 py-3 text-sm text-green-700">
                ✅ ¡Mensaje enviado correctamente! Te contactaremos pronto.
              </div>
            )}

            {status === "error" && (
              <div className="mt-5 rounded-md border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-700">
                ❌ Hubo un error al enviar. Intenta nuevamente.
              </div>
            )}
          </form>
        </div>
      </section>
    </Layout>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-navy">
        {label} {required && "*"}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition-smooth focus:border-orange-accent focus:ring-2 focus:ring-orange-accent/20"
      />
    </div>
  );
}