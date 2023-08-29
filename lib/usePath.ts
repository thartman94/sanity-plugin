import {useEffect, useState} from 'react'
import {useClient, SanityClient} from 'sanity'
import type {ParentPageReference} from './types'

const usePath = (parentRef: ParentPageReference, slug: {current: string}) => {
  const sanityClient = useClient({apiVersion: '2023-01-01'}) as SanityClient
  const [value, setValue] = useState('/')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchParentPath = async () => {
      setIsLoading(true)
      if (!parentRef?._ref) {
        setValue(`/${slug?.current ?? ''}`)
        setIsLoading(false)
        return
      }

      const parent = await sanityClient.getDocument(parentRef._ref)

      if (!parent) {
        setValue(`/${slug?.current ?? ''}`)
        setIsLoading(false)
        console.log('Parent not found')
        return
      }

      setValue(`${parent.path}/${slug?.current ?? ''}`)
      setIsLoading(false)
    }

    fetchParentPath()
  }, [parentRef, slug])

  return [value, isLoading]
}

export default usePath
