import { useEffect, useState } from "react"

import bandPainelVideoMobile from "@/assets/band/band-painel-voos-mobile.mp4"
import bandPainelMobile from "@/assets/band/band-painel-voos-mobile.webp"
import bandPainelVideo from "@/assets/band/band-painel-voos.mp4"
import bandPainel from "@/assets/band/band-painel-voos.webp"
import { cn } from "@/lib/utils"

/**
 * Abaixo de sm (640px) a Band troca para o corte mobile de 9 linhas.
 * Renderização condicional (e não dois <video> ocultos por CSS) para cada
 * aparelho baixar apenas a mídia que exibe.
 */
function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 639px)").matches
  )
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    const onChange = () => setMobile(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return mobile
}

/**
 * `.band` — faixa de transição entre Sobre e Diferenciais (design.md Seção
 * 11). Painel de voos split-flap; a decisão de 2026-07-16 promoveu esta
 * faixa de placeholder opcional a elemento narrativo.
 *
 * A altura deriva da proporção da própria mídia em vez do `42vh` original.
 * Motivo: `object-cover` só deixa de cortar quando container e imagem têm
 * a mesma proporção. Com `42vh` a faixa variava de 3,8:1 a 6,3:1 conforme
 * a viewport, e em qualquer valor diferente do da imagem o navegador
 * decepava linhas ou colunas do painel — inaceitável num painel cujo
 * conteúdo é texto. O recorte foi feito junção a junção entre as linhas,
 * então nenhuma linha aparece pela metade.
 *
 * Duas versões, ambas cortadas do master 1920×1080
 * (design/assets/band/mp4/band-painel-loop-3s.mp4):
 * - desktop: 6 linhas (TOKYO→SYDNEY), 1920×428 — em 1920px dá 428px de
 *   altura, contra os 454px do `42vh` anterior.
 * - mobile: 9 linhas (TOKYO→MEXICO CITY), 1920×618, y=268 — em 360px a
 *   faixa sobe de ~80px para ~116px de altura e ganha presença.
 */
function MediaBand() {
  const mobile = useIsMobile()
  const video = mobile ? bandPainelVideoMobile : bandPainelVideo
  const poster = mobile ? bandPainelMobile : bandPainel

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        mobile ? "aspect-[1920/618]" : "aspect-[2800/623]"
      )}
    >
      {/*
        Vídeo em loop com fallback estático, como exige design.md Seção 11
        ("sempre prever fallback estático quando a mídia final for vídeo").
        O `poster` cobre o intervalo até o vídeo carregar, e o `<img>` dentro
        do `<video>` atende quem tem o vídeo bloqueado.

        O loop é costurado na origem: o clipe foi gerado com o mesmo quadro
        como âncora inicial e final, então o reinício não tem salto.

        `key` força o remount na troca mobile↔desktop — trocar só o `src`
        de um <video> montado não recarrega a mídia de forma confiável.
      */}
      <video
        key={mobile ? "band-mobile" : "band-desktop"}
        src={video}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label="Painel de voos de aeroporto com destinos internacionais e horários de embarque"
        className="absolute inset-0 size-full object-cover"
      >
        <img
          src={poster}
          alt="Painel de voos de aeroporto com destinos internacionais e horários de embarque"
          className="absolute inset-0 size-full object-cover"
        />
      </video>
    </div>
  )
}

export { MediaBand }
