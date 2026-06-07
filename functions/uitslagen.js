export default async (req) => {
  const url = new URL(req.url);
  const id  = url.searchParams.get('id_wedstrijd');

  if (!id) return new Response('id_wedstrijd is verplicht', { status: 400 });

  try {
    const res  = await fetch(`https://www.pbholland.com/index.php/uitslaginfo/?id_wedstrijd=${id}`);
    const html = await res.text();
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=3600',
      },
    });
  } catch (err) {
    return new Response('Fout: ' + err.message, { status: 500 });
  }
};
