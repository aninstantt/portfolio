'use client'

import { Thread } from '@/components/assistant-ui/thread'
import { ThreadList } from '@/components/assistant-ui/thread-list'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AssistantRuntimeProvider } from '@assistant-ui/react'
import { useChatRuntime } from '@assistant-ui/react-ai-sdk'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { RiHome5Fill, RiSettings4Fill } from 'react-icons/ri'
import { toast } from 'sonner'

export default function Assistant() {
  const [apiKey, setApiKey] = useState('')
  const [isSettingOpen, setIsSettingOpen] = useState(false)
  const [model, setModel] = useState('deepseek-chat')

  useEffect(() => {
    const savedKey = localStorage.getItem('DEEPSEEK_API_KEY')
    const savedModel = localStorage.getItem('DEEPSEEK_MODEL') || 'deepseek-chat'
    if (savedKey) {
      setApiKey(savedKey)
    }
    setModel(savedModel)
  }, [])

  const runtime = useChatRuntime({
    api: '/api/chat',
    headers: {
      'X-API-KEY': apiKey,
      'X-MODEL': model
    },
    /* eslint-disable */
    onError: (error: any) => {
      let errorMessage = 'Request failed, please try again later'

      if (typeof error === 'string') {
        errorMessage = error
      } else if (error?.responseBody) {
        try {
          const errorBody = JSON.parse(error.responseBody)
          errorMessage = errorBody.error || errorBody.message || errorMessage
        } catch {
          errorMessage = error.responseBody
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      } else if (error?.message) {
        errorMessage = error.message
      }

      toast.error('Error occured', {
        description: errorMessage
      })
    }
  })

  const handleCancel = () => {
    const savedKey = localStorage.getItem('DEEPSEEK_API_KEY') || ''
    setApiKey(savedKey)
    const savedModel = localStorage.getItem('DEEPSEEK_MODEL') || 'deepseek-chat'
    setModel(savedModel)
    setIsSettingOpen(false)
  }

  const handleSetKey = () => {
    localStorage.setItem('DEEPSEEK_API_KEY', apiKey)
    localStorage.setItem('DEEPSEEK_MODEL', model)
    setIsSettingOpen(false)
  }

  return (
    <div className="relative min-h-screen">
      <AssistantRuntimeProvider runtime={runtime}>
        <div className="grid h-dvh grid-cols-[200px_1fr] gap-x-2 px-4 py-4">
          <div className="flex flex-col">
            <ThreadList />
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 z-10 flex gap-4 p-4">
              <Link href="/" className="opacity-80 hover:opacity-100">
                <RiHome5Fill className="h-5 w-5 text-blue-500" />
              </Link>
              <button
                onClick={() => setIsSettingOpen(true)}
                className="opacity-80 hover:opacity-100"
              >
                <RiSettings4Fill className="h-5 w-5 text-amber-500" />
              </button>
            </div>
            <Thread />
          </div>
        </div>
      </AssistantRuntimeProvider>

      {isSettingOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/20">
          <div className="w-[400px] space-y-4 rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-sm font-medium">设置</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="请输入 DeepSeek API Key"
                />
              </div>
              <div className="space-y-2">
                <Label>模型</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择模型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deepseek-chat">deepseek-chat</SelectItem>
                    <SelectItem value="deepseek-reasoner">deepseek-reasoner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={handleCancel}>
                取消
              </Button>
              <Button onClick={handleSetKey}>确认</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
