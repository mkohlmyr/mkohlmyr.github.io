---
title: "Lorem ipsum dolor sit amet"
date: 2025-12-01
description: "This is my first article using Eleventy"
layout: "article"
cover: "splash.png"
---
# Lorem ipsum dolor
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pulvinar eu neque ac mattis. Praesent vehicula a massa at ullamcorper. Sed facilisis justo neque, in ullamcorper neque facilisis eu. Proin viverra malesuada laoreet. Ut rutrum sed turpis feugiat pretium. Phasellus convallis neque ex, vitae imperdiet augue ultricies nec.

This paragraph mixes **bold text**, *italicised text*, <u>underlined text</u>, and even ***bold italic*** together, alongside a short `inline code` snippet like `npm install eleventy` to see how monospace type sits inside a sentence. Curabitur ac lacinia ligula. Mauris nec enim nulla. Sed ornare lobortis magna, non volutpat massa accumsan non.

## Quisque sit amet
Quisque sit amet mi vitae ipsum volutpat aliquet. Quisque et velit vulputate, vestibulum lacus vel, sagittis odio. Vivamus tristique pretium dui, non accumsan mauris mattis at. For further reading, see the [Eleventy documentation](https://www.11ty.dev/docs/) or browse the [project on GitHub](https://github.com/11ty/eleventy).

Etiam porta sagittis dolor sit amet hendrerit. In quis purus mollis, mattis est eget, semper orci. Etiam ut faucibus lacus. Pellentesque porttitor facilisis velit, vel varius sapien imperdiet at.

> Design is not just what it looks like and feels like. Design is how it works.
>
> — Steve Jobs

### Pellentesque laoreet pretium
Pellentesque laoreet pretium lorem, nec molestie sapien ultricies eget. Vestibulum varius neque justo, non luctus elit elementum sit amet. Below is a small helper used to format the article dates shown on the front page:

```js
function formatDate(dt) {
  return new Date(dt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
```

Phasellus tempor massa et lorem fermentum tincidunt. Quisque hendrerit mauris turpis, non feugiat dolor finibus et. Curabitur iaculis justo nisi, vel pharetra tellus venenatis ac.

<figure>
  <img src="/assets/images/cover/splash.png" alt="Sunlight scattering through a fine water spray, captured mid-splash against a dark background." />
  <figcaption>A high-speed capture of a splash, used here only to preview image and caption styling.</figcaption>
</figure>

Suspendisse sed posuere sem. Duis ut quam gravida odio faucibus venenatis eu nec eros. Vivamus vitae viverra metus. Suspendisse volutpat, nisi ut ornare ultrices, urna lorem rhoncus enim, in aliquet dolor tellus vel ante.
