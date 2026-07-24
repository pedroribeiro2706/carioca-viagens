import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import agilidadeImg from "@/assets/diferenciais/agilidade.webp"
import eficienciaImg from "@/assets/diferenciais/eficiencia.webp"
import flavinhaImg from "@/assets/diferenciais/flavinha.webp"
import operacionalImg from "@/assets/diferenciais/operacional.webp"
import precosImg from "@/assets/diferenciais/precos.webp"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { content } from "@/lib/content"

const SLIDE_SRC: Record<string, string> = {
  flavinha: flavinhaImg,
  agilidade: agilidadeImg,
  eficiencia: eficienciaImg,
  precos: precosImg,
  operacional: operacionalImg,
}

const AUTOPLAY_MS = 5000

/**
 * Autoplay de 5s com pausa em hover e reinício do contador em interação
 * manual. Sob prefers-reduced-motion não há autoplay e a troca é instantânea
 * (duration 0 no Embla).
 */
function DiferenciaisCarousel() {
  const { slides } = content.diferenciais
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hoveringRef = useRef(false)
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
  }, [])

  const startTimer = useCallback(() => {
    stopTimer()
    if (reducedMotion || hoveringRef.current || !api) return
    timerRef.current = setInterval(() => api.scrollNext(), AUTOPLAY_MS)
  }, [api, reducedMotion, stopTimer])

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on("select", onSelect)
    startTimer()
    return () => {
      api.off("select", onSelect)
      stopTimer()
    }
  }, [api, startTimer, stopTimer])

  // Interação manual reinicia o contador (não desliga o autoplay)
  const goTo = (index: number) => {
    api?.scrollTo(index)
    startTimer()
  }
  const goPrev = () => {
    api?.scrollPrev()
    startTimer()
  }
  const goNext = () => {
    api?.scrollNext()
    startTimer()
  }

  return (
    <div
      className="absolute inset-0"
      onPointerEnter={() => {
        hoveringRef.current = true
        stopTimer()
      }}
      onPointerLeave={() => {
        hoveringRef.current = false
        startTimer()
      }}
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: true, duration: reducedMotion ? 0 : 25 }}
        aria-roledescription="carrossel"
        className="h-full"
      >
        <CarouselContent className="ml-0 h-full">
          {slides.map((slide, i) => (
            <CarouselItem
              key={slide.file}
              className="h-full pl-0"
              aria-label={`${i + 1} de ${slides.length}`}
            >
              <img
                src={SLIDE_SRC[slide.file]}
                alt={slide.alt}
                className="size-full object-cover object-center"
                draggable={false}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Setas — estilo wayfinding, como o chip */}
      <button
        type="button"
        aria-label="Slide anterior"
        onClick={goPrev}
        className="absolute top-1/2 left-3 -translate-y-1/2 rounded-[3px] border border-off-white/55 bg-ink/32 p-1.5 text-off-white opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Próximo slide"
        onClick={goNext}
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-[3px] border border-off-white/55 bg-ink/32 p-1.5 text-off-white opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100"
      >
        <ChevronRight className="size-4" />
      </button>

      {/* Microlegenda do slide ativo — canto inferior esquerdo */}
      <span className="absolute bottom-5 left-5 font-mono text-[0.66rem] tracking-[0.08em] text-off-white/85 uppercase [text-shadow:0_1px_8px_rgb(12_33_50/0.55)]">
        {slides[current].legend}
      </span>

      {/* Bolinhas — canto inferior direito */}
      <div className="absolute right-5 bottom-5 flex gap-1.5">
        {slides.map((slide, i) => (
          <button
            key={slide.file}
            type="button"
            aria-label={`Ir para o slide ${i + 1} de ${slides.length}`}
            aria-current={i === current}
            onClick={() => goTo(i)}
            className={`size-1.5 rounded-full transition-colors ${
              i === current ? "bg-off-white" : "bg-off-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export { DiferenciaisCarousel }
