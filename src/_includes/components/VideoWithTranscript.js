const { html } = require('common-tags');
const fs = require('fs');
const path = require('path');
const Link = require('./Link');
const Subheading = require('./Subheading');
const MdImg = require('./MdImg');
const Highlight = require('./Highlight');
const NotistSlides = require('./NotistSlides');

// Main export
module.exports = VideoWithTranscript;

function VideoWithTranscript(
  _content,
  { videoId, clipTimeSeconds, transcriptFilename, interjections, notistEmbed }
) {
  const transcriptFile = fs.readFileSync(path.resolve(transcriptFilename), {
    encoding: 'utf8',
  });

  return html`
    <div class="vs5">
      <div class="article mw7">
        ${Subheading('Slides', { level: 2 })}
        <p>
          You can find the
          ${Link('full set of slides and resources on Notist', {
            href: notistEmbed.href,
            isExternal: true,
          })}.
        </p>
        ${NotistSlides(null, { notistEmbed })}
      </div>
      <div class="VideoWithTranscript article" data-layout="stacked">
        <div class="VideoWithTranscript-Video vs3">
          ${Subheading('Video', { level: 2 })}
          ${YoutubeVideo({ videoId, clipTimeSeconds })}
        </div>

        <div class="VideoWithTranscript-Transcript">
          ${Subheading('Transcript', { level: 2 })}
          ${Transcript({ transcriptFile, interjections })}
        </div>
      </div>
    </div>
  `;
}

function Transcript({ interjections, transcriptFile }) {
  console.log({ interjections });
  /* Split the lines in the file, and separate the speaker */
  const speakerAndSegmentList = transcriptFile
    .split('\r\n')
    .map(line => {
      // Split at first occurence of : , then at 01:23
      // Match:
      //   Fotis  01:23  Things here to say
      // @see https://regex101.com/r/p1JSaC/1
      const matches = line.match(/(\w+):\s+(\d+:\d+)\s+(.*)/);
      if (matches === null) {
        return {};
      }
      return {
        speaker: matches[1],
        time: matches[2],
        segment: matches[3] !== undefined ? matches[3].trim() : segment,
      };
    })
    .filter(i => i !== {})
    .filter(({ speaker, time, segment }) => !!speaker && !!time && !!segment);

  return html`
    <div class="article">
      <dl
        class="vs5"
      >
        ${speakerAndSegmentList.map(
          ({ speaker, time, segment }, index) =>
            html`
              <div class="vs3">
                <dt class="video-timestamp f3 fw6" id=${time}>
                  <span>${speaker}</span>
                  <button
                    class="video-timestamp-button button-reset ph2 pv1 fw6 fg-primary enhanced-outline-shadow hover-fg-secondary hover-bg-primary focus-fg-secondary focus-bg-primary transition-performant ba bw1 br2 b--primary pointer"
                    data-video-timestamp="${time}"
                    >${time}</button
                  >
                  <a
                    href="#${time}"
                    class="pv1 hide-print"
                    aria-label="Link to ${time}"
                    >#</a
                  ></dt
                >
                <dd class="ml0">
                  <p>${segment}</p>
                  ${interjections
                    .filter(({ slide }) => {
                      console.log({ slide, index });
                      return slide === index;
                    })
                    .map(Interjection)}
                </dd>
              </div>
            `
        )}
      </div>
    </div>
  `;
}

function Interjection({ type, data }) {
  switch (type) {
    case 'code':
      const { language, content } = data;
      // TODO: Use Prism
      return Highlight(content, language);

    case 'img':
      return MdImg(null, data);

    default:
      throw Error(`Unrecognised Interjection type: ${type}`);
  }
}

// VIDEO
function YoutubeVideo({ videoId, clipTimeSeconds }) {
  return html`
    <div class="vs3">
      <div class="md-replaced aspect-ratio aspect-ratio--16x9 bg-primary hide-print">
        ${YoutubeThumbnail({
          videoId,
          alt: '',
          className: 'aspect-ratio--object fit-cover',
        })}
        <div
          data-youtube-video-id="${videoId}"
          data-youtube-video-clip-time="${clipTimeSeconds}"
          class="youtube-video youtube-video--inactive aspect-ratio--object flex justify-center items-center"
        >
          <button
            class="youtube-video-button youtube-video-button--inactive button-reset"
            aria-label="Play Video"
            disabled
          >
            <svg
              width="100%"
              height="100%"
              viewBox="4 4 16 16"
              class="youtube-video-svg"
              xmlns="http://www.w3.org/2000/svg"
              focusable="false"
              aria-hidden="true"
            >
              <path
                class="youtube-video-svg-bg"
                d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"
              ></path>
              <polygon
                class="youtube-video-svg-fg"
                points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
              ></polygon>
            </svg>
          </button>
        </div>
        <noscript>
          <iframe
            class="aspect-ratio--object fit-cover"
            src="${getYoutubeEmbedUrl({ videoId, clipTimeSeconds })}"
            title="Youtube Player"
            id="ytplayer"
            type="text/html"
            frameborder="0"
          >
          </iframe>
        </noscript>
      </div>
      <div class="lh-copy">
        ${Link('You can also watch this video directly on Youtube.', {
          href: getYoutubeVideoUrl({
            videoId,
            clipTimeSeconds,
            isExternal: true,
          }),
        })}
      </div>
      <div class="flex ButtonGroup">
        <button
          class="SplitButton button-reset ph2 pv1 f4 fw6 ba bw1 b--primary br2 enhanced-outline-shadow transition-performant pointer"
          aria-pressed="false"
          >Split view</button
        >
        <button
          class="FollowTimestampButton button-reset ph2 pv1 f4 fw6 ba bw1 b--primary br2 enhanced-outline-shadow transition-performant pointer"
          aria-pressed="false"
          >Follow transcript</button
        >
      </div>
    </div>
  `;
}

//
// THUMBNAIL
/**
 * Add a youtube video's thumbnails as a responsive <img>.
 * Uses `srcset` for the alternatives.
 *
 * @see https://developers.google.com/youtube/v3/docs/thumbnails#properties
 */

const THUMBS = {
  default: {
    suffix: 'default',
    width: 120,
  },
  medium: {
    suffix: 'mqdefault',
    width: 320,
  },
  high: {
    suffix: 'hqdefault',
    width: 480,
  },
  standard: {
    suffix: 'sddefault',
    width: 640,
  },
  maxres: {
    suffix: 'maxresdefault',
    width: 1280,
  },
};

const FORMATS = {
  jpg: {
    endpoint: 'vi',
  },
  webp: {
    endpoint: 'vi_webp',
  },
};

function YoutubeThumbnail({
  videoId,
  alt = '',
  className = '',
  sizes = '100vw',
}) {
  return html`
    <picture>
      <source srcset="${makeSrcset(videoId, 'webp')}" type="image/webp" />
      <source srcset="${makeSrcset(videoId, 'jpg')}" type="image/jpeg" />

      <img
        alt="${alt}"
        src="${makeSrc(videoId)}"
        sizes="${sizes}"
        class="${className}"
      />
    </picture>
  `;
}

function makeSrcset(videoId, format = 'jpg') {
  return Object.keys(THUMBS)
    .map(thumb => `${makeSrc(videoId, thumb, format)} ${THUMBS[thumb].width}w`)
    .join(', ');
}

function makeSrc(videoId, size = 'medium', format = 'jpg') {
  return `https://img.youtube.com/${FORMATS[format].endpoint}/${videoId}/${THUMBS[size].suffix}.${format}`;
}

//
// URL
function getYoutubeVideoUrl({ videoId, clipTimeSeconds }) {
  return `https://youtube.com/watch?v=${videoId}${
    clipTimeSeconds ? `&t=${clipTimeSeconds}` : ''
  }`;
}

function getYoutubeEmbedUrl({ videoId, clipTimeSeconds }) {
  return `https://www.youtube.com/embed/${videoId}${
    clipTimeSeconds ? `&start=${clipTimeSeconds}` : ''
  }`;
}
