import {FC, useEffect} from 'react'
import {Stack, TextInput} from '@sanity/ui'
import {set, useFormValue} from 'sanity'

import type {ParentPageReference} from '../lib/types'
import usePath from '../lib/usePath'

interface Props {
  elementProps: any
  onChange: (value: string) => void
  schemaType: any
  validation: any
  value: string
}

const Path: FC<Props> = ({elementProps, onChange, schemaType, validation, value, ...rest}) => {
  const slug = useFormValue(['slug']) as {current: string}
  const parentRef = useFormValue(['parentPage']) as ParentPageReference
  const [path, isLoadingPath] = usePath(parentRef, slug)

  useEffect(() => {
    if (isLoadingPath || value === path) {
      return
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onChange(set(path))
  }, [path])

  {
    return (
      <Stack space={2}>
        <TextInput {...elementProps} readOnly value={path} />
      </Stack>
    )
  }
}

export default Path
