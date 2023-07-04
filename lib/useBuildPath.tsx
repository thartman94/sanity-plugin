import {useState, useEffect} from 'react'
import {ParentPageReference} from './types'
import {useClient} from 'sanity'

export const useBuildPath = (page: any): string => {
  const [parentRef, setParentRef] = useState<ParentPageReference>(page.parentRef)
  const [path, setPath] = useState<string>('/' + (page.slug || ''))
  const client = useClient({apiVersion: '2023-01-01'})

  useEffect(() => {
    if (!parentRef) {
      return
    }

    const fetchParent = async () => {
      const [parent] = await client.fetch(`array::unique(*[_id == "${parentRef?._ref}"])`)
      setPath((path) => (parent.slug ? `/${parent.slug}${path}` : path))
      setParentRef(parent.parent)
    }

    fetchParent()
  }, [parentRef, client])

  return path
}
