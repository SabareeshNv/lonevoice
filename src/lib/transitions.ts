/**
 * How the page changes. Astro's <ClientRouter /> runs the browser's View
 * Transitions API on every navigation; this file says what the main column does.
 * The keyframes live in src/styles/transitions.css.
 *
 * Deliberately small: the page content eases in, the header, sidebar and footer
 * stay put, and one picture (the cover of the post being opened) travels.
 */
import type { TransitionAnimationPair } from 'astro';

/** The old content fades out quickly; the new content fades in and settles up a few pixels. */
const pageChange: TransitionAnimationPair = {
  old: { name: 'lv-page-out', duration: '0.12s', easing: 'ease-in', fillMode: 'forwards' },
  new: { name: 'lv-page-in', duration: '0.3s', easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fillMode: 'backwards' },
};

/** The same in both directions (forwards and back). */
export const pageAnimation = { forwards: pageChange, backwards: pageChange };

/** The shared name of the cover that travels between a card and its post page. */
export const COVER_NAME = 'post-cover';
