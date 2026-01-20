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
  guests: string[];
};

function scrollTo(ref: RefObject<HTMLElement | null>) {
  ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function HomeClientV2({ photoUrl }: Props) {
  const aboutRef = useRef<HTMLElement | null>(null);
  const rsvpRef = useRef<HTMLElement | null>(null);
  const guestInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isRemotePhoto = /^https?:\/\//i.test(photoUrl);
  const countdownTargetMs = new Date(2026, 1, 7, 12, 0, 0).getTime();

  const [form, setForm] = useState<FormState>({ name: "", phone: "", guests: [] });
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

  function addGuest() {
    const nextIndex = form.guests.length;
    if (nextIndex >= 20) return;

    setForm((s) => ({ ...s, guests: [...s.guests, ""] }));
    requestAnimationFrame(() => guestInputRefs.current[nextIndex]?.focus());
  }

  function removeGuest(index: number) {
    setForm((s) => {
      const next = s.guests.filter((_, i) => i !== index);
      return { ...s, guests: next };
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        guests: form.guests.map((g) => g.trim()).filter(Boolean)
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = body?.message;
        setErrorMessage(Array.isArray(message) ? message.join(" · ") : message ?? "Erro ao confirmar presença.");
        return;
      }

      setSuccessMessage("Presença confirmada! Obrigado.");
      setForm({ name: "", phone: "", guests: [] });
    } catch {
      setErrorMessage("Sem conexão com a API. Verifique se o app está rodando.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-birthday">
        <BirthdayBackdrop />

        <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-12 md:pb-16 md:pt-20">
          <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
            <div>
              <p className="text-sm font-medium tracking-wide text-indigo-700">Aniversário</p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-6xl">
                Roberto Carlos faz 50! Venha comemorar comigo.
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
                  <p className="mt-2 text-xl font-semibold text-slate-900">07/02/2026 (sábado) • 12h30</p>
                </div>
                <div className="rounded-2xl border border-emerald-200/80 bg-emerald-100 p-6 shadow-sm shadow-emerald-900/10">
                  <p className="text-sm font-medium tracking-wide text-emerald-900">Condomínio</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">Cond. de Chácaras Recanto d'Italia</p>
                </div>
              </div>

            </div>

            <div className="flex justify-center md:justify-end">
              <div className="mt-12 aspect-square w-full max-w-sm overflow-hidden rounded-3xl shadow-sm shadow-slate-900/10 sm:max-w-md md:mt-20">
                <Image
                  src={photoUrl}
                  alt="Roberto"
                  width={1200}
                  height={1200}
                  priority
                  unoptimized={isRemotePhoto}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={aboutRef} className="bg-amber-200/70">
        <div className="mx-auto max-w-6xl px-6 py-28 md:py-32">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="max-w-3xl">
              <div className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold tracking-widest text-slate-700 shadow-sm shadow-black/5">
                Sobre
              </div>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {"Almo\u00e7o e m\u00fasica ao ar livre"}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-700 md:text-lg">
                {"Vai ser almo\u00e7o no Condom\u00ednio de Ch\u00e1caras Recanto d'Italia, daquele jeito que abra\u00e7a: m\u00fasica tocando, comida boa rolando e a gente junto. Come\u00e7a \u00e0s 12h30 e vai at\u00e9 cansar \u2014 chega, come, curte o som e fica \u00e0 vontade."}
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-amber-900/15 bg-white/70 p-6 shadow-sm shadow-black/5 backdrop-blur md:p-7">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-900 md:h-12 md:w-12">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 md:h-6 md:w-6"
                      aria-hidden
                    >
                      <path
                        d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z"
                      />
                      <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold tracking-wide text-slate-900">{"Localiza\u00e7\u00e3o"}</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">Recanto d&apos;Italia</p>
                    <p className="mt-2 text-base leading-relaxed text-slate-700">
                      {"Almo\u00e7o no condom\u00ednio, clima de natureza, c\u00e9u aberto e muito espa\u00e7o para curtir o dia."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-sky-200/70 bg-sky-100/80 p-6 shadow-sm shadow-black/5 backdrop-blur md:p-7">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-200 text-sky-900 md:h-12 md:w-12">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 md:h-6 md:w-6"
                      aria-hidden
                    >
                      <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold tracking-wide text-slate-900">Hora &amp; ritmo</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{"A partir das 12h30"}</p>
                    <p className="mt-2 text-base leading-relaxed text-slate-700">
                      {"Come\u00e7a \u00e0s 12h30 e vai at\u00e9 cansar. Chega com calma e fica o tempo que quiser."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-900/15 bg-white/70 p-6 shadow-sm shadow-black/5 backdrop-blur md:p-7">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-900 md:h-12 md:w-12">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 md:h-6 md:w-6"
                      aria-hidden
                    >
                      <path
                        d="M7 4h10M8 4l1 16a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2l1-16"
                      />
                      <path d="M9 10h6" />
                    </svg>
                  </div>
                  <div>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">Bebida</p>
                    <p className="mt-2 text-base leading-relaxed text-slate-700">
                      {"Levar sua bebida preferida para garantir o que mais gosta."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100">
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-28">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">Localização</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                Condomínio de Chácaras Recanto d&apos;Itália
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-700">
                É em uma chácara dentro do condomínio. Só falar na portaria que está indo para o evento e entrar é bem
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

      <section className="bg-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Falta pouco tempo!</h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm shadow-black/5">
              <p className="text-5xl font-semibold tabular-nums leading-none text-slate-900 md:text-6xl">
                {twoDigits(timeLeft.days)}
              </p>
              <p className="mt-3 text-sm font-semibold tracking-wide text-slate-700">Dias</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm shadow-black/5">
              <p className="text-5xl font-semibold tabular-nums leading-none text-slate-900 md:text-6xl">
                {twoDigits(timeLeft.hours)}
              </p>
              <p className="mt-3 text-sm font-semibold tracking-wide text-slate-700">Horas</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm shadow-black/5">
              <p className="text-5xl font-semibold tabular-nums leading-none text-slate-900 md:text-6xl">
                {twoDigits(timeLeft.minutes)}
              </p>
              <p className="mt-3 text-sm font-semibold tracking-wide text-slate-700">Minutos</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm shadow-black/5">
              <p className="text-5xl font-semibold tabular-nums leading-none text-slate-900 md:text-6xl">
                {twoDigits(timeLeft.seconds)}
              </p>
              <p className="mt-3 text-sm font-semibold tracking-wide text-slate-700">Segundos</p>
            </div>
          </div>
        </div>
      </section>


      <section ref={rsvpRef} className="bg-gradient-to-r from-black via-slate-950 to-black">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 md:py-32">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black p-5 shadow-xl shadow-black/30 sm:p-10 md:p-14">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
              Confirmar presença
            </h2>
            <p className="mt-2 text-sm text-white/70 sm:mt-3 sm:text-base md:text-lg">
              Preencha os dados para registrar sua confirmação.
            </p>

            <form className="mt-8 grid w-full gap-4 sm:mt-10 sm:gap-5 md:max-w-3xl" onSubmit={onSubmit}>
              <label className="grid gap-2">
                <span className="text-base font-medium text-white/80">Nome completo *</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/20 sm:px-5 sm:py-4 sm:text-base"
                  placeholder="Seu nome"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2 md:items-start">
                <label className="grid gap-2">
                  <span className="text-base font-medium text-white/80">Telefone</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                    className="w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/20 sm:px-5 sm:py-4 sm:text-base"
                    placeholder="(11) 99999-9999"
                  />
                </label>

                <div className="grid gap-2">
                  <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                    <span className="text-base font-medium text-white/80">Acompanhantes</span>
                    <button
                      type="button"
                      onClick={addGuest}
                      className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 sm:w-auto sm:px-3 sm:text-base"
                    >
                      + Adicionar
                    </button>
                  </div>

                  <div className="grid gap-2">
                    {form.guests.length ? (
                      form.guests.map((guestName, index) => (
                        <div key={index} className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
                          <label className="grid gap-2">
                            <span className="sr-only">{`Acompanhante ${index + 1}`}</span>
                            <input
                              ref={(el) => {
                                guestInputRefs.current[index] = el;
                              }}
                              value={guestName}
                              onChange={(e) =>
                                setForm((s) => ({
                                  ...s,
                                  guests: s.guests.map((g, i) => (i === index ? e.target.value : g))
                                }))
                              }
                              className="w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/20 sm:px-5 sm:py-4 sm:text-base"
                              placeholder={`Acompanhante ${index + 1}`}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => removeGuest(index)}
                            className="w-full rounded-xl border border-white/10 bg-white/0 px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white sm:px-5 sm:py-4 sm:text-base md:w-auto"
                          >
                            Remover
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="flex w-full items-center rounded-xl border border-white/15 bg-black px-4 py-3 text-sm text-white/60 sm:px-5 sm:py-4 sm:text-base">
                        <span className="min-w-0 truncate">Clique em adicionar para incluir acompanhantes.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60 sm:px-7 sm:py-4"
                >
                  {isSubmitting ? "Enviando..." : "Confirmar"}
                </button>

                {successMessage ? <p className="text-base text-emerald-300">{successMessage}</p> : null}
                {errorMessage ? <p className="text-base text-red-300">{errorMessage}</p> : null}
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
