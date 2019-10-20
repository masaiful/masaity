const { html } = require('common-tags');

module.exports = NotistSlides;

function NotistSlides(_content, { notistEmbed }) {
  const { notistId, aspectRatio } = notistEmbed;

  return html`
    <div class="md-replaced aspect-ratio aspect-ratio--${aspectRatio} bg-light-gray">
      <iframe
        class="aspect-ratio--object fit-cover"
        src="https://noti.st/${notistId}/embed"
        allowfullscreen
        frameborder="0"
        loading="lazy"
      >
      </iframe>
    </div>
  `;
}
