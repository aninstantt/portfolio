'use client'
import About from '@/components/home/about'
import MouseFollower from '@/components/home/mouse-follower'
import Profile from '@/components/home/profile'

export default function Home() {
  return (
    <main className="relative min-h-screen old-paper">
      <MouseFollower />
      <div className="flex min-h-screen flex-col-reverse gap-20 p-20 md:flex-row">
        <div className="flex flex-1 flex-col justify-end pb-20">
          <About />
        </div>
        <div className="w-fit pr-20 md:max-w-[500px]">
          <Profile />
        </div>
      </div>
    </main>
  )
}
