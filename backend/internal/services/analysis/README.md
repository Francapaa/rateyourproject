# Analysis Context Builder

This directory now has a dedicated context-building stage between extraction and the future Gemini evaluation call.

## Pipeline

1. `extractor_1.go`
   Unzips the uploaded project, filters files, extracts snippets, computes metrics, and builds the file tree.

2. `context_builder_2.go`
   Loads the candidate profile from the database and converts the extracted repository snapshot into a Gemini-ready prompt package.

3. `api_gemini_3.go`
   Consumes the generated prompt package and requests the final evaluation from Gemini.

## Prompt Engineering Goals

- Evaluate the project against the candidate's selected role.
- Evaluate the project against the candidate's selected seniority.
- Ground every conclusion in repository evidence.
- Preserve enough project structure to judge architecture, quality, and maintainability.
- Separate extraction from model invocation so each stage can evolve independently.

## User Profile Inputs

The context builder reads the authenticated user from the database using the Supabase user id carried by the JWT.

Fields used:

- `role`
- `seniority`
- `is_premium`
- `email`

Fallback behavior:

- If the user is missing or has no configured profile, the builder falls back to:
  - `role = generalist`
  - `seniority = mid-level`

## Project Inputs Added To The Prompt

The builder includes all major extraction outputs:

- high-level project summary
- file tree
- language and repository metrics
- key files with snippets
- extracted file metadata
- extracted file snippets

Each extracted file contributes:

- relative path
- extension
- line count
- whether it is code or config
- exported functions when available
- the first 60 lines of content

## Prompt Package Output

The generated context is attached to the analysis result as:

- `prompt_version`
- `user_profile`
- `system_instruction`
- `user_prompt`
- `project_snapshot`

This keeps the future Gemini client simple: it can take the generated context and send it directly to the model.

## Gemini API

The backend now calls the official Gemini `generateContent` REST endpoint with structured JSON output.

Environment variables:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`

Fallbacks accepted by the current config:

- `GOOGLE_API_KEY`
- `OPEN_AI_API_KEY`

Default model:

- `gemini-2.5-flash`

## Design Notes

- Extraction remains deterministic and model-agnostic.
- Context building is where product logic enters: role, seniority, and prompt framing.
- The current snapshot intentionally includes a large amount of repository detail for correctness. If token pressure becomes a problem later, this stage is where truncation and ranking should be introduced.

## Gemini Output Contract

The Gemini structured response returns:

- `overall_score`
- `dimensions`
- `analysis`
- `strengths`
- `weaknesses`
- `recommendations`
- `uncertainty_notes`
