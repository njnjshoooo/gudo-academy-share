import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function generateOrderNumber(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ORD${dateStr}${random}`
}

export function generateReferralCode(name: string): string {
  const prefix = name.slice(0, 5).toUpperCase().replace(/[^A-Z0-9]/g, '')
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase()
  return (prefix + suffix).slice(0, 8).padEnd(8, '0')
}

export function generateWithdrawalNumber(): string {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 100).toString().padStart(3, '0')
  return `WD${dateStr}${random}`
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  const masked = local.slice(0, 2) + '***'
  return `${masked}@${domain}`
}

export function maskPhone(phone: string): string {
  return phone.slice(0, 4) + '***' + phone.slice(-3)
}
