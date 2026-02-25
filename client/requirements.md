## Packages
framer-motion | Page transitions, micro-interactions, and fluid animations for a premium app feel
clsx | Conditional Tailwind class merging (standard utility)
tailwind-merge | Utility for merging Tailwind classes safely

## Notes
- Tailwind Config: Need to extend fontFamily to include 'Prompt' (var(--font-sans)) and 'Kanit' (var(--font-display))
- App is designed as a Mobile-First PWA, constrained to `max-w-md mx-auto` to simulate a mobile app experience on desktop screens.
- Standard Shadcn components are assumed to be present in `@/components/ui/`.
