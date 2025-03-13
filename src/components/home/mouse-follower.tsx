'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

const FRAME_INTERVAL = 1000 / 30
const MAX_PARTICLES = 30
const PARTICLE_LIFETIME = 1200

export default function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; color: string; id: number; createdAt: number }>
  >([])
  const lastUpdateTime = useRef(0)
  const isMoving = useRef(false)
  const currentMousePos = useRef({ x: 0, y: 0 })
  const isPageActive = useRef(true)

  const getRandomColor = useCallback(() => {
    return (
      '#' +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')
    )
  }, [])

  useEffect(() => {
    let animationFrameId: number

    const updateParticles = (timestamp: number) => {
      if (!isPageActive.current) {
        animationFrameId = requestAnimationFrame(updateParticles)
        return
      }

      if (timestamp - lastUpdateTime.current >= FRAME_INTERVAL) {
        setMousePosition(currentMousePos.current)

        setParticles((prev) => prev.filter((p) => Date.now() - p.createdAt < PARTICLE_LIFETIME))

        if (isMoving.current) {
          const newParticles = Array.from({ length: 2 }, (_, i) => ({
            x: currentMousePos.current.x,
            y: currentMousePos.current.y,
            color: getRandomColor(),
            id: Date.now() + i,
            createdAt: Date.now()
          }))
          setParticles((prev) => [...prev, ...newParticles].slice(-MAX_PARTICLES))
        }

        lastUpdateTime.current = timestamp
      }

      animationFrameId = requestAnimationFrame(updateParticles)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPageActive.current) return
      const newPos = { x: e.clientX, y: e.clientY }
      const dx = newPos.x - currentMousePos.current.x
      const dy = newPos.y - currentMousePos.current.y

      // Consider mouse moving if distance > 1px
      isMoving.current = Math.abs(dx) > 1 || Math.abs(dy) > 1
      currentMousePos.current = newPos
    }

    const handleVisibilityChange = () => {
      isPageActive.current = !document.hidden
    }

    const handleMouseEnter = () => {
      isPageActive.current = true
    }

    const handleMouseLeave = () => {
      isPageActive.current = false
      setParticles([])
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mousemove', handleMouseMove)
    animationFrameId = requestAnimationFrame(updateParticles)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="pointer-events-none fixed"
          style={{
            filter: 'blur(1px)',
            transform: 'translate(-50%, -50%)'
          }}
          initial={{
            x: particle.x,
            y: particle.y,
            scale: 1,
            opacity: 0.3,
            rotate: Math.random() * 360
          }}
          animate={{
            x: particle.x + (Math.random() * 80 - 40),
            y: particle.y + (Math.random() * 80 - 40),
            scale: 0,
            opacity: 0,
            rotate: Math.random() * 360
          }}
          transition={{
            duration: PARTICLE_LIFETIME / 1000,
            ease: 'easeOut'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path
              d="M12 2 L15 9 L22 9 L16 14 L18 21 L12 17 L6 21 L8 14 L2 9 L9 9 Z"
              fill={particle.color}
            />
          </svg>
        </motion.div>
      ))}
      <motion.div
        className="pointer-events-none fixed h-4 w-4 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(50, 50, 50, 0.3) 0%, rgba(50, 50, 50, 0) 70%)'
        }}
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 200
        }}
      />
    </AnimatePresence>
  )
}
