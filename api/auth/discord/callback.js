export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.redirect("/?error=no_code");
  }

  const client_id = process.env.VITE_DISCORD_CLIENT_ID || "1566207451391594556";
  const client_secret = process.env.DISCORD_CLIENT_SECRET;
  const redirect_uri =
    process.env.DISCORD_REDIRECT_URI ||
    "https://tournament-handler-underwatch.vercel.app/api/auth/discord/callback";

  try {
    // 1. Exchange authorization code for Discord access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id,
        client_secret,
        grant_type: "authorization_code",
        code,
        redirect_uri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.redirect("/?error=token_failed");
    }

    // 2. Fetch authenticated user profile from Discord
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();

    // 3. Build query parameters to send user back to frontend
    const params = new URLSearchParams({
      username: userData.username || "DiscordPlayer",
      id: userData.id || Date.now().toString(),
      avatar: userData.avatar
        ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
        : "https://cdn.discordapp.com/embed/avatars/0.png",
    });

    return res.redirect(`/?${params.toString()}`);
  } catch (err) {
    return res.redirect("/?error=server_error");
  }
}