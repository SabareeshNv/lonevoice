/**
 * Turns a Markdown image with a title into a figure with a caption:
 *
 *   ![A narrow lane](../../assets/covers/lane.jpg "The lane behind the market, 7 a.m.")
 *
 * becomes <figure><img …><figcaption>The lane behind the market, 7 a.m.</figcaption></figure>.
 * An image without a title is left alone. Written for Sätteri, Astro's Markdown processor.
 */
export const captions = {
  name: 'lone-voice-captions',
  element: {
    filter: ['p'],
    visit(node, ctx) {
      // A paragraph holding only one image (ignoring blank text around it).
      const content = node.children.filter((child) => !(child.type === 'text' && !child.value.trim()));
      const image = content[0];
      if (content.length !== 1 || image.type !== 'element' || image.tagName !== 'img') return;

      const caption = image.properties?.title;
      if (!caption) return;
      const { title, ...properties } = image.properties;

      ctx.replaceNode(node, {
        type: 'element',
        tagName: 'figure',
        properties: {},
        children: [
          { ...image, properties },
          { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: String(caption) }] },
        ],
      });
    },
  },
};
