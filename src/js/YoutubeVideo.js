import YTPlayer from '@fpapado/yt-player';
import { focusOnElement } from './fix-in-page-links';

// Selectors
const VIDEO_ID_DATA_ATTRIBUTE = 'data-youtube-video-id';
const CLIP_TIME_DATA_ATTRIBUTE = 'data-youtube-video-clip-time';
const BUTTON_CLASS = 'youtube-video-button';

// Visual states
// JS has not come in, not interactive!
const PLAYER_INACTIVE_CLS = 'youtube-video--inactive';
const BUTTON_INACTIVE_CLS = 'youtube-video-button--inactive';

// JS is in, interactive
const PLAYER_ACTIVE_CLS = 'youtube-video--active';
const BUTTON_ACTIVE_CLS = 'youtube-video-button--active';

const player_map = {};
const state = {
  clipItemsList: [],
  followPlayerTimestamps: false,
  currentFocusedClipTime: null,
  userWantsReducedMotion: false,
};

/**
 * Component that looks for "placeholder" Youtube players on the page.
 * On click, loads the complete iframe player for the videoId specified.
 * Using yt-player allows us to deduplicate the script requests, and make
 * this process simpler from a development perspective.
 *
 * The structure for the selectors:
 *   <div data-youtube-video-id="">
 *     <button class="youtube-video-button">Play</button>
 *   </div>
 */
export function init() {
  const elements = document.querySelectorAll(`[${VIDEO_ID_DATA_ATTRIBUTE}]`);
  const timestampButtons = document.querySelectorAll(`[data-video-timestamp]`);
  const splitButton = document.querySelectorAll('.SplitButton')[0];
  const followTimestampButton = document.querySelectorAll(
    '.FollowTimestampButton'
  )[0];

  // Nothing to do without elements
  if (!elements) {
    return;
  }

  // Add listener for @media prefers-reduced-motion
  // @see https://developers.google.com/web/updates/2019/03/prefers-reduced-motion
  // Initial state
  const reducedMotionMediaQuery = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );
  state.userWantsReducedMotion = reducedMotionMediaQuery.matches;
  // Future changes
  reducedMotionMediaQuery.addEventListener('change', ev => {
    state.userWantsReducedMotion = reducedMotionMediaQuery.matches;
  });

  // Attach handlers to each element
  elements.forEach(playerEl => {
    const videoId = playerEl.getAttribute(VIDEO_ID_DATA_ATTRIBUTE);
    const clipTime = playerEl.getAttribute(CLIP_TIME_DATA_ATTRIBUTE);
    const clipTimeSeconds = parseInt(clipTime);
    const videoButton = playerEl.getElementsByClassName(BUTTON_CLASS)[0];

    // Some basic validations
    if (!videoId) {
      console.error('Video does not have an id.');
      return;
    }
    if (!videoButton) {
      console.error(`Video with videoId ${videoId} does not have a button.`);
      return;
    }

    // If ok, add click handler to button and div
    // The div onClick is there to expan target, but the button
    // is also important for accessibility.
    const handler = getOnClickHandler({ videoId, clipTimeSeconds }, playerEl);
    playerEl.addEventListener('click', handler);

    // Enable the button and add affordances now that we are set up
    playerEl.classList.remove(PLAYER_INACTIVE_CLS);
    playerEl.classList.add(PLAYER_ACTIVE_CLS);

    videoButton.removeAttribute('disabled');
    videoButton.classList.remove(BUTTON_INACTIVE_CLS);
    videoButton.classList.add(BUTTON_ACTIVE_CLS);

    // TODO: Match these buttons via data-video-timestamp-for
    timestampButtons.forEach(button => {
      const clipTime = button.getAttribute('data-video-timestamp');
      const clipTimeSeconds = clipTimeToSeconds(clipTime);
      state.clipItemsList.push({ clipTime, clipTimeSeconds });

      button.addEventListener('click', () => {
        const { was, player } = getOrCreatePlayer({
          videoId,
          clipTimeSeconds,
          playerEl,
        });

        // The player is fresh, load the video at the start time, and play
        if (was === 'NOT_CREATED') {
          player.load(videoId, { startSeconds: clipTimeSeconds });
          player.play();
        }
        // The player exists, just seek to the time
        else {
          player.seek(clipTimeSeconds);
        }
      });
    });

    // Reverse the clipItemsList
    if (state.clipItemsList !== []) {
      state.clipItemsList.reverse();
    }

    followTimestampButton.addEventListener('click', () => {
      setPressed(followTimestampButton, {
        onPressed: () => {
          state.followPlayerTimestamps = true;
        },
        onUnPressed: () => {
          state.followPlayerTimestamps = false;
        },
      });
    });

    splitButton.addEventListener('click', () => {
      setPressed(splitButton, {
        onPressed: () => {
          // Switch layout to side-by-side
          const layoutEl = document.getElementsByClassName(
            'VideoWithTranscript'
          )[0];
          if (layoutEl) {
            layoutEl.setAttribute('data-layout', 'split');
          }

          const templateEl = document.getElementsByClassName(
            'tmpl-talk-with-transcript'
          )[0];
          if (templateEl) {
            templateEl.setAttribute('data-layout', 'full-width');
          }
        },
        onUnPressed: () => {
          // Switch layout to stacked
          const layoutEl = document.getElementsByClassName(
            'VideoWithTranscript'
          )[0];
          if (layoutEl) {
            layoutEl.setAttribute('data-layout', 'stacked');
          }

          const templateEl = document.getElementsByClassName(
            'tmpl-talk-with-transcript'
          )[0];
          if (templateEl) {
            templateEl.removeAttribute('data-layout');
          }
        },
      });
    });
  });
}

function setPressed(el, { onPressed, onUnPressed }) {
  // Toggle on
  if (el.getAttribute('aria-pressed') === 'false') {
    el.setAttribute('aria-pressed', 'true');
    onPressed();
  }
  // Toggle off
  else if (el.getAttribute('aria-pressed') === 'true') {
    el.setAttribute('aria-pressed', 'false');
    onUnPressed();
  }
}

/** On click, loads the complete iframe player for the videoId specified. */
function getOnClickHandler({ videoId, clipTimeSeconds }, playerEl) {
  // TODO: Show loading spinner, and communicate progress to AT
  return function(ev) {
    const { player } = getOrCreatePlayer({
      videoId,
      clipTimeSeconds,
      playerEl,
    });
    player.load(videoId, { startSeconds: clipTimeSeconds });
    player.play();
  };
}

function getOrCreatePlayer({ videoId, clipTimeSeconds, playerEl }) {
  if (player_map[videoId] !== undefined) {
    return { was: 'CREATED', player: player_map[videoId] };
  }

  // Create player and load video
  const player = new YTPlayer(playerEl, {
    width: '100%',
    height: '100%',
  });

  // Handle errors more gracefully
  player.on('error', err => {
    // On error, remove "playable" affordance, and show help text
    playerEl.classList.remove(PLAYER_ACTIVE_CLS, 'youtube-video');
    playerEl.classList.add('bg-near-black');
    playerEl.innerHTML = errorBox(videoId, clipTimeSeconds);
    console.error('Error encountered in player: ', err);
  });

  // Follow the time events
  player.on('timeupdate', updateTimeSeconds => {
    // The clip times are sorted in reverse, so we can pick the first item smaller than the current time
    /*
        @example
        updateTime: 5
        list: 54 10 0
        pick: 0
      */
    const nextFocusedClipItem = state.clipItemsList.find(item => {
      // NOTE: Floating points ruin everything around me;
      // This combination was shown to work
      return item.clipTimeSeconds <= Math.ceil(updateTimeSeconds);
    });

    if (nextFocusedClipItem !== undefined) {
      const previousFocusedClipTime = state.currentFocusedClipTime;
      const nextFocusedClipTime = nextFocusedClipItem.clipTime;
      // Once found, only focus / scroll the time if it is different from the current focused time
      if (nextFocusedClipTime !== previousFocusedClipTime) {
        setClipTimeFocus(nextFocusedClipTime);
        cleanClipTimeFocus(previousFocusedClipTime);
        state.currentFocusedClipTime = nextFocusedClipTime;

        // If specified to follow clips, then also focus the element
        if (state.followPlayerTimestamps === true) {
          focusClipTime(nextFocusedClipTime);
        }
      }
    }
  });

  player_map[videoId] = player;
  return { was: 'NOT_CREATED', player };
}

function errorBox(videoId, clipTimeSeconds) {
  return `
    <div class="vs3 pa3 fg-secondary">
      <p class="mv0 f4 f3-ns fw7 lh-title">Oh no!</p>
      <p class="mv0 f-copy f4-ns lh-copy measure-prose nested">
        There was an error with the player, sorry about that. Try refreshing the page, or
          <a href="https://youtube.com/watch?v=${videoId}${
    clipTimeSeconds ? `&t=${clipTimeSeconds}` : ''
  }" style="color: #fff;">watch this video directly on Youtube</a>.
      </p>
    </div>
  `;
}

function focusClipTime(clipTime) {
  const clipEl = document.getElementById(clipTime);

  if (clipEl) {
    focusOnElement(clipEl);
    // Progressively-enhanced smooth-scroll to the item
    // Ensure that we do not smooth-scroll if the user has specified no scrolling
    clipEl.scrollIntoView({
      behavior: state.userWantsReducedMotion ? 'auto' : 'smooth',
    });
  }
}

function setClipTimeFocus(clipTime) {
  const clipEl = document.getElementById(clipTime);

  if (clipEl) {
    clipEl.setAttribute('data-clip-focused', true);
  }
}

function cleanClipTimeFocus(clipTime) {
  const clipEl = document.getElementById(clipTime);

  if (clipEl) {
    clipEl.removeAttribute('data-clip-focused');
  }
}

//
// UTIL

/** Convert clip time to seconds
 * @example clipTimeToMs('22:00') -> 1320
 */
function clipTimeToSeconds(time) {
  /**
   * Segments:
   *  - 0/Seconds: 1
   *  - 1/Minutes: 60 * 1
   *  - 2/Hours: 60 * 60 * 1
   */
  const toSeconds = {
    0: 1,
    1: 60 * 1,
    2: 60 * 60 * 1,
  };

  /**
   * Split and normalise the time by reverting the array, then sum
   */
  const seconds = time
    .split(':')
    .reverse()
    .map(i => parseInt(i))
    .map((val, i) => val * toSeconds[i])
    .reduce((acc, curr) => acc + curr, 0);

  return seconds;
}
