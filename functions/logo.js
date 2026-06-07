const TOEGESTANE_CLUBS = [
  'vlist','jaarsveld','linschoten','polsbroekerdam',
  'zegveld','kockengen','stichtse_vecht'
];

const BESTANDSNAAM = {
  stichtse_vecht: 'pvsv',
  kockengen:      'pvsv',
};

export default async (req) => {
  const url = new URL(req.url);
  const club = url.searchParams.get('club')?.toLowerCase().replace(/\s+/g, '_');

  if (!club || !TOEGESTANE_CLUBS.includes(club)) {
    return new Response('Onbekende club', { status: 400 });
  }

  const bestand = BESTANDSNAAM[club] ?? club;

  try {
    const response = await fetch(
      `https://www.nederlandsefierljepbond.nl/nw_public_scripts/images/${bestand}_logo.jpg`,
      { headers: { Referer: 'https://www.nederlandsefierljepbond.nl/' } }
    );

    if (!response.ok) {
      return new Response(`Logo niet gevonden (${bestand}, HTTP ${response.status})`, { status: 404 });
    }

    const buffer = await response.arrayBuffer();
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=86400',
      },
    });
  } catch (err) {
    return new Response('Fout: ' + err.message, { status: 500 });
  }
};
