import slug from '../components/slug'

export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'text',
      components: {
        input: slug,
      },
    },
    {
      name: 'parent',
      title: 'Parent',
      type: 'reference',
      to: [{type: 'page'}],
    },
  ],
}
