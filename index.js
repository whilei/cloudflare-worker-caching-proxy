addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})
/**
 * Respond with caching proxied response
 * @param {Request} request
 */
async function handleRequest(event) {
  const request = event.request
  const cacheKey = request.url
  const cache = caches.default
  let response = await cache.match(cacheKey)
  if (!response) {
    console.log(`CACHE MISS url: ${request.url}\n\tcacheKey: ${cacheKey}`)

    const requestURL = new URL(request.url)
    const proxyURL = `https://icanhazip.com${requestURL.pathname}`
    console.log(`\tproxyURL: ${proxyURL}`)

    const proxyReq = new Request(proxyURL)
    response = await fetch(proxyReq)
    response = new Response(response.body, response)
    response.headers.set('Cache-Control', 's-maxage=600')
    event.waitUntil(cache.put(cacheKey, response.clone()))
  } else {
    console.log(`CACHE HIT url: ${request.url}`)
  }
  return response
}
