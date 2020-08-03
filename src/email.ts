import { renderView } from "./render";

interface Options {
  to: string
  subject: string
  template: string
  templateData: object
}

export async function sendEmail(options: Options) {
  const body = await renderView(options.template, options.templateData)

  console.log("Mail to %s: %s\n%s", options.to, options.subject, body)
}