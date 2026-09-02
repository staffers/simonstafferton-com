// Starts the GitHub OAuth flow for Decap CMS.
// Env vars required on the Pages project: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/oauth/callback`;
  const authorise = new URL("https://github.com/login/oauth/authorize");
  authorise.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorise.searchParams.set("redirect_uri", redirectUri);
  authorise.searchParams.set("scope", "repo,user");
  return Response.redirect(authorise.toString(), 302);
}
