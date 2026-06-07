export default async (req) => {
  const url = new URL(req.url);
  const href = url.searchParams.get('url');

  if (!href) {
    return new Response('url is verplicht', { status: 400 });
  }

  let fetchUrl;
  try {
    fetchUrl = new URL(href).href;
  } catch (_) {
    fetchUrl = new URL(href, 'https://www.nederlandsefierljepbond.nl/nw_public_scripts/').href;
  }

  try {
    const response = await fetch(fetchUrl);
    const html = await response.text();
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=300',
      },
    });
  } catch (err) {
    return new Response('Fout: ' + err.message, { status: 500 });
  }
};
