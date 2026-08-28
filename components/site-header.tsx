'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LogIn, UserRound } from 'lucide-react'
import {
  CLUB_SESSION_CHANGE_EVENT,
  CLUB_SESSION_KEY,
  type ClubSession,
} from '@/lib/club-session'

export function SiteHeader() {
  const router = useRouter()
  const [accountLabel, setAccountLabel] = useState('')

  useEffect(() => {
    const updateAccount = () => {
      try {
        const savedSession = window.sessionStorage.getItem(CLUB_SESSION_KEY)
        const session = savedSession ? (JSON.parse(savedSession) as ClubSession) : null
        setAccountLabel(session?.name?.trim().split(/\s+/)[0] || (session ? 'Minha conta' : ''))
      } catch {
        setAccountLabel('')
      }
    }

    updateAccount()
    window.addEventListener('storage', updateAccount)
    window.addEventListener(CLUB_SESSION_CHANGE_EVENT, updateAccount)

    return () => {
      window.removeEventListener('storage', updateAccount)
      window.removeEventListener(CLUB_SESSION_CHANGE_EVENT, updateAccount)
    }
  }, [])

  const openAccount = () => {
    router.push('/agendamento')
  }

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/65 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label="Nego Black — início">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70">
            <Image
              src="/negoblack-logo-black.jpg"
              alt="Logo Nego Black"
              width={36}
              height={36}
              sizes="36px"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="hidden font-display text-base font-semibold uppercase tracking-widest text-foreground min-[360px]:inline sm:text-lg">
            Nego Black
          </span>
        </a>

        <button
          type="button"
          onClick={openAccount}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3.5 text-xs font-medium uppercase tracking-wide text-foreground transition-colors hover:bg-white/12 sm:px-4"
        >
          {accountLabel ? (
            <UserRound className="h-4 w-4" aria-hidden="true" />
          ) : (
            <LogIn className="h-4 w-4" aria-hidden="true" />
          )}
          <span>{accountLabel || 'Login'}</span>
        </button>
      </div>
    </header>
  )
}
