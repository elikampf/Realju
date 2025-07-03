# Real Judaism Website

A modern, responsive website for Real Judaism featuring Rabbi Ari Klapper's podcast series and Torah guidance.

## Website Structure

### Main Pages
- **Homepage** (`index.html`) - Landing page with hero, challenge buttons, and featured content
- **Podcasts** (`podcasts.html`) - Overview of all podcast series with categorized sections
- **Blog** (`blog.html`) - Three featured articles on marriage and relationships
- **About** (`about.html`) - Rabbi Klapper's background and teaching philosophy
- **Contact** (`contact.html`) - Contact form with Formspree integration

### Individual Podcast Pages
Located in the `podcasts/` directory:
- **Dating** (`dating.html`) - 8-episode series on finding your bashert
- **Shalom Bayis** (`shalom-bayis.html`) - Complete marriage guidance series
- **Shalom Bayis Hebrew** (`shalom-bayis-hebrew.html`) - Hebrew marriage series
- **Shmeiras Einayim** (`shmeiras-einayim.html`) - Spiritual focus series
- **Shemiras Halashon** (`shemiras-halashon.html`) - 150+ episodes on speech ethics
- **Shabbos Malkesa** (`shabbos-malkesa.html`) - Weekly Shabbos inspiration
- **Mesilas Yesharim** (`mesilas-yesharim.html`) - Spiritual growth series

## Navigation Features

### Desktop Navigation
- Fixed header with logo and tagline
- Dropdown menu for Podcasts section showing all series
- Clean navigation with hover states
- "Get Help" CTA button

### Mobile Navigation
- Hamburger menu toggle
- Full-screen overlay navigation
- Expandable podcasts dropdown
- Touch-friendly interface

## Design System

### Color Palette
- Primary Navy: `#1B365D`
- Warm Gold: `#C9A961`
- Soft Gray: `#6B7280`
- Clean White: `#FFFFFF`
- Light Blue: `#E0F2FE`
- Warm Cream: `#FDF6E3`

### Typography
- Headers: Libre Baskerville (serif)
- Body: Inter (sans-serif)
- Responsive sizing with clear hierarchy

### Components
- Hero sections with call-to-action
- Card-based layouts for series
- Responsive grids (3-column, 2-column, 1-column)
- Interactive hover states
- Accessible form elements

## Technical Details

### File Structure
```
Website/
├── index.html
├── about.html
├── blog.html
├── contact.html
├── podcasts.html
├── podcasts/
│   ├── dating.html
│   ├── shalom-bayis.html
│   ├── shalom-bayis-hebrew.html
│   ├── shmeiras-einayim.html
│   ├── shemiras-halashon.html
│   ├── shabbos-malkesa.html
│   └── mesilas-yesharim.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── episode-loader.js
│   └── [podcast-specific JS files]
├── Images/
│   └── [all podcast covers and profile image]
└── Blog/
    └── [markdown files for blog content]
```

### JavaScript Features
- Mobile navigation toggle
- Dropdown menu functionality
- Smooth scrolling
- Form validation and submission
- Episode loading system
- Responsive behavior handlers

### Accessibility
- Skip links for keyboard navigation
- ARIA labels on interactive elements
- Semantic HTML structure
- Focus management
- Screen reader announcements

## Setup Instructions

1. **Local Development**
   - Open any HTML file directly in a browser
   - All paths are relative for local file access
   - No server required for basic functionality

2. **Form Integration**
   - Contact form uses Formspree
   - Update the form action URL with your Formspree endpoint

3. **Podcast Episodes**
   - Episodes are loaded dynamically via JavaScript
   - Update the corresponding JS files in the `js/` directory

## Deployment

1. **Upload all files** maintaining the directory structure
2. **Update paths** if deploying to a subdirectory
3. **Configure form endpoint** for contact functionality
4. **Add analytics** (optional) to track usage
5. **Test all navigation** and responsive behavior

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (iOS and Android)
- Fallback styling for older browsers

## Customization

### Adding New Podcast Series
1. Create new HTML file in `podcasts/` directory
2. Add corresponding JavaScript file for episodes
3. Update navigation dropdown in all pages
4. Add series to podcasts.html overview page

### Updating Content
- Edit HTML files directly for static content
- Modify episode data in JavaScript files
- Update images in the Images directory
- Adjust styles in css/styles.css

## Contact
For questions or support: rabbiariklapper@gmail.com 