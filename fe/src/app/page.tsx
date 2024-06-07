"use client"
import LoadingScreen from '@/components/LoadingScreen'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Red = () => {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if(data?.user.role) {
      router.push(`/${data?.user.role}`)
    }
  }, [data, router])

  return <LoadingScreen />
}

export default Red