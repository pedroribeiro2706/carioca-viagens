import { Mail, MapPin, Phone } from "lucide-react"
import type { CSSProperties } from "react"

import logoClaraNova from "@/assets/logo/logo-horizontal-clara-nova.svg"
import { WrapWide } from "@/components/layout/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { FacebookIcon, InstagramIcon, WhatsappIcon } from "@/components/icons/brand-icons"
import { content } from "@/lib/content"

const contatoBackground: CSSProperties = {
  backgroundImage: [
    "linear-gradient(200deg, color-mix(in srgb, var(--color-deep-blue) 60%, transparent), color-mix(in srgb, var(--color-deep-blue) 96%, transparent))",
    "linear-gradient(120deg, var(--color-deep-blue) 0%, var(--color-carioca-blue) 55%, var(--color-carioca-green) 100%)",
  ].join(", "),
}

function ContatoFooter() {
  const { contato } = content

  return (
    <section
      id="contato"
      className="relative flex min-h-[64vh] items-center text-off-white"
      style={contatoBackground}
    >
      <WrapWide className="relative z-[1] w-fit py-[100px] pb-12">
        <div className="mx-auto mb-[60px] w-fit text-left">
          <Eyebrow tone="on-dark">{contato.eyebrow}</Eyebrow>
          <h2 className="text-left text-[clamp(1.9rem,3.2vw,2.5rem)] font-extrabold text-off-white">
            {contato.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-16 pb-14 tablet:grid-cols-2">
          <div>
            <img
              src={logoClaraNova}
              alt="Carioca Viagens"
              className="mb-[45px] w-[225px]"
            />
            <div className="mb-3 flex items-center gap-2">
              <MapPin className="size-[15px] text-light-blue" />
              <span className="font-mono text-[0.7rem] tracking-[0.1em] text-light-green uppercase">
                {contato.addressLabel}
              </span>
            </div>
            <p className="text-[1rem] leading-[1.8] text-off-white/82">
              {contato.addressLines.map((line, i) => (
                <span key={line}>
                  {line}
                  {i < contato.addressLines.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>

          <div className="flex h-full flex-col justify-between">
            <div className="mb-6">
              <span className="mb-3.5 block font-mono text-[0.7rem] tracking-[0.1em] text-light-green uppercase">
                E-mail
              </span>
              <ul className="m-0 flex flex-col gap-4 p-0">
                <li className="flex items-start gap-3.5 text-[1.05rem]">
                  <Mail className="mt-0.5 size-5 shrink-0 text-light-blue" />
                  {contato.email}
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <span className="mb-3.5 block font-mono text-[0.7rem] tracking-[0.1em] text-light-green uppercase">
                WhatsApp · Telefone
              </span>
              <ul className="m-0 flex flex-col gap-4 p-0">
                <li className="flex items-start gap-3.5 text-[1.05rem]">
                  <WhatsappIcon className="mt-0.5 size-5 shrink-0 text-light-blue" />
                  {contato.whatsapp}
                </li>
                <li className="flex items-start gap-3.5 text-[1.05rem]">
                  <Phone className="mt-0.5 size-5 shrink-0 text-light-blue" />
                  {contato.phone}
                </li>
              </ul>
            </div>

            <div>
              <span className="mb-3.5 block font-mono text-[0.7rem] tracking-[0.1em] text-light-green uppercase">
                Redes sociais
              </span>
              <div className="flex flex-col items-start gap-4">
                <a
                  href={contato.instagram.url}
                  className="flex items-center gap-2 text-[0.96rem] text-off-white underline decoration-off-white/35 underline-offset-[6px]"
                >
                  <InstagramIcon className="size-5 shrink-0 text-light-blue" />
                  {contato.instagram.handle}
                </a>
                <a
                  href={contato.facebook.url}
                  className="flex items-center gap-2 text-[0.96rem] text-off-white underline decoration-off-white/35 underline-offset-[6px]"
                >
                  <FacebookIcon className="size-5 shrink-0 text-light-blue" />
                  {contato.facebook.handle}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-2 border-t border-hair-light pt-6 font-mono text-[0.7rem] tracking-[0.04em] text-off-white/50">
          <span>{contato.copyright}</span>
        </div>
      </WrapWide>
    </section>
  )
}

export { ContatoFooter }
