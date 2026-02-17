export const onRequestPost = async ({ request, env }: any) => {
  try {
    const { token } = await request.json();

    if (!token) return new Response(JSON.stringify({ success: false, error: 'No token provided' }), { status: 400 });

    const params = new URLSearchParams();
    params.append('secret', env.TURNSTILE_SECRET);
    params.append('response', token);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: params
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
};
