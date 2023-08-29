export type ParentPageReference =
  | {
      _ref: string
      _type: 'reference'
    }
  | undefined

export type ValidaitonError = string | undefined
