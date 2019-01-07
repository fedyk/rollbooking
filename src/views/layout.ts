interface IProps {
  content: string;
}

export function layout(props: IProps) {
  return `<!doctype html>
    <html class="no-js" lang="">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>{% block title %}rollbooking{% endblock %}</title>
      <meta name="description" content="">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

      <link rel="stylesheet" href="/css/normalize.css">
      <link rel="stylesheet" href="/css/main.css">

      <script src="/js/common.js?2"></script>

      {% block head %}
        <!-- Custom head tags -->
      {% endblock %}
    </head>

    <body>
      <!--[if lte IE 9]>
        <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience and security.</p>
      <![endif]-->

      ${props.content}
    </body>
  </html>`
}