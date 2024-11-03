'use client'
import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'
import logoAnimation from '../../../public/logo/logoAniv2.json'

export default function Welcome() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (container.current) {
      const animation = lottie.loadAnimation({
        container: container.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: logoAnimation
      })

      return () => animation.destroy()
    }
  }, [])

  return (
    <div className="flex flex-col w-dvw max-h-full items-center">
      <div className="w-96 mt-14 mb-16" ref={container}></div>
      <div className="card card-side bg-base-100 mb-9">
        <div className="card-body">
          <h2 className="card-title">Changelog! V1.1</h2>
          <p>- Add Gerar News</p>
          <h2 className="card-title">Changelog! V1.0</h2>
          <p>- Add Resumo AI</p>
          <p>- Add Título AI</p>
          <p>- Add Gerar Card X(Twitter)</p>
          <p>- Add Gerar Card Instagram</p>
          <p>- Projeto Iniciado 😎🤞</p>
          <div className="card-actions justify-end">
          </div>
        </div>
      </div>
    </div>
  )
}
