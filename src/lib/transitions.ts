/**
 * How the page changes. Astro's <ClientRouter /> runs the browser's View
 * Transitions API on every navigation; this file says what the main column does.
 * The keyframes live in src/styles/transitions.css.
 *
 * Deliberately small: the page content slides in, the header, sidebar and footer
 * stay put, and one picture (the cover of the post being opened) travels.
 */
import type { TransitionAnimationPair } from 'astro';

/*
 * Like page changes on Windows 10 Mobile: the old content fades out and nudges away,
 * the new content slides in from the side it comes from while fading in, and eases to
 * a stop (a "decelerate" curve). Forwards slides in from the right, going back from
 * the left. The distance is small (see transitions.css), so text never streaks.
 */
const EASE_OUT = 'cubic-bezier(0.1, 0.9, 0.2, 1)';

const forwards: TransitionAnimationPair = {
  old: { name: 'lv-out-left', duration: '0.15s', easing: 'ease-in', fillMode: 'forwards' },
  new: { name: 'lv-in-from-right', duration: '0.35s', easing: EASE_OUT, fillMode: 'backwards' },
};

const backwards: TransitionAnimationPair = {
  old: { name: 'lv-out-right', duration: '0.15s', easing: 'ease-in', fillMode: 'forwards' },
  new: { name: 'lv-in-from-left', duration: '0.35s', easing: EASE_OUT, fillMode: 'backwards' },
};

export const pageAnimation = { forwards, backwards };

/** The shared name of the cover that travels between a card and its post page. */
export const COVER_NAME = 'post-cover';
