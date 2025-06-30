'use client'
import AnimatedText from '@/components/animated-text'
import { motion } from 'framer-motion'
import { Allura } from 'next/font/google'
import Link from 'next/link'

const dancingScript = Allura({
  subsets: ['latin'],
  weight: '400'
})

export default function Profile() {
  return (
    <motion.div
      className="flex flex-col gap-8 font-[Avenir] text-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="space-y-2">
        <AnimatedText text="Kai" className={`text-3xl ${dancingScript.className} tracking-wider`} />
        <AnimatedText text="前端 & 全栈" className="text-sm opacity-60" />
      </div>

      <div className="space-y-4 text-sm">
        <AnimatedText text="喜欢将复杂的问题简单化，追求代码的优雅和可维护性。" />
        <AnimatedText text="在技术探索中寻找创新的可能，致力于提升用户体验。" />
      </div>

      <div className="flex w-fit gap-4 whitespace-nowrap text-sm opacity-60">
        <a href="https://blog.severance.cc" className='profile-link group'>
          <AnimatedText
            text="Blog"
            className="cursor-pointer transition-all duration-300 group-hover:translate-y-[-2px] group-hover:opacity-100"
          />
        </a>
        <a href="https://github.com/aninstantt" className="profile-link group">
          <AnimatedText
            text="GitHub"
            className="cursor-pointer transition-all duration-300 group-hover:translate-y-[-2px] group-hover:opacity-100"
          />
        </a>
        <a href="mailto:dxkoui@126.com" className="profile-link group">
          <AnimatedText
            text="Email"
            className="cursor-pointer transition-all duration-300 group-hover:translate-y-[-2px] group-hover:opacity-100"
          />
        </a>
        <Link href="/assistant" className="profile-link group">
          <AnimatedText
            text="AI Chatbox"
            className="cursor-pointer transition-all duration-300 group-hover:translate-y-[-2px] group-hover:opacity-100"
          />
        </Link>
      </div>
    </motion.div>
  )
}
