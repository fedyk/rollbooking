export function parseCheckoutRequestBody(body: any) {
  const email: string = (body && typeof body.email === "string") ? body.email : "";
  const name: string = (body && typeof body.name === "string") ? body.name : ""

  return {
    email: email.trim().toLowerCase(),
    name: name.trim()
  }
}
