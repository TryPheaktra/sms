export async function onRequestPost({ request }) {
  const { token } = await request.json()
  const secret = "0x4AAAAAACeijzVQV037UUI2OKyGUT8yQs0"

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token })
  })
  const data = await res.json()

  if (data.success) return new Response(JSON.stringify({ message: "Verified ✅" }))
  else return new Response(JSON.stringify({ message: "Failed ❌" }), { status: 400 })
}
