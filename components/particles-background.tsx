"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
}

const PARTICLE_COLORS = [
  "rgba(240, 98, 146, 0.6)",
  "rgba(201, 180, 240, 0.6)",
  "rgba(91, 191, 214, 0.5)",
  "rgba(247, 184, 212, 0.5)",
]

const MAX_PARTICLE_COUNT = 80
const AREA_PER_PARTICLE_PX2 = 15000
const MOUSE_INFLUENCE_RADIUS_PX = 150
const MOUSE_ATTRACTION_STRENGTH = 0.00005
const PARTICLE_CONNECTION_RADIUS_PX = 120
const VELOCITY_DAMPING = 0.999

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })

  const initParticles = useCallback((width: number, height: number): Particle[] => {
    const count = Math.min(MAX_PARTICLE_COUNT, Math.floor((width * height) / AREA_PER_PARTICLE_PX2))
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      alpha: Math.random() * 0.5 + 0.3,
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    function resizeCanvas() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = initParticles(canvas.width, canvas.height)
    }

    function updateMousePosition(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    function drawBackground() {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(253, 221, 230, 0.03)")
      gradient.addColorStop(0.5, "rgba(226, 212, 248, 0.03)")
      gradient.addColorStop(1, "rgba(178, 223, 238, 0.03)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    function drawParticleConnections(particle: Particle, particleIndex: number) {
      particlesRef.current.slice(particleIndex + 1).forEach((other) => {
        const dx = particle.x - other.x
        const dy = particle.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance >= PARTICLE_CONNECTION_RADIUS_PX) return

        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(other.x, other.y)
        ctx.strokeStyle = `rgba(201, 180, 240, ${0.15 * (1 - distance / PARTICLE_CONNECTION_RADIUS_PX)})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      })
    }

    function updateAndDrawParticle(particle: Particle, particleIndex: number) {
      const dx = mouseRef.current.x - particle.x
      const dy = mouseRef.current.y - particle.y
      const distanceFromMouse = Math.sqrt(dx * dx + dy * dy)

      if (distanceFromMouse < MOUSE_INFLUENCE_RADIUS_PX) {
        particle.vx += dx * MOUSE_ATTRACTION_STRENGTH
        particle.vy += dy * MOUSE_ATTRACTION_STRENGTH
      }

      particle.x += particle.vx
      particle.y += particle.vy
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
      particle.vx *= VELOCITY_DAMPING
      particle.vy *= VELOCITY_DAMPING

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.fill()

      drawParticleConnections(particle, particleIndex)
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawBackground()
      particlesRef.current.forEach(updateAndDrawParticle)
      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", updateMousePosition)
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", updateMousePosition)
      cancelAnimationFrame(animationRef.current)
    }
  }, [initParticles])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  )
}
