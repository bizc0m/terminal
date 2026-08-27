export type PackKind = 'paid' | 'soul' | 'solidarity'

export type PackDefinition = {
  kind: PackKind
  title: string
  line: string
  description: string
  button: string
  count: number
  sequence: string[]
  note?: string
}

const DEMO_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateDemoCodes(count: number): string[] {
  if (!Number.isInteger(count) || count < 0 || count > 24) {
    throw new RangeError('count must be an integer between 0 and 24')
  }

  return Array.from({ length: count }, (_, index) => {
    const serial = (index + 1).toString(36).toUpperCase().padStart(2, '0')
    const seed = 137 + index * 41 + count * 19
    const blocks = Array.from({ length: 3 }, (_, blockIndex) => {
      return Array.from({ length: 4 }, (_, charIndex) => {
        const cursor = seed + blockIndex * 17 + charIndex * 7
        return DEMO_ALPHABET[cursor % DEMO_ALPHABET.length]
      }).join('')
    })

    return `DEMO-${serial}-${blocks.join('-')}`
  })
}

export function createTicketText(kind: PackKind, codes: string[]): string {
  const label = {
    paid: 'PACK DIRECT',
    soul: 'SOUL PROTOCOL',
    solidarity: 'SOLIDARITE',
  }[kind]

  return [
    'TERMINAL - FIELD REPORT ACCESS UNIT',
    'Mode demonstration : aucun paiement, aucune delivrance de code reel et aucune transmission reelle.',
    `Pack : ${label}`,
    '',
    'Codes fictifs :',
    ...codes.map((code) => `- ${code}`),
    '',
    'Les codes sont des codes d’usage unique destines a une demande de transmission dans Coopro.',
    'Un code deja utilise ne peut pas etre reactive.',
    'Le Terminal ne cree aucun compte et ne conserve aucune donnee personnelle.',
    'Conservez vos codes. Aucun compte. Aucune recuperation.',
  ].join('\n')
}

export async function copyText(text: string): Promise<'clipboard' | 'fallback'> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return 'clipboard'
  }

  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', 'true')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  document.execCommand('copy')
  document.body.removeChild(area)
  return 'fallback'
}

export function downloadTicket(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const packs: PackDefinition[] = [
  {
    kind: 'paid',
    title: 'PACK DIRECT',
    line: '6 codes d’accès — 10 €',
    description: '1 code = 1 demande de transmission Coopro.',
    button: 'OBTENIR LE PACK',
    count: 6,
    sequence: [
      'INSERT FIELD CREDIT',
      'TOKEN BUS READY',
      'COOPRO LINK STANDBY',
      'DEMO MODE LOCKED',
      'TOKEN DISPENSER ACTIVE',
      'PRINTING DEMO TOKENS',
      'ACCESS TOKENS READY',
    ],
  },
  {
    kind: 'soul',
    title: 'SOUL PROTOCOL',
    line: '3 codes d’accès — gratuit',
    description: 'Satire des services prétendument gratuits qui créent des profils.',
    button: 'SIGNER SYMBOLIQUEMENT',
    count: 3,
    sequence: [
      'INSERT FIELD CREDIT',
      'TOKEN BUS READY',
      'COOPRO LINK STANDBY',
      'DEMO MODE LOCKED',
      'NOTHING REQUESTED.',
      'NOTHING COLLECTED.',
      'NOTHING SOLD.',
      'YOU ARE NOT THE PRODUCT.',
      'TOKEN DISPENSER ACTIVE',
      'PRINTING DEMO TOKENS',
      'ACCESS TOKENS READY',
    ],
    note: 'Séquence satirique. Aucun profilage ou diagnostic personnel n’est réalisé.',
  },
  {
    kind: 'solidarity',
    title: 'SOLIDARITÉ',
    line: '3 codes d’accès — gratuit',
    description: 'T’as un toit. Pense à ceux qui n’en ont pas. J’ai pensé à vous. Pensez à eux.',
    button: 'PRENDRE L’ENGAGEMENT',
    count: 3,
    sequence: [
      'INSERT FIELD CREDIT',
      'TOKEN BUS READY',
      'COOPRO LINK STANDBY',
      'DEMO MODE LOCKED',
      'ENGAGEMENT ACCEPTED.',
      'NO RECORD WRITTEN.',
      'NO DONATION COLLECTED.',
      'IF YOU CAN, HELP SOMEONE.',
      'TOKEN DISPENSER ACTIVE',
      'PRINTING DEMO TOKENS',
      'ACCESS TOKENS READY',
    ],
  },
]
