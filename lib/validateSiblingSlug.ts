import {SanityClient} from 'sanity'

export default async (pageId: string, client: SanityClient) => {
  const [page] = await client.fetch(`*[_id == "${pageId}"]`)
  console.log(page)
  console.log(pageId)

  // if (!page?.parentPage?._ref) {
  //   return true
  // }

  const siblings = page?.parentPage?._ref
    ? await client.fetch(
        `*[_type == "page" && _id != "${pageId}" && parentPage._ref == "${page.parentPage._ref}"]`
      )
    : await client.fetch(`*[_type == "page" && _id != "${pageId}" && !defined(parentPage)]`)

  console.log(siblings)
  const match = siblings.find((sibling: any) => sibling.slug?.current === page.slug?.current)
  console.log(match)

  return true
}
