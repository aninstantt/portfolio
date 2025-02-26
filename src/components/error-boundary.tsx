import { Component, type ReactNode } from 'react'
import { toast } from 'sonner'

interface Props {
  children: ReactNode
}

export class ErrorBoundary extends Component<Props> {
  componentDidCatch(error: Error) {
    toast.error('ErrorBoundary', {
      description: error.message || '未知错误发生'
    })
  }

  render() {
    return this.props.children
  }
}
