import * as types from "../types";
import * as html from "../helpers/html";

/**
 * @example
 * ```
 * router.get("/", layout, async (ctx) => {
 *   ctx.body = "Some HTML";
 * })
 * ```
 */
export const layout: types.Middleware = async (ctx, next) => {
  await next()

  ctx.body = renderLayout({
    isAuthenticated: !!ctx.state.user,
    userName: ctx.state.user ? ctx.state.user.name : null,
    userId: ctx.state.user ? ctx.state.user.id : null,
    body: ctx.body,
  })
}

interface Props {
  body: string;
  userId?: string;
  userName?: string;
  isAuthenticated: boolean;
}

const renderLayout = (props: Props) => /*html*/`
<div class="border-bottom bg-white">
  <div class="container d-flex flex-column flex-md-row align-items-center py-2">
    <a class="my-0 mr-md-auto" href="/" title="Home">
      <img src="/images/logo.svg" width="128" height="30">
    </a>

    <nav class="my-2 my-md-0 mr-md-3">
      <a class="p-2 text-dark" href="/explore">Explore</a>
    </nav>

    ${props.isAuthenticated
    ? `<a class="btn btn-link" href="/p/${props.userId}">${html.escape_DEPRECATE(props.userName)}</a>`
    : `<a class="btn btn-link" href="/login">Sign in</a>`
  }
  </div>
</div>

${props.body}

<div class="container py-3">© 2020 Rollbooking</div>
`
