'use client'

import React from 'react'
import {
  CardGiftcard,
  AutoAwesome,
  VolunteerActivism,
  Handshake,
  Search,
  Create,
  Celebration,
  LocationOn,
  MusicNote,
  LocalFlorist,
  MailOutlined,
  Storefront,
  Settings,
  Star,
  EmojiEvents,
  Timer,
  Favorite,
  HistoryEdu
} from '@mui/icons-material'

const EMOJI_MAP: Record<string, React.ElementType> = {
  '🎁': CardGiftcard,
  '✨': AutoAwesome,
  '💝': VolunteerActivism,
  '🤝': Handshake,
  '🔍': Search,
  '✍️': HistoryEdu,
  '🎉': Celebration,
  '📍': LocationOn,
  '🎵': MusicNote,
  '🌸': LocalFlorist,
  '💌': MailOutlined,
  '✦': Star,
  '🛍️': Storefront,
  '⚙️': Settings,
  '🎊': Celebration,
  '🏆': EmojiEvents,
  '⏱️': Timer,
  '❤️': Favorite,
}

interface IconMapperProps {
  icon: string | null | undefined
  className?: string
  fallback?: React.ElementType
}

export default function IconMapper({ icon, className, fallback: Fallback = Star }: IconMapperProps) {
  if (!icon) return <Fallback className={className} />

  const MuiIcon = EMOJI_MAP[icon] || Fallback

  return <MuiIcon className={className} />
}
