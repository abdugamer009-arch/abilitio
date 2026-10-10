import appCss from "../styles.css?url";

export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="${appCss}" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&amp;family=DM+Sans:opsz,wght@9..40,400..800&amp;family=Caveat:wght@600;700&amp;family=Rubik:wght@500..800&amp;family=Onest:wght@400..800&amp;display=swap" />
  </head>
  <body class="fallback-error">
    <div class="panel empty-card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="field-button" onclick="location.reload()">Try again</button>
        <a class="field-button secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
