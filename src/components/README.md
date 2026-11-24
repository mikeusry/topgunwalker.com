# Components

Astro components for the Top Gun National Walker team website.

## Component List

| Component | Purpose | Location |
|-----------|---------|----------|
| [Header.astro](#headerastro) | Navigation bar | All pages |
| [Schedule.astro](#scheduleastro) | Tournament schedule | Homepage |
| [Contact.astro](#contactastro) | Contact form section | Homepage, Contact page |
| [Footer.astro](#footerastro) | Site footer | All pages |

---

## Header.astro

Main navigation bar with responsive mobile menu.

### Props

```typescript
interface Props {
  transparent?: boolean;  // If true, uses transparent background (for hero overlay)
}
```

### Usage

```astro
---
import Header from '../components/Header.astro';
---

<!-- Default header (solid background) -->
<Header />

<!-- Transparent header (for pages with hero images) -->
<Header transparent />
```

### Features

- Responsive mobile hamburger menu
- Active link highlighting
- Sticky positioning on scroll
- Navigation links: Home, Roster, Schedule, About | logo | Contact, College Coaches, Join Us

### Styling

Uses Top Gun National Walker branding colors:
- Background: Navy (`#2C3669`)
- Accent: Orange (`#DE5E2F`) — active-nav underline, eyebrow, link hover only
- Mobile menu: 768px breakpoint

---

## Schedule.astro

Tournament schedule and achievements display.

### Props

No props - uses schedule data from `../data/schedule.json`

### Usage

```astro
---
import Schedule from '../components/Schedule.astro';
---

<section id="schedule">
  <Schedule />
</section>
```

### Features

- Two-column layout (Upcoming | Past)
- Achievements banner
- Tournament cards with date, location, type
- External tournament links
- Responsive mobile stacking

### Data Structure

Expects schedule.json with:
```json
{
  "upcoming": [...],
  "past": [...],
  "achievements": [...]
}
```

See [Data README](../data/README.md#schedulejson) for full schema.

---

## Contact.astro

Contact form and team contact information.

### Props

```typescript
interface Props {
  standalone?: boolean;  // If true, includes section wrapper (for contact page)
}
```

### Usage

```astro
---
import Contact from '../components/Contact.astro';
---

<!-- Embedded in homepage -->
<Contact />

<!-- Standalone contact page -->
<Contact standalone />
```

### Features

- Contact form (Name, Email, Phone, Message)
- Team contact info (email, phone)
- Coach contact details
- Social media links
- Form submission (handled client-side)

### Form Handling

Currently client-side only. To add backend submission:

1. Create form handler endpoint
2. Update form action attribute
3. Add loading states and validation

---

## Footer.astro

Site footer with navigation and social links.

### Props

No props - uses team data from `../data/team.json`

### Usage

```astro
---
import Footer from '../components/Footer.astro';
---

<Footer />
```

### Features

- Team logo and name
- Quick navigation links
- Social media icons (X/Twitter, Instagram)
- Copyright notice (auto-updates year)
- Responsive layout

### Styling

- Navy background (`#062a4b`)
- White/gray text
- Hover effects on links
- Mobile-friendly stacking

---

## Component Composition

### Typical Page Structure

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Schedule from '../components/Schedule.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
---

<Layout title="Stars National Walker">
  <Header transparent />
  <main>
    <Schedule />
    <Contact />
  </main>
  <Footer />
</Layout>
```

---

## Styling Guidelines

All components use:
- **Tailwind CSS 4** for styling
- **Stars National brand colors** (see root README)
- **Responsive breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Container classes**: `container-narrow` for max-width content

### Brand Colors

Use these Tailwind classes:
- `bg-stars-navy` - Primary navy background
- `bg-stars-navy-light` - Lighter navy
- `bg-stars-red` - Red accent
- `bg-tg-navy` - Primary navy
- `bg-tg-sky` - Alternate sections (former gold chips)
- `text-stars-*` - Text colors

---

## Creating New Components

1. **Create file** in `src/components/NewComponent.astro`
2. **Define props** with TypeScript interface
3. **Import data** if needed from `../data/*.json`
4. **Use consistent styling** with Tailwind + brand colors
5. **Add to this README** with usage examples

### Template

```astro
---
interface Props {
  title: string;
  optional?: boolean;
}

const { title, optional = false } = Astro.props;
---

<div class="component-wrapper">
  <h2 class="text-stars-navy font-bold">{title}</h2>
  {optional && <p>Optional content</p>}
</div>

<style>
  /* Component-specific styles if needed */
  .component-wrapper {
    /* Scoped styles */
  }
</style>
```

---

## Testing Components

### Visual Testing

1. Start dev server: `npm run dev`
2. Visit http://localhost:4321
3. Check responsive behavior (mobile, tablet, desktop)
4. Verify all links work
5. Test form interactions

### Build Testing

```bash
npm run build
npm run preview
```

Ensures components work in production build.

---

## Related Documentation

- [Data Schemas](../data/README.md) - JSON data structure
- [Page Routes](../pages/README.md) - How pages use components
- [Root README](../../README.md) - Project overview
