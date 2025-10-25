# Agent Guidelines for skyblock-fi

## Commands
- **Build**: `bun run build`
- **Lint**: `bun run lint`
- **Format**: `bun run format`
- **Dev**: `bun run dev`
- **Test**: No test framework configured

## Code Style
- **Language**: TypeScript with strict mode enabled
- **Formatting**: Biome (2-space indentation, recommended rules)
- **Imports**: Use `@/` path aliases, organize imports automatically
- **Components**: Use `React.ComponentProps` + custom interfaces for props
- **Styling**: Tailwind CSS with `cn()` utility (clsx + tailwind-merge)
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Error Handling**: Try/catch blocks, console.error logging, NextResponse.json for APIs
- **Types**: Explicit interfaces for component props, avoid `any`
