"use client";

import Image from "next/image";
import { type RefObject, useEffect, useRef, useState } from "react";
import BirthdayBackdrop from "@/components/birthday-backdrop";

type Props = {
  photoUrl: string;
};

type FormState = {
  name: string;
  phone: string;
  guestsCount: number;
  message: string;
};

export default function HomeClient({ photoUrl }: Props) {
  const aboutRef = useRef<HTMLElement | null>(null);
  const rsvpRef = useRef<HTMLElement | null>(null);
  const isRemotePhoto = /^https?:\/\//i.test(photoUrl);
  const countdownTargetMs = new Date(2026, 1, 7, 12, 0, 0).getTime();

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    guestsCount: 0,
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const endpoint = "/api/rsvps";

  useEffect(() => {
    function tick() {
      const diffMs = Math.max(0, countdownTargetMs - Date.now());
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }

    tick();
    const id = window.setInterval(tick, 1000);

    return () => window.clearInterval(id);
  }, [countdownTargetMs]);

  function twoDigits(value: number) {
    return String(Math.max(0, Math.floor(value))).padStart(2, "0");
  }

  function scrollTo(ref: RefObject<HTMLElement | null>) {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = body?.message;
        setErrorMessage(Array.isArray(message) ? message.join(" • ") : message ?? "Erro ao confirmar presença.");
        return;
      }

      setSuccessMessage("Presença confirmada! Obrigado.");
      setForm({ name: "", phone: "", guestsCount: 0, message: "" });
    } catch {
      setErrorMessage("Sem conexão com a API. Verifique se o backend está rodando.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fbf7f0] via-[#f6f1e9] to-[#f2e8d8]">
      <section className="relative overflow-hidden">
        <BirthdayBackdrop />

        <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-12 md:pb-16 md:pt-20">
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="text-sm font-medium tracking-wide text-indigo-700">Aniversário</p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-6xl">
                Roberto Carlos faz 50! Venha comemorar meus 50 anos junto comigo.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
                Confirme sua presença e veja tudo sobre o evento.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollTo(rsvpRef)}
                  className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  Confirmar presença
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo(aboutRef)}
                  className="rounded-xl border border-slate-300 bg-white/60 px-6 py-3 text-base font-semibold text-slate-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  Ver detalhes
                </button>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-blue-200/80 bg-blue-100 p-6 shadow-sm shadow-blue-900/10">
                  <p className="text-sm font-medium tracking-wide text-blue-900">Data</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">07/02/2026 sábado . 12:00h</p>
                </div>
                <div className="rounded-2xl border border-emerald-200/80 bg-emerald-100 p-6 shadow-sm shadow-emerald-900/10">
                  <p className="text-sm font-medium tracking-wide text-emerald-900">Local</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">
                    cond. de Chácaras Recanto d&apos;Italia
                  </p>
                </div>
              </div>

            </div>

            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-400/20 via-indigo-400/15 to-emerald-400/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <div className="relative aspect-[1147/1280] w-full">
                  {isRemotePhoto ? (
                    // next/image exige configuração de domínio para URL remota
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoUrl}
                      alt="Foto do aniversariante"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={photoUrl}
                      alt="Foto do aniversariante"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 90vw, 380px"
                      priority
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={aboutRef} className="bg-amber-300/60">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-28 md:pt-20 md:pb-36">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="lg:pr-10">
              <div className="inline-flex rounded-2xl border border-amber-900/15 bg-amber-50/50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-950 shadow-sm">
                Sobre
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Almoço, música ao ar livre
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-800 md:text-lg">
                Vai ser almoço no Condomínio de Chácaras Recanto d&apos;Italia, daquele jeito que abraça: música tocando,
                comida boa rolando e a gente junto. Começa às 12h e vai até cansar — chega, come, curte o som e fica à
                vontade.
              </p>
            </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm shadow-slate-900/5 backdrop-blur md:p-7">
              <div className="flex gap-4">
                <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
                    <path
                      d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M12 12.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-base font-semibold text-yellow-600">Localização</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">Recanto d&apos;Italia</p>
                  <p className="mt-2 text-base leading-relaxed text-slate-600">
                    Almoço no condomínio, clima de natureza, céu aberto e muito espaço para curtir o dia.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800/70 bg-slate-950 p-6 shadow-sm shadow-black/20 md:p-7">
              <div className="flex gap-4">
                <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-200">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
                    <path
                      d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>

                <div>
                  <p className="text-base font-semibold text-white">Hora & ritmo</p>
                  <p className="mt-1 text-lg font-semibold text-white">A partir das 12h</p>
                  <p className="mt-2 text-base leading-relaxed text-slate-200">
                    Começa às 12h e vai até cansar. Chega com calma e fica o tempo que quiser.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm shadow-slate-900/5 backdrop-blur md:p-7">
              <div className="flex gap-4">
                <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
                    <path
                      d="M7 3h10v8a5 5 0 0 1-10 0V3Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path d="M6 7H4a2 2 0 0 0 0 4h2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M18 7h2a2 2 0 0 1 0 4h-2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M9 21h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>

                <div>
                  <p className="text-base font-semibold text-slate-900">Bebidas</p>
                  <p className="mt-2 text-base leading-relaxed text-slate-600">
                    Leve sua bebida preferida para garantir o que mais gosta.
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="bg-amber-300/60">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Falta pouco tempo!</h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-amber-900/15 bg-amber-50/60 p-6 shadow-sm shadow-black/10">
              <p className="text-5xl font-semibold tabular-nums leading-none text-slate-900 md:text-6xl">
                {twoDigits(timeLeft.days)}
              </p>
              <p className="mt-3 text-sm font-semibold tracking-wide text-slate-700">Dias</p>
            </div>
            <div className="rounded-3xl border border-amber-900/15 bg-amber-50/60 p-6 shadow-sm shadow-black/10">
              <p className="text-5xl font-semibold tabular-nums leading-none text-slate-900 md:text-6xl">
                {twoDigits(timeLeft.hours)}
              </p>
              <p className="mt-3 text-sm font-semibold tracking-wide text-slate-700">Horas</p>
            </div>
            <div className="rounded-3xl border border-amber-900/15 bg-amber-50/60 p-6 shadow-sm shadow-black/10">
              <p className="text-5xl font-semibold tabular-nums leading-none text-slate-900 md:text-6xl">
                {twoDigits(timeLeft.minutes)}
              </p>
              <p className="mt-3 text-sm font-semibold tracking-wide text-slate-700">Minutos</p>
            </div>
            <div className="rounded-3xl border border-amber-900/15 bg-amber-50/60 p-6 shadow-sm shadow-black/10">
              <p className="text-5xl font-semibold tabular-nums leading-none text-slate-900 md:text-6xl">
                {twoDigits(timeLeft.seconds)}
              </p>
              <p className="mt-3 text-sm font-semibold tracking-wide text-slate-700">Segundos</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">Localização</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                Condomínio de Chácaras Recanto d&apos;Itália
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-700">
                É em uma chácara dentro do condomínio. Só falar na portaria que está indo para o evento e entrar — é bem
                tranquilo.
              </p>

              <a
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white hover:bg-slate-800"
                target="_blank"
                rel="noreferrer"
                href="https://maps.app.goo.gl/zwTxzXomMwRSqRLB7"
              >
                Abrir no Maps
              </a>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-900/10">
              <div className="aspect-[16/10] w-full">
                <iframe
                  title="Mapa - Recanto d'Itália"
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3826.3200512401377!2d-49.30976499999999!3d-16.459324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTbCsDI3JzMzLjYiUyA0OcKwMTgnMzUuMiJX!5e0!3m2!1spt-BR!2sbr!4v1768588694835!5m2!1spt-BR!2sbr"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={rsvpRef} className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Confirmar presença</h2>
          <p className="mt-2 text-sm text-slate-600">Preencha os dados para registrar sua confirmação.</p>

          <form className="mt-8 grid gap-4 md:max-w-2xl" onSubmit={onSubmit}>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Nome *</span>
              <input
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                required
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Seu nome"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">Telefone</span>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="(11) 99999-9999"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">Acompanhantes</span>
                <input
                  value={form.guestsCount}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      guestsCount: Number.isFinite(Number(e.target.value)) ? Number(e.target.value) : 0
                    }))
                  }
                  type="number"
                  min={0}
                  max={20}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Mensagem (opcional)</span>
              <textarea
                value={form.message}
                onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                rows={4}
                className="resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Alguma observação?"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Enviando..." : "Confirmar"}
              </button>

              {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}
              {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
            </div>
          </form>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      
          </div>
        </div>
      </section>
    </main>
  );
}
