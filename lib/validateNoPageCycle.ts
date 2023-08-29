import {SanityClient} from 'sanity'

const checkParent = async (
  id: string,
  client: SanityClient,
  seen: Map<string, true>
): Promise<string | true> => {
  if (!id) {
    return true
  }

  if (seen.has(id)) {
    return `Page cycle detected: ${id} is a ancestor of itself`
  }

  seen.set(id, true)
  const [page] = await client.fetch(`*[_id == "${id}"]`)

  return checkParent(page?.parentPage?._ref, client, seen)
}

export default async (pageId: string, client: SanityClient) => {
  const seen: Map<string, true> = new Map()
  return await checkParent(pageId, client, seen)
}
