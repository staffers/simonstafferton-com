// Completes the GitHub OAuth flow and hands the token back to Decap CMS.
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenRes.json();

  if (data.error || !data.access_token) {
    return new Response(`OAuth failed: ${data.error || "no token returned"}`, {
      status: 401,
    });
  }

  const payload = JSON.stringify({ token: data.access_token, provider: "github" });

  const html = `<!doctype html><html><body><script>
    (function () {
      function send(e) {
        if (!window.opener) return;
        window.opener.postMessage(
          'authorization:github:success:${payload.replace(/'/g, "\\'")}',
          e.origin || '*'
        );
        window.removeEventListener('message', send, false);
      }
      window.addEventListener('message', send, false);
      if (window.opener) {
        window.opener.postMessage('authorizing:github', '*');
      }
    })();
  </script><p>Signing you in…</p></body></html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
