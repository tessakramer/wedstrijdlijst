const BASE = {
  kalender: 'https://pbholland.com/index.php/kalender/',
  uitslagen: 'https://pbholland.com/index.php/uitslagen/',
};

export default async (req) => {
  const url = new URL(req.url);
  const pagina = url.searchParams.get('pagina') || 'kalender';
  const id_org = url.searchParams.get('id_org') || '3';
  const jaar   = url.searchParams.get('jaar')   || new Date().getFullYear().toString();

  if (!BASE[pagina]) {
    return new Response('Ongeldige pagina', { status: 400 });
  }

  const fetchUrl = `${BASE[pagina]}?id_org=${id_org}&pbh=1&jaar=${jaar}`;

  try {
    const response = await fetch(fetchUrl);
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
