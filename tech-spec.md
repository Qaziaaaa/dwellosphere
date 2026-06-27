# Archipro Website - Technical Specification

## 1. Tech Stack Overview

| Category | Technology |
|----------|------------|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS 3.4 |
| UI Components | shadcn/ui |
| Animation | Framer Motion |
| Icons | Lucide React |
| Routing | React Router DOM |

## 2. Tailwind Configuration Extensions

```javascript
// tailwind.config.js extensions
{
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B47',
          hover: '#E85A38',
        },
        background: '#F5F5F5',
        surface: '#FFFFFF',
        'text-primary': '#1A1A1A',
        'text-secondary': '#666666',
        'text-muted': '#999999',
        border: '#E5E5E5',
        'dark-bg': '#1A1A1A',
        'dark-surface': '#2A2A2A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.8s ease-out forwards',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
}
```

## 3. Component Inventory

### Shadcn/UI Components (Pre-installed)
- Button (customized: rounded-full)
- Accordion (for FAQ)
- Input (for newsletter)
- Sheet (for mobile nav)
- DropdownMenu (for nav dropdown)

### Custom Components

| Component | Props | Description |
|-----------|-------|-------------|
| `Navbar` | `scrolled: boolean` | Fixed nav with scroll effect |
| `HeroSection` | `title, cta, image` | Home hero with animations |
| `ServiceCard` | `title, description, image, index` | Service showcase card |
| `CTASection` | `title, description, image, buttonText` | Full-width CTA with parallax |
| `ProjectCard` | `title, location, image` | Portfolio project display |
| `ProcessCard` | `step, title, description, image` | Process step card |
| `TestimonialCard` | `quote, author, location` | Testimonial with marquee |
| `ArticleCard` | `title, category, image, featured?` | Blog article card |
| `TeamCard` | `name, role, image` | Team member card |
| `ValueCard` | `title, description, icon, color` | Value principle card |
| `LocationItem` | `city, country, active?` | Office location item |
| `Footer` | - | Full footer with newsletter |

### Animation Components

| Component | Purpose |
|-----------|---------|
| `FadeIn` | Wrapper for fade-in animations |
| `SlideUp` | Wrapper for slide-up animations |
| `StaggerContainer` | Parent for staggered children |
| `CountUp` | Animated number counter |
| `Marquee` | Infinite scroll container |

## 4. Animation Implementation Plan

### Global Animations

| Animation | Tech | Implementation |
|-----------|------|----------------|
| Page Load | Framer Motion | `AnimatePresence` + initial/animate states |
| Scroll Reveal | Framer Motion | `whileInView` with viewport settings |
| Smooth Scroll | CSS | `scroll-behavior: smooth` on html |
| Navbar Scroll | React State | `useScroll` hook + conditional classes |

### Section-Specific Animations

| Section | Animation | Tech | Implementation Details |
|---------|-----------|------|------------------------|
| **Navbar** | Background transition | React + CSS | `useEffect` scroll listener, toggle `scrolled` class |
| **Hero** | Text stagger | Framer Motion | `staggerChildren: 0.1`, `y: 30→0`, `opacity: 0→1` |
| **Hero** | Image scale | Framer Motion | `scale: 0.95→1`, `opacity: 0→1`, delay: 0.2s |
| **Services** | Card reveal | Framer Motion | `whileInView`, stagger 0.15s, `y: 40→0` |
| **Services** | Card hover | Framer Motion | `whileHover: { y: -4, scale: 1.02 }` |
| **CTA** | Parallax bg | Framer Motion | `useScroll` + `useTransform` for y offset |
| **CTA** | Text fade | Framer Motion | `whileInView`, `opacity: 0→1`, `x: -30→0` |
| **Works** | Image hover | CSS | `group-hover:scale-105`, overflow hidden |
| **Works** | List hover | CSS | Arrow slide in, text shift |
| **Process** | Card stagger | Framer Motion | `whileInView`, stagger 0.2s |
| **Testimonials** | Marquee | CSS Animation | `@keyframes marquee`, infinite linear |
| **Testimonials** | Pause hover | CSS | `hover:animation-play-state: paused` |
| **Stats** | Count up | Custom Hook | `useCountUp` with intersection observer |
| **Team** | Card hover | Framer Motion | `whileHover: { y: -8 }`, image scale |
| **FAQ** | Accordion | Framer Motion | `AnimatePresence`, height auto animation |
| **FAQ** | Icon rotate | CSS | `rotate: 0→45deg` on open |
| **Footer** | Link hover | CSS | Color transition to primary |

### Animation Timing Reference

```typescript
const ANIMATION_CONFIG = {
  // Durations
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
  
  // Easings
  easeOut: [0.4, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  bounce: [0.34, 1.56, 0.64, 1],
  smooth: [0.25, 0.46, 0.45, 0.94],
  
  // Stagger
  staggerChildren: 0.1,
  staggerDelay: 0.15,
  
  // Viewport
  viewport: { once: true, margin: "-100px" },
};
```

## 5. Project File Structure

```
/mnt/okcomputer/output/app/
├── public/
│   └── images/
│       ├── hero-architecture.jpg
│       ├── service-exterior.jpg
│       ├── service-decoration.jpg
│       ├── service-construction.jpg
│       ├── cta-interior.jpg
│       ├── project-la-house.jpg
│       ├── cta-work-together.jpg
│       ├── process-1.jpg
│       ├── process-2.jpg
│       ├── process-3.jpg
│       ├── blog-featured.jpg
│       ├── blog-1.jpg
│       ├── blog-2.jpg
│       ├── blog-3.jpg
│       ├── about-hero.jpg
│       ├── video-thumbnail.jpg
│       ├── team-john.jpg
│       ├── team-sophie.jpg
│       ├── team-matt.jpg
│       ├── team-lilly.jpg
│       └── office-ny.jpg
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── FadeIn.tsx
│   │   ├── SlideUp.tsx
│   │   ├── StaggerContainer.tsx
│   │   └── CountUp.tsx
│   ├── sections/
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── LogoBar.tsx
│   │   │   ├── ServicesSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── WorksSection.tsx
│   │   │   ├── WorkTogetherSection.tsx
│   │   │   ├── ProcessSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   └── ArticlesSection.tsx
│   │   └── about/
│   │       ├── HeroSection.tsx
│   │       ├── StatsSection.tsx
│   │       ├── ValuesSection.tsx
│   │       ├── TeamSection.tsx
│   │       ├── LocationsSection.tsx
│   │       └── FAQSection.tsx
│   ├── hooks/
│   │   ├── useScrollPosition.ts
│   │   └── useCountUp.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── About.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## 6. Package Installation Commands

```bash
# Initialize project (already done by skill)
bash /app/.kimi/skills/webapp-building/scripts/init-webapp.sh "Archipro"

# Install animation library
npm install framer-motion

# Install additional dependencies (if needed)
npm install lucide-react
```

## 7. Key Implementation Notes

### Navbar Scroll Effect
```typescript
// useScrollPosition hook
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Class application
className={cn(
  "fixed top-0 w-full z-50 transition-all duration-300",
  scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
)}
```

### Framer Motion Variants
```typescript
// Fade in from bottom
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  }
};

// Stagger container
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Scale in
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};
```

### Count Up Hook
```typescript
const useCountUp = (end: number, duration: number = 2) => {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);
  
  return { count, setIsInView };
};
```

### Marquee CSS
```css
.marquee-container {
  overflow: hidden;
  white-space: nowrap;
}

.marquee-content {
  display: inline-flex;
  animation: marquee 30s linear infinite;
}

.marquee-container:hover .marquee-content {
  animation-play-state: paused;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

## 8. Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large |

## 9. Performance Considerations

1. **Images**: Use `loading="lazy"` for below-fold images
2. **Animations**: Use `transform` and `opacity` only
3. **Will-change**: Apply to frequently animated elements
4. **Reduced motion**: Respect `prefers-reduced-motion`
5. **Code splitting**: Lazy load sections if needed
