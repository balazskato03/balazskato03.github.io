export async function handler(event) {
  const { q } = event.queryStringParameters || {};
  if (!q) return { statusCode: 400, body: JSON.stringify({ error: "Missing q" }) };

  const url = new URL("https://api.search.brave.com/res/v1/web/search");
  url.searchParams.set("q", q);
  url.searchParams.set("count", "5");

  const resp = await fetch(url.toString(), {
    headers: {
      "X-Subscription-Token": process.env.BRAVE_TOKEN,
      "Accept": "application/json"
    }
  });

  if (!resp.ok) return { statusCode: resp.status, body: await resp.text() };

  const data = await resp.json();
  const items = (data.web?.results || []).slice(0, 5).map(r => ({
    title: r.title,
    snippet: r.description || "",
    link: r.url
  }));
  return { statusCode: 200, body: JSON.stringify({ items }) };
}
