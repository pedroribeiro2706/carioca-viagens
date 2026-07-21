import bandPainelVideo from "@/assets/band/band-painel-voos.mp4"
import bandPainel from "@/assets/band/band-painel-voos.webp"

/**
 * `.band` — faixa de transição entre Sobre e Diferenciais (design.md Seção
 * 11). Painel de voos split-flap; a decisão de 2026-07-16 promoveu esta
 * faixa de placeholder opcional a elemento narrativo.
 *
 * A altura deriva da proporção da própria imagem (4,494:1) em vez do
 * `42vh` original. Motivo: `object-cover` só deixa de cortar quando
 * container e imagem têm a mesma proporção. Com `42vh` a faixa variava de
 * 3,8:1 a 6,3:1 conforme a viewport, e em qualquer valor diferente do da
 * imagem o navegador decepava linhas ou colunas do painel — inaceitável
 * num painel cujo conteúdo é texto. O recorte foi feito junção a junção
 * entre as linhas, então nenhuma linha aparece pela metade.
 *
 * Em 1920px isso dá 428px de altura, contra os 454px do `42vh` anterior.
 */
function MediaBand() {
  return (
    <div className="relative aspect-[2800/623] w-full overflow-hidden">
      {/*
        Vídeo em loop com fallback estático, como exige design.md Seção 11
        ("sempre prever fallback estático quando a mídia final for vídeo").
        O `poster` cobre o intervalo até o vídeo carregar, e o `<img>` dentro
        do `<video>` atende quem tem o vídeo bloqueado.

        O loop é costurado na origem: o clipe foi gerado com o mesmo quadro
        como âncora inicial e final, então o reinício não tem salto.
      */}
      <video
        src={bandPainelVideo}
        poster={bandPainel}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label="Painel de voos de aeroporto com destinos internacionais e horários de embarque"
        className="absolute inset-0 size-full object-cover"
      >
        <img
          src={bandPainel}
          alt="Painel de voos de aeroporto com destinos internacionais e horários de embarque"
          className="absolute inset-0 size-full object-cover"
        />
      </video>
    </div>
  )
}

export { MediaBand }
