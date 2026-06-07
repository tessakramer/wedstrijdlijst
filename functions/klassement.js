export default async (req) => {
  const url = new URL(req.url);
  const id_klassement = url.searchParams.get('id_klassement');
  const id_org = url.searchParams.get('id_org') || '3';
  const jaar   = url.searchParams.get('jaar')   || new Date().getFullYear().toString();

  if (!id_klassement) {
    return new Response('id_klassement is verplicht', { status: 400 });
  }

  const fetchUrl = `https://pbholland.com/index.php/klassementenoverzicht_details/?id_klassement=${id_klassement}&id_org=${id_org}&jaar=${jaar}`;

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
