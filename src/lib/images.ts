/**
 * Post covers are made in several widths and the browser picks the one its screen
 * needs (a phone at 3x needs about 1100 px, a retina laptop about 1300 px). A cover
 * is never made wider than the original picture.
 */
export const COVER_WIDTHS = [480, 720, 960, 1280, 1600];

/**
 * How wide a cover is shown, for the browser to choose from the widths above: the
 * body of the card or post. Phones: the screen minus the page gutters. Tablet:
 * the screen minus the sidebar and the date column. Desktop: a fixed 41.5 rem.
 */
export const COVER_SIZES = '(min-width: 64rem) 41.5rem, (min-width: 48rem) calc(100vw - 24.25rem), calc(100vw - 2rem)';
