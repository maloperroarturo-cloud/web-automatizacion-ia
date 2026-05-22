"use client";

import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarCheck,
  Check,
  ChevronRight,
  Clock3,
  Dumbbell,
  Gauge,
  Globe,
  Menu,
  MessageCircle,
  QrCode,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Utensils,
  Wrench,
  X,
  Zap
} from "lucide-react";
import { type FormEvent, useState } from "react";

const services = [
  {
    icon: CalendarCheck,
    title: "Reservas sin friccion",
    problem: "Llamadas perdidas, mensajes sin responder y huecos vacios en la agenda.",
    gain: "Mas citas cerradas, menos ausencias y una agenda que se organiza sola.",
    points: ["Confirmaciones automaticas", "Recordatorios por WhatsApp", "Reglas por horario y servicio"]
  },
  {
    icon: QrCode,
    title: "Carta QR optimizada",
    problem: "Cartas desactualizadas, precios dificiles de cambiar y pocas ventas sugeridas.",
    gain: "Menus vivos, promociones al instante y mejor ticket medio por cliente.",
    points: ["Destacados comerciales", "Cambios sin imprimir", "Analitica de productos"]
  },
  {
    icon: Bot,
    title: "Atencion guiada",
    problem: "El equipo repite las mismas respuestas y los contactos se enfrian.",
    gain: "Clientes atendidos al momento, datos ordenados y traspaso limpio al equipo.",
    points: ["Preguntas frecuentes", "Filtro de interesados", "Contexto antes de responder"]
  },
  {
    icon: Globe,
    title: "Web + procesos",
    problem: "Una web que informa, pero no captura, no mide y no activa acciones.",
    gain: "Un sistema comercial que convierte visitas en solicitudes y tareas claras.",
    points: ["Landing comercial", "Formularios conectados", "Avisos y seguimiento"]
  }
];

const useCases = [
  {
    icon: Scissors,
    sector: "Peluquerias",
    loss: "Huecos por cancelaciones y mensajes fuera de horario.",
    win: "Agenda mas estable, recordatorios y venta de servicios adicionales."
  },
  {
    icon: Utensils,
    sector: "Bares",
    loss: "Carta lenta de actualizar y promociones que no llegan al cliente.",
    win: "Carta digital, destacados por horario y consultas centralizadas."
  },
  {
    icon: Stethoscope,
    sector: "Clinicas",
    loss: "Recepcion saturada y pacientes sin clasificar correctamente.",
    win: "Citas mejor filtradas, datos previos y menos llamadas repetidas."
  },
  {
    icon: Dumbbell,
    sector: "Gimnasios",
    loss: "Leads que preguntan precios y desaparecen sin seguimiento.",
    win: "Captura, recomendacion de plan y seguimiento para cerrar altas."
  },
  {
    icon: Wrench,
    sector: "Talleres",
    loss: "Turnos desordenados y presupuestos con informacion incompleta.",
    win: "Solicitudes claras, datos del vehiculo y avisos de estado."
  }
];

const demoTabs = [
  { label: "Reserva peluqueria", icon: CalendarCheck },
  { label: "Carta QR", icon: QrCode },
  { label: "Chatbot", icon: Bot }
];

const bookingServices = [
  { name: "Corte + peinado", duration: "45 min", price: "28 EUR" },
  { name: "Color completo", duration: "90 min", price: "64 EUR" },
  { name: "Tratamiento hidratante", duration: "35 min", price: "36 EUR" }
];

const bookingDays = ["Martes 28", "Miercoles 29", "Jueves 30"];
const bookingHours = ["10:30", "12:00", "16:15", "18:30"];

const menuData = [
  {
    category: "Entrantes",
    products: [
      ["Croquetas cremosas", "8.50 EUR"],
      ["Ensaladilla premium", "7.90 EUR"]
    ]
  },
  {
    category: "Principales",
    products: [
      ["Burger smash", "13.50 EUR"],
      ["Tacos de pollo", "11.80 EUR"]
    ]
  },
  {
    category: "Bebidas",
    products: [
      ["Limonada natural", "3.90 EUR"],
      ["Vino de la casa", "4.20 EUR"]
    ]
  }
];

const chatMessages = [
  { role: "client", text: "Hola, cuanto cuesta un corte y que horario teneis hoy?" },
  { role: "system", text: "El corte + peinado cuesta 28 EUR. Hoy tenemos huecos a las 16:15 y 18:30." },
  { role: "client", text: "Perfecto, puedo reservar a las 18:30?" },
  { role: "system", text: "Claro. Te reservo a las 18:30. Dejame nombre y telefono para confirmar la cita." }
];

const stats = [
  ["+ citas", "sin depender de estar siempre al telefono"],
  ["- tareas", "repetitivas para el equipo"],
  ["+ control", "sobre contactos, tiempos y resultados"]
];

const painPoints = [
  "Clientes que escriben y no reciben respuesta a tiempo",
  "Horas perdidas coordinando citas, precios o disponibilidad",
  "Solicitudes sin datos suficientes para tomar accion",
  "Webs bonitas que no convierten en reservas ni oportunidades"
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);
  const [bookingService, setBookingService] = useState(bookingServices[0]);
  const [bookingDay, setBookingDay] = useState(bookingDays[0]);
  const [bookingHour, setBookingHour] = useState(bookingHours[2]);
  const [menuCategory, setMenuCategory] = useState(menuData[0]);
  const [chatStep, setChatStep] = useState(2);
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [contactMessage, setContactMessage] = useState("");

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactStatus("sending");
    setContactMessage("");

    const form = event.currentTarget;
    const formData = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result?.message ?? "No se ha podido enviar el formulario.");
      }

      setContactStatus("success");
      setContactMessage("Solicitud enviada correctamente. Te responderemos lo antes posible.");
      form.reset();
    } catch (error) {
      setContactStatus("error");
      setContactMessage(error instanceof Error ? error.message : "Error al enviar. Intentalo de nuevo.");
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-obsidian text-white">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-obsidian/78 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="NexaFlow">
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-cyan/30 bg-cyan/12 text-cyan shadow-glow">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold tracking-normal text-white">
              NexaFlow
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-white/66 lg:flex">
            <a href="#servicios" className="transition hover:text-white">Soluciones</a>
            <a href="#demos" className="transition hover:text-white">Demos</a>
            <a href="#sectores" className="transition hover:text-white">Sectores</a>
            <a href="#contacto" className="transition hover:text-white">Contacto</a>
          </div>

          <a
            href="#contacto"
            className="hidden items-center gap-2 rounded-md bg-cyan px-4 py-2.5 text-sm font-semibold text-obsidian shadow-glow transition hover:-translate-y-0.5 hover:bg-white lg:flex"
          >
            Diagnosticar mi operacion <ArrowRight className="h-4 w-4" />
          </a>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-md border border-white/12 bg-white/8 lg:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-white/10 bg-obsidian px-4 py-4 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm font-semibold text-white">
              {[
                ["servicios", "Soluciones"],
                ["demos", "Demos"],
                ["sectores", "Sectores"],
                ["contacto", "Contacto"]
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={`#${href}`}
                  className="rounded-md px-2 py-2 hover:bg-white/8"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <section id="inicio" className="tech-grid relative pt-28 sm:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(0,229,255,0.22),transparent_30rem),radial-gradient(circle_at_85%_12%,rgba(133,92,255,0.24),transparent_28rem),linear-gradient(180deg,rgba(8,12,20,0)_0%,#080C14_88%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pb-24">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-md border border-cyan/25 bg-cyan/10 px-3 py-2 text-sm font-semibold text-cyan shadow-glow">
              <Gauge className="h-4 w-4" />
              Optimizacion de servicios para negocios con demanda real
            </div>
            <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-normal text-white sm:text-5xl lg:text-6xl">
              Menos tareas repetidas. Mas reservas, ventas y control operativo.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Disenamos sistemas digitales para que tu negocio responda antes,
              pierda menos oportunidades y trabaje con procesos claros desde el
              primer contacto hasta el seguimiento.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan px-6 py-4 text-base font-semibold text-obsidian shadow-glow transition hover:-translate-y-0.5 hover:bg-white"
              >
                Quiero optimizar mi negocio <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#servicios"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/14 bg-white/8 px-6 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:border-cyan/60"
              >
                Ver que problemas resolvemos <ChevronRight className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map(([value, label]) => (
                <div key={value} className="rounded-lg border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                  <p className="font-display text-xl font-semibold text-cyan">{value}</p>
                  <p className="mt-1 text-xs leading-5 text-white/62">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[540px]">
            <div className="absolute inset-0 rounded-[2rem] border border-cyan/20 bg-white/[0.04] shadow-glow" />
            <div className="absolute inset-3 overflow-hidden rounded-[1.65rem] border border-white/10 bg-[#0B111D]/92 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-cyan">Centro de control</p>
                  <p className="mt-1 font-display text-xl font-semibold">Operacion optimizada</p>
                </div>
                <span className="rounded-md bg-cyan px-3 py-1 text-xs font-bold text-obsidian">ACTIVO</span>
              </div>
              <div className="mt-5 grid gap-4">
                {[
                  ["Entrada", "Consulta recibida", "Cliente pide disponibilidad y precio"],
                  ["Orden", "Datos estructurados", "Servicio, horario y prioridad detectados"],
                  ["Accion", "Equipo avisado", "Siguiente paso listo para ejecutar"]
                ].map(([title, tag, text], index) => (
                  <div key={title} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-cyan/12 font-display font-semibold text-cyan">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-white">{title}</p>
                          <p className="text-sm text-white/58">{text}</p>
                        </div>
                      </div>
                      <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-white/72">{tag}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-cyan/20 bg-cyan/10 p-4">
                  <BarChart3 className="h-6 w-6 text-cyan" />
                  <p className="mt-3 text-sm font-semibold text-white/68">Conversion</p>
                  <p className="mt-1 font-display text-4xl font-semibold text-white">+31%</p>
                  <div className="mt-4 h-2 rounded-full bg-white/10">
                    <div className="h-2 w-4/5 rounded-full bg-cyan" />
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                  <Clock3 className="h-6 w-6 text-violet" />
                  <p className="mt-3 font-display text-4xl font-semibold">8.6h</p>
                  <p className="text-sm text-white/58">recuperadas por semana</p>
                </div>
              </div>
              <div className="mt-5 rounded-lg border border-white/10 bg-[#101827] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/42">Cuellos de botella detectados</p>
                <div className="mt-4 space-y-3">
                  {painPoints.slice(0, 3).map((item) => (
                    <p key={item} className="flex items-start gap-3 text-sm text-white/72">
                      <Zap className="mt-0.5 h-4 w-4 shrink-0 text-cyan" /> {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="relative bg-obsidian py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan">Soluciones</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-5xl">
              No vendemos herramientas sueltas. Eliminamos puntos de fuga.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/62">
              Cada servicio se plantea desde una pregunta simple: que esta
              frenando tus ventas, tu atencion o tu operacion diaria.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <article key={service.title} className="group rounded-xl border border-white/10 bg-white/[0.055] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-cyan/40 hover:bg-white/[0.08] hover:shadow-glow">
                <service.icon className="h-8 w-8 text-cyan" />
                <h3 className="mt-5 font-display text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-rose">Problema</p>
                <p className="mt-2 text-sm leading-6 text-white/58">{service.problem}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-cyan">Ganancia</p>
                <p className="mt-2 text-sm leading-6 text-white/78">{service.gain}</p>
                <ul className="mt-5 space-y-3">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm font-medium text-white/84">
                      <Check className="h-4 w-4 text-cyan" /> {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="demos" className="relative border-y border-white/10 bg-[#0B111D] py-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(0,229,255,0.13),transparent_24rem)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan">Demos operativas</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-5xl">
              Tres experiencias reales para ver como se siente el sistema.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/62">
              No son formularios conectados todavia, pero estan disenados como
              prototipos profesionales: reserva, carta digital y atencion
              conversacional con apariencia de producto listo para negocio.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {demoTabs.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => setActiveDemo(index)}
                  className={`rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                    activeDemo === index
                      ? "bg-cyan text-obsidian shadow-glow"
                      : "border border-white/12 bg-white/6 text-white/70 hover:border-cyan/50 hover:text-white"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.06] p-4 shadow-glow backdrop-blur sm:p-6">
            {activeDemo === 0 && (
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <p className="text-sm font-semibold text-cyan">Demo de reserva para peluqueria</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                    El cliente elige servicio, dia, hora y deja sus datos.
                  </h3>
                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/42">Servicio</p>
                      <div className="grid gap-3">
                        {bookingServices.map((service) => (
                          <button
                            key={service.name}
                            onClick={() => setBookingService(service)}
                            className={`rounded-lg border p-4 text-left transition ${
                              bookingService.name === service.name
                                ? "border-cyan bg-cyan/10"
                                : "border-white/10 bg-[#101827] hover:border-cyan/40"
                            }`}
                          >
                            <span className="block font-semibold text-white">{service.name}</span>
                            <span className="mt-1 block text-sm text-white/52">{service.duration} · {service.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="text-sm font-semibold text-white">
                        Dia
                        <select
                          value={bookingDay}
                          onChange={(event) => setBookingDay(event.target.value)}
                          className="mt-2 w-full rounded-md border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none focus:border-cyan"
                        >
                          {bookingDays.map((day) => <option key={day}>{day}</option>)}
                        </select>
                      </label>
                      <label className="text-sm font-semibold text-white">
                        Hora
                        <select
                          value={bookingHour}
                          onChange={(event) => setBookingHour(event.target.value)}
                          className="mt-2 w-full rounded-md border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none focus:border-cyan"
                        >
                          {bookingHours.map((hour) => <option key={hour}>{hour}</option>)}
                        </select>
                      </label>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input className="rounded-md border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none placeholder:text-white/32 focus:border-cyan" placeholder="Nombre del cliente" defaultValue="Laura Martin" />
                      <input className="rounded-md border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none placeholder:text-white/32 focus:border-cyan" placeholder="Telefono" defaultValue="+34 612 345 678" />
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-cyan/20 bg-[#080C14] p-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-cyan">Resumen de cita</p>
                      <p className="mt-1 font-display text-xl font-semibold text-white">Salon Urban Look</p>
                    </div>
                    <span className="rounded-md bg-cyan px-3 py-1 text-xs font-bold text-obsidian">PRE-RESERVA</span>
                  </div>
                  <div className="mt-5 space-y-4 text-sm">
                    {[
                      ["Servicio", bookingService.name],
                      ["Duracion", bookingService.duration],
                      ["Precio", bookingService.price],
                      ["Fecha", `${bookingDay} · ${bookingHour}`],
                      ["Cliente", "Laura Martin"],
                      ["Telefono", "+34 612 345 678"]
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-4 rounded-lg bg-white/[0.06] px-4 py-3">
                        <span className="text-white/48">{label}</span>
                        <span className="text-right font-semibold text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-5 w-full rounded-md bg-cyan px-5 py-3 font-semibold text-obsidian">
                    Confirmar cita
                  </button>
                </div>
              </div>
            )}

            {activeDemo === 1 && (
              <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
                <div>
                  <p className="text-sm font-semibold text-cyan">Demo de carta QR</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                    Carta digital editable con categorias, productos y precios.
                  </h3>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {menuData.map((category) => (
                      <button
                        key={category.category}
                        onClick={() => setMenuCategory(category)}
                        className={`rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                          menuCategory.category === category.category
                            ? "bg-cyan text-obsidian"
                            : "border border-white/10 bg-[#101827] text-white/70 hover:border-cyan/40"
                        }`}
                      >
                        {category.category}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 rounded-xl border border-white/10 bg-[#101827] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/42">Editor rapido</p>
                    <div className="mt-4 grid gap-3">
                      <input className="rounded-md border border-white/10 bg-[#080C14] px-4 py-3 text-white outline-none focus:border-cyan" value={menuCategory.category} readOnly />
                      {menuCategory.products.map(([product, price]) => (
                        <div key={product} className="grid gap-3 sm:grid-cols-[1fr_120px]">
                          <input className="rounded-md border border-white/10 bg-[#080C14] px-4 py-3 text-white outline-none focus:border-cyan" defaultValue={product} />
                          <input className="rounded-md border border-white/10 bg-[#080C14] px-4 py-3 text-white outline-none focus:border-cyan" defaultValue={price} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.6rem] border border-cyan/20 bg-[#080C14] p-4 shadow-glow">
                  <div className="rounded-[1.2rem] border border-white/10 bg-[#101827] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-cyan">QR menu</p>
                        <h4 className="mt-2 font-display text-3xl font-semibold text-white">Norte Bar</h4>
                        <p className="mt-2 text-sm text-white/52">Carta actualizada en tiempo real</p>
                      </div>
                      <span className="rounded-md bg-white px-3 py-2 text-xs font-bold text-obsidian">QR</span>
                    </div>
                    <div className="mt-6 rounded-lg border border-white/10 bg-[#080C14] p-4">
                      <p className="font-display text-xl font-semibold text-white">{menuCategory.category}</p>
                      <div className="mt-4 space-y-3">
                        {menuCategory.products.map(([product, price]) => (
                          <div key={product} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                            <div>
                              <p className="font-semibold text-white">{product}</p>
                              <p className="text-sm text-white/46">Disponible · recomendado</p>
                            </div>
                            <p className="font-display text-lg font-semibold text-cyan">{price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 2 && (
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="text-sm font-semibold text-cyan">Demo de chatbot IA</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-white">
                    Conversacion simulada para precios, horarios y reserva de cita.
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-white/62">
                    El asistente resuelve preguntas frecuentes, propone horarios
                    y pide los datos justos para que el equipo reciba una cita
                    lista para confirmar.
                  </p>
                  <div className="mt-6 grid gap-3">
                    {["Preguntar precios", "Consultar horarios", "Reservar cita"].map((action, index) => (
                      <button
                        key={action}
                        onClick={() => setChatStep(index + 2)}
                        className="rounded-lg border border-white/10 bg-[#101827] px-4 py-3 text-left font-semibold text-white transition hover:border-cyan/40"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-cyan/20 bg-[#080C14] p-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan/12 text-cyan">
                        <Bot className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-white">Asistente Salon Urban Look</p>
                        <p className="text-xs text-white/46">Online · responde en segundos</p>
                      </div>
                    </div>
                    <span className="rounded-md bg-cyan px-3 py-1 text-xs font-bold text-obsidian">LIVE</span>
                  </div>
                  <div className="mt-5 space-y-3">
                    {chatMessages.slice(0, chatStep + 1).map((message, index) => (
                      <div
                        key={`${message.text}-${index}`}
                        className={`flex ${message.role === "client" ? "justify-end" : "justify-start"}`}
                      >
                        <p className={`max-w-[82%] rounded-xl px-4 py-3 text-sm leading-6 ${
                          message.role === "client"
                            ? "bg-cyan text-obsidian"
                            : "bg-white/[0.08] text-white/76"
                        }`}>
                          {message.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-2 rounded-lg border border-white/10 bg-[#101827] px-4 py-3 text-sm text-white/40">
                    Escribe tu respuesta...
                    <ArrowRight className="ml-auto h-4 w-4 text-cyan" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="sectores" className="bg-obsidian py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan">Sectores</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-5xl">
                Cada negocio pierde dinero de una forma distinta.
              </h2>
            </div>
            <a href="#contacto" className="inline-flex items-center gap-2 font-semibold text-cyan">
              Analizar mi caso <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {useCases.map((item) => (
              <article key={item.sector} className="rounded-xl border border-white/10 bg-white/[0.055] p-5 transition hover:border-cyan/40">
                <item.icon className="h-7 w-7 text-cyan" />
                <h3 className="mt-5 font-display text-lg font-semibold text-white">{item.sector}</h3>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-rose">Lo que se pierde</p>
                <p className="mt-2 text-sm leading-6 text-white/58">{item.loss}</p>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-cyan">Lo que se gana</p>
                <p className="mt-2 text-sm leading-6 text-white/78">{item.win}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0B111D] py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan">Metodo</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-5xl">
              Primero detectamos la fuga. Despues construimos el sistema.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["01", "Mapa de friccion", "Localizamos tareas lentas, contactos perdidos y pasos que dependen demasiado de una persona."],
              ["02", "Sistema operativo", "Creamos web, formularios, reservas, mensajes y avisos conectados al flujo real del negocio."],
              ["03", "Mejora continua", "Medimos tiempos, conversiones y bloqueos para ajustar el sistema con datos."]
            ].map(([num, title, text]) => (
              <div key={num} className="rounded-xl border border-white/10 bg-white/[0.06] p-5">
                <p className="font-display text-3xl font-semibold text-cyan">{num}</p>
                <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="relative bg-obsidian py-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_60%,rgba(133,92,255,0.18),transparent_24rem)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan">Contacto</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-5xl">
              Dime donde se atasca tu negocio y te dire que sistema necesitas.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/62">
              Recibe un diagnostico claro: que problema atacar primero, que
              ganaras al resolverlo y que solucion digital tiene mas sentido.
            </p>
            <div className="mt-8 space-y-4">
              {["Respuesta en menos de 24h", "Propuesta centrada en ahorro, ventas y control", "Implementacion preparada para crecer"].map((item) => (
                <p key={item} className="flex items-center gap-3 font-semibold text-white">
                  <Check className="h-5 w-5 text-cyan" /> {item}
                </p>
              ))}
            </div>
          </div>
          <form onSubmit={handleContactSubmit} className="rounded-xl border border-white/10 bg-white/[0.06] p-5 shadow-glow backdrop-blur sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-white">
                Nombre
                <input name="nombre" required className="mt-2 w-full rounded-md border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none transition placeholder:text-white/32 focus:border-cyan" placeholder="Tu nombre" />
              </label>
              <label className="text-sm font-semibold text-white">
                Negocio
                <input name="negocio" className="mt-2 w-full rounded-md border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none transition placeholder:text-white/32 focus:border-cyan" placeholder="Peluqueria, bar, clinica..." />
              </label>
              <label className="text-sm font-semibold text-white">
                Telefono
                <input name="telefono" className="mt-2 w-full rounded-md border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none transition placeholder:text-white/32 focus:border-cyan" placeholder="+34 600 000 000" />
              </label>
              <label className="text-sm font-semibold text-white">
                Email
                <input name="email" type="email" className="mt-2 w-full rounded-md border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none transition placeholder:text-white/32 focus:border-cyan" placeholder="hola@empresa.com" />
              </label>
            </div>
            <label className="mt-4 block text-sm font-semibold text-white">
              Mensaje
              <textarea name="mensaje" required className="mt-2 min-h-32 w-full resize-none rounded-md border border-white/10 bg-[#101827] px-4 py-3 text-white outline-none transition placeholder:text-white/32 focus:border-cyan" placeholder="Cuentame que quieres automatizar, que problema quieres resolver o que proceso quieres mejorar..." />
            </label>
            <button
              type="submit"
              disabled={contactStatus === "sending"}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-cyan px-6 py-4 font-semibold text-obsidian shadow-glow transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {contactStatus === "sending" ? "Enviando..." : "Enviar solicitud"} <ArrowRight className="h-5 w-5" />
            </button>
            {contactMessage && (
              <p aria-live="polite" className={`mt-4 rounded-md border px-4 py-3 text-sm font-semibold ${
                contactStatus === "success"
                  ? "border-cyan/30 bg-cyan/10 text-cyan"
                  : "border-rose/30 bg-rose/10 text-rose"
              }`}>
                {contactMessage}
              </p>
            )}
            <p className="mt-4 text-center text-xs leading-5 text-white/46">
              Te contactaremos para entender el proceso y preparar una recomendacion concreta.
            </p>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-obsidian py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-white/52 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-semibold text-white">NexaFlow</p>
          <p>Optimizacion digital para negocios que quieren vender mejor y operar con menos friccion.</p>
        </div>
      </footer>

      <a
        href="https://wa.me/34600000000?text=Hola%2C%20quiero%20optimizar%20mi%20negocio"
        target="_blank"
        rel="noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-glow transition hover:-translate-y-1"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </main>
  );
}
