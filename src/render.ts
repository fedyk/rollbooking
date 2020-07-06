import * as ejs from "ejs"
import * as path from "path"

const views = path.join(__dirname, "/../views")

export function renderView(view: string, data = {}) {
  return ejs.renderFile(path.join(views, view), data)
}
