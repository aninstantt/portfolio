'use client'
import AnimatedText from '@/components/animated-text'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { RiBriefcase4Fill, RiCodeBoxFill, RiCupFill, RiNetflixFill } from 'react-icons/ri'

type Section = {
  title: string
  icon: React.ReactNode
  content: string[]
}

export default function About() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const sections: Section[] = [
    {
      title: '技术栈',
      icon: <RiCodeBoxFill className="mr-2 text-blue-500" />,
      content: ['React, Next.js, Node.js,', 'Python, Go, Dart,', 'PostgreSQL, Redis 等']
    },
    {
      title: '工作习惯',
      icon: <RiBriefcase4Fill className="mr-2 text-amber-500" />,
      content: ['高效沟通，及时反馈，', '代码干净，需求优先']
    },
    {
      title: '闲时干点啥',
      icon: <RiCupFill className="mr-2 text-rose-500" />,
      content: ['看游戏直播，听音乐，刷剧，', '捣鼓一些可能没用的软件']
    },
    {
      title: '最近在追的剧',
      icon: <RiNetflixFill className="mr-2 text-purple-500" />,
      content: ['Severance，黑道家族']
    }
  ]

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="relative w-fit">
          <h3
            className="flex w-fit cursor-pointer items-center text-sm opacity-60"
            onMouseEnter={() => setActiveSection(section.title)}
            onMouseLeave={() => setActiveSection(null)}
          >
            <motion.span
              animate={{
                opacity: activeSection === section.title ? 1 : 0.9,
                scale: activeSection === section.title ? 1.1 : 1
              }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              {section.icon}
              <AnimatedText text={section.title} />
            </motion.span>
          </h3>

          <AnimatePresence>
            {activeSection === section.title && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute left-32 top-0 w-[240px] space-y-3 rounded-2xl bg-white/60 p-6 shadow-2xl backdrop-blur-md"
              >
                <h2 className="mb-4 text-sm opacity-60">{section.title}</h2>
                {section.content.map((item, index) => (
                  <p key={index} className="text-xs opacity-80">
                    {item}
                  </p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
