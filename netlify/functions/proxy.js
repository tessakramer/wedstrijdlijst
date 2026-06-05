export default async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get('id_wedstrijd');

  if (!id || isNaN(parseInt(id))) {
    return new Response('Geen geldig wedstrijd-id opgegeven', { status: 400 });
  }

  try {
    const response = await fetch(
      `https://www.nederlandsefierljepbond.nl/nw_public_scripts/wedstrijdlijst.php?id_wedstrijd=${parseInt(id)}`
    );
    const html = await response.text();

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    return new Response('Fout bij ophalen wedstrijddata: ' + err.message, { status: 500 });
  }
};

export const config = { path: '/proxy' };
