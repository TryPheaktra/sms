export async function onRequestPost({ request }) {
  try {
    const { token } = await request.json()
    const secret = "0x4AAAAAACeijzVQV037UUI2OKyGUT8yQs0" // បង្ហាញនៅ worker, never frontend

    // verify token with Cloudflare
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
    })

    const data = await res.json()

    if (data.success) {
      return new Response(JSON.stringify({ message: "Verified ✅" }), { status: 200 })
    } else {
      return new Response(JSON.stringify({ message: "Failed ❌" }), { status: 400 })
    }
  } catch (err) {
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 })
  }
}
