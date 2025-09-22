import { NextResponse } from 'next/server'

export async function GET() {
  // Simulate some API delay to make the effect more visible
  await new Promise(resolve => setTimeout(resolve, 200))

  const tenant = {
    id: 'acme-1',
    name: 'Acme Co.'
  }

  return NextResponse.json(tenant)
}