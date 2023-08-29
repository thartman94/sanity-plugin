import {Rule, ValidationContext} from 'sanity'
import Path from '../components/Path'
import validateNoPageCycle from '../lib/validateNoPageCycle'
import validateSiblingSlug from '../lib/validateSiblingSlug'

export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Page Name',
      type: 'string',
      directions: 'The name of the page - used for internal reference and slug generation',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (Rule: Rule) => [
        Rule.custom((_: any, context: ValidationContext) => {
          const client = context.getClient({apiVersion: '2023-08-22'})
          const myId = context?.document?._id
          // return validateSiblingSlug(myId ?? '', client)
          return true
        }),
      ],
    },
    {
      name: 'parentPage',
      title: 'Parent Page',
      type: 'reference',
      to: [{type: 'page'}],
      validation: (Rule: Rule) => [
        Rule.custom((_: any, context: ValidationContext) => {
          // @ts-ignore
          const parentId = context?.document?.parentPage?._ref?.replace('drafts.', '') ?? ''
          const myId = context?.document?._id.replace('drafts.', '')
          return !parentId || parentId !== myId || 'Page cannot be its own parent'
        }),
        Rule.custom((_: any, context: ValidationContext) => {
          const client = context.getClient({apiVersion: '2023-08-22'})
          const myId = context?.document?._id
          // console.log(myId)
          return validateNoPageCycle(myId ?? '', client)
        }),
      ],
    },
    {
      name: 'path',
      title: 'Full Path',
      type: 'string',
      // readOnly: true,
      components: {input: Path},
    },
  ],
}
