export default async (req) => {
  try {
    // Haal kalender én uitslagen parallel op
    const [kalenderRes, uitslagenRes] = await Promise.all([
      fetch('https://nederlandsefierljepbond.nl/index.php/kalender/'),
      fetch('https://nederlandsefierljepbond.nl/index.php/uitslagen/'),
    ]);

    const [kalenderHtml, uitslagenHtml] = await Promise.all([
      kalenderRes.text(),
      uitslagenRes.text(),
    ]);

    return new Response(JSON.stringify({ kalender: kalenderHtml, uitslagen: uitslagenHtml }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=120',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

export const config = { path: '/kalender' };