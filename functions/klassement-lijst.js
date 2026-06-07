export default async (req) => {
  const url  = new URL(req.url);
  const id_org = url.searchParams.get('id_org') || '3';
  const jaar   = url.searchParams.get('jaar')   || new Date().getFullYear().toString();

  const fetchUrl = `https://pbholland.com/index.php/klassement/?id_org=${id_org}&jaar=${jaar}`;

  try {
    const response = await fetch(fetchUrl);
    const html = await response.text();

    // Zoek alle unieke id_klassement-links en hun titels
    const regex = /href="[^"]*[?&]id_klassement=(\d+)[^"]*"[^>]*>([^<]+)</g;
    const gevonden = new Map();
    let match;
    while ((match = regex.exec(html)) !== null) {
      const id   = match[1];
      const naam = match[2].trim();
      if (!gevonden.has(id) && naam.length > 2) {
        gevonden.set(id, naam);
      }
    }

    // Fallback: zoek h2/h3/strong vlak boven de eerste link per blok
    if (gevonden.size === 0) {
      const blokRegex = /id_klassement=(\d+)/g;
      while ((match = blokRegex.exec(html)) !== null) {
        const id = match[1];
        if (!gevonden.has(id)) gevonden.set(id, `Klassement ${id}`);
      }
    }

    const lijst = [...gevonden.entries()].map(([id, naam]) => ({ id, naam }));

    return new Response(JSON.stringify(lijst), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=300',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
