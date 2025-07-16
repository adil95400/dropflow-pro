import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronRight } from 'lucide-react'

interface VideoGuideProps {
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl?: string
  duration?: string
  category?: string
  onNext?: () => void
  className?: string
}

export function VideoGuide({
  title,
  description,
  videoUrl,
  thumbnailUrl,
  duration = '2:45',
  category = 'Guide',
  onNext,
  className,
}: VideoGuideProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
      } else {
        document.exitFullscreen()
      }
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget
      const rect = progressBar.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / progressBar.offsetWidth
      videoRef.current.currentTime = pos * videoRef.current.duration
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Badge variant="outline">{category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={containerRef} className="relative">
          {!isPlaying && thumbnailUrl && (
            <div className="absolute inset-0 z-10">
              <img 
                src={thumbnailUrl} 
                alt={title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="rounded-full w-16 h-16 flex items-center justify-center"
                  onClick={togglePlay}
                >
                  <Play className="w-8 h-8 ml-1" />
                </Button>
              </div>
            </div>
          )}
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full aspect-video object-cover"
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div 
              className="w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <span className="text-xs text-white">{duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  onClick={toggleFullscreen}
                >
                  <Maximize className="w-5 h-5" />
                </Button>
                {onNext && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-white hover:bg-white/20"
                    onClick={onNext}
                  >
                    Suivant <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Badge({ 
  children, 
  variant = 'default',
  className,
}: { 
  children: React.ReactNode
  variant?: 'default' | 'outline'
  className?: string
}) {
  return (
    <span 
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variant === 'default' ? 'bg-primary/10 text-primary' : 'border border-gray-200 text-gray-800'}
        ${className}
      `}
    >
      {children}
    </span>
  )
}