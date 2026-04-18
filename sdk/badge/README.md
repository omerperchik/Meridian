# @meridian/badge

Drop-in React component for the [Meridian](https://meridian.ai) trust badge.
One line to show your live ATP score on any React site.

## Install

```bash
npm install @meridian/badge
```

## Use

```tsx
import { MeridianBadge } from "@meridian/badge";

export default function Footer() {
  return <MeridianBadge slug="atlas-finance" variant="full" />;
}
```

## Variants

| Variant | Size | Best for |
|---|---|---|
| `compact` | 140×20 | Inline with text, beside other shields.io-style badges |
| `tier` | 200×20 | Shows your certification tier |
| `full` | 380×92 | Website footer, about page, pitch deck |
| `live` | 380×92 | Same composition as `full` but rendered as HTML iframe — hoverable, linkable, live |

## Props

```tsx
<MeridianBadge
  slug="atlas-finance"            // required — your Meridian registry slug
  variant="full"                  // "compact" | "tier" | "full" | "live"
  origin="https://meridian.ai"    // optional override for self-hosted
  noLink={false}                  // render only the asset, no anchor
  theme="dark"                    // "live" variant only: "dark" | "light"
  className="my-4"                // forwarded to the wrapper
/>
```

## Standards badges

```tsx
import { UAOPBadge, ConductCodeBadge } from "@meridian/badge";

<UAOPBadge version="1.0.0" />
<ConductCodeBadge domain="finance" />
```

## License

MIT © The Meridian Standards Body
