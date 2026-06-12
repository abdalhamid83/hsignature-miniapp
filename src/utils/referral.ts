const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME || 'HSignatureBot'

export function buildReferralLink(humanId: string): string {
  return `https://t.me/${BOT_USERNAME}?startapp=ref_${humanId}`
}
