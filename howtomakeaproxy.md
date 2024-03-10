# How to make a proxy

Go through the steps on https://movie-web.github.io/docs/proxy/deploy and get your proxy URL

Use it on the `const proxyUrl = ""; ` line (top of the file)

Uncomment the proxiedFetcher line on code

```
const providers = makeProviders({
  // proxiedFetcher: makeSimpleProxyFetcher(proxyUrl, fetch),      // Use this line if you want to use a proxy
  fetcher: makeStandardFetcher(fetch),
  target: targets.NATIVE, // targets.BROWSER usable but we're scarping for downloading so we use NATIVE
})
```
