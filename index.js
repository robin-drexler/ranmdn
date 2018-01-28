const fetch = require('node-fetch');
const micro = require('micro');
const xml2json = require('xml2json');
const getRandomItem = require('random-item');

(async () => {
  const sitemapXML = await fetch(
    'https://developer.mozilla.org/sitemaps/en-US/sitemap.xml'
  ).then((r) => r.text());
  const sitemap = JSON.parse(xml2json.toJson(sitemapXML));

  const urls = sitemap.urlset.url.reduce((urls, { loc }) => {
    if (!loc.includes('/docs/Archive')) {
      urls.push(loc);
    }

    return urls;
  }, []);

  const server = micro(async (req, res) => {
    const url = getRandomItem(urls);
    res.setHeader('Location', url);
    micro.send(res, 307);
  });

  server.listen(process.env.PORT || 3000);
})();
