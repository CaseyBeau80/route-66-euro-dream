

## Plan: Create `public/llms.txt`

Create a single static file at `public/llms.txt` containing the site description content the user provided at the top of this conversation (the Ramble 66 markdown overview). This file will be served at `ramble66.com/llms.txt` for AI crawlers.

### Content
The exact markdown content provided by the user, starting with `# Ramble 66` and ending with the About section.

### Technical Details
- **File**: `public/llms.txt` (new file)
- Single file creation, no other changes needed
- Vite serves files in `public/` as static assets at the root path

