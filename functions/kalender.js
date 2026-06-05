const URLS = {
  kalender: 'https://pbholland.com/index.php/kalender/',
  uitslagen: 'https://pbholland.com/index.php/uitslagen/',
};

export default async (req) => {
  const url = new URL(req.url);
  const pagina = url.searchParams.get('pagina') || 'kalender';

  if (!URLS[pagina]) {
    return new Response('Ongeldige pagina', { status: 400 });
  }

  try {
    const response = await fetch(URLS[pagina]);
    const html = await response.text();
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=120',
      },
    });
  } catch (err) {
    return new Response('Fout: ' + err.message, { status: 500 });
  }
};
