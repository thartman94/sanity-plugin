import React, {useCallback, useState, useEffect} from 'react'
import {Stack, Text, TextInput} from '@sanity/ui'
import {set, unset, useFormValue, useClient} from 'sanity'

import type {ParentPageReference} from '../lib/types'
import type {FC} from 'react'

interface Props {
  elementProps: any
  onChange: (value: string) => void
  schemaType: any
  validation: any
  value: string
}

const MyCustomStringInput: FC<Props> = ({
  elementProps,
  onChange,
  schemaType,
  validation,
  value = '',
  ...rest
}) => {
  const client = useClient({apiVersion: '2023-01-01'})
  const [pathArray, setPathArray] = useState<string[]>([value])

  const sanityParent = useFormValue(['parent']) as ParentPageReference
  const [parentRef, setParentRef] = useState<ParentPageReference>(sanityParent)

  const handleChange = useCallback(
    (event: any) => {
      const {value} = event.currentTarget
      setPathArray((pathArray) => [...pathArray.slice(0, -1), value])
      onChange(value ? set(value) : unset())
    },
    [onChange]
  )

  useEffect(() => {
    if (!sanityParent) {
      setPathArray([value])
    }
    setParentRef(sanityParent)
  }, [sanityParent, setParentRef])

  useEffect(() => {
    if (!sanityParent) {
      setPathArray([value])
      return
    }

    if (!parentRef) {
      return
    }

    const fetchParent = async () => {
      const [parent] = await client.fetch(`array::unique(*[_id == "${parentRef?._ref}"])`)
      setPathArray((pathArray) => (parent.slug ? [parent.slug, ...pathArray] : pathArray))
      setParentRef(parent.parent)
    }

    fetchParent()
  }, [client, parentRef, value])

  return (
    <Stack space={2}>
      <TextInput {...elementProps} onChange={handleChange} value={value} />
      <Text>Full Path: /{pathArray.join('/')}</Text>
    </Stack>
  )
}

export default MyCustomStringInput
