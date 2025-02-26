import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Props {
  text: string
  className?: string
}

export default function AnimatedText({ text, className = '' }: Props) {
  const [characters, setCharacters] = useState<string[]>([])

  useEffect(() => {
    const chars = text.split('')
    const shuffled = [...chars]
      .map((char, index) => ({ char, index }))
      .sort(() => Math.random() - 0.5)

    const startTime = performance.now()
    const duration = 1000
    const totalChars = shuffled.length

    let animationFrameId: number

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const charsToShow = Math.floor(progress * totalChars)

      setCharacters(shuffled.slice(0, charsToShow).map((item) => item.char))

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [text])

  return (
    <div className={`${className} relative`}>
      <div className="invisible">{text}</div>
      <div className="absolute left-0 top-0 w-full">
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: characters.includes(char) ? 1 : 0
            }}
            className="inline"
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  )
}
