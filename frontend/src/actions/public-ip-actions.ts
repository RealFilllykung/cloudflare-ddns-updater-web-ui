// Get the current public IP address
export async function getPublicIp(): Promise<string> {
  const res = await fetch('https://api.ipify.org?format=json')
  if (!res.ok) throw new Error('Failed to fetch public IP')
  const data = await res.json()
  return data.ip
}
