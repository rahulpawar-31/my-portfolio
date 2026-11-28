export const featureExplanations = {
  projects: {
    title: "How the project gallery works",
    description: "From stored project data to the cards you see here.",
    steps: [
      { title: "Read from the database", description: "A Next.js Server Component uses Prisma to load project names, descriptions, technologies, and links from PostgreSQL." },
      { title: "Render on the server", description: "Project cards arrive as rendered HTML. The browser does not need database credentials or a separate request to build this gallery." },
      { title: "Keep the homepage fresh", description: "The homepage is configured to revalidate every five minutes, allowing cached content to be refreshed without rebuilding the entire site." },
    ],
    source: "src/components/Project.jsx",
    sourceLabel: "Read the project gallery code",
  },
  contact: {
    title: "How the contact form works",
    description: "Follow a message from your browser to my inbox.",
    steps: [
      { title: "Validate the message", description: "The form sends JSON to a Next.js API route. The server checks required fields and email format, cleans the text, and applies a message limit and a hidden spam trap." },
      { title: "Save before sending", description: "Prisma saves the message in PostgreSQL before email delivery is attempted. If saving fails, the form returns an error so you can try again." },
      { title: "Deliver an email notification", description: "Resend sends a notification with your address as the reply-to. If email delivery fails, the saved message remains available in the database." },
    ],
    source: "src/app/api/contact/route.js",
    sourceLabel: "Read the contact handler",
  },
  activity: {
    title: "How the GitHub activity graph works",
    description: "A contribution calendar that adapts to this portfolio.",
    steps: [
      { title: "Load contribution history", description: "The react-github-calendar component loads the public contribution calendar for my GitHub account after the page mounts in your browser." },
      { title: "Match your theme", description: "The graph reads the resolved light or dark theme and uses a matching yellow color palette." },
      { title: "Refresh while you browse", description: "Every five minutes, the calendar remounts to request fresh contribution data. Contributions can still take time to appear on GitHub." },
    ],
    source: "src/components/GitHubActivity.jsx",
    sourceLabel: "Read the activity graph code",
  },
  readme: {
    title: "How project documentation gets here",
    description: "The project page connects this portfolio to its source repository.",
    steps: [
      { title: "Look up the project", description: "The server finds the project by its URL slug in PostgreSQL and uses its name and description for page metadata." },
      { title: "Fetch the repository README", description: "The server requests the README from GitHub, decodes it, and configures the response to revalidate after an hour." },
      { title: "Render readable documentation", description: "Setup, environment-variable, and author sections are filtered out. React Markdown renders the remaining documentation with tables and code blocks." },
    ],
    source: "src/app/projects/[slug]/page.jsx",
    sourceLabel: "Read the project page code",
  },
  views: {
    title: "How project views are counted",
    description: "A small example of browser, API, and database working together.",
    steps: [
      { title: "Register a page visit", description: "When the view counter mounts, it sends a POST request to the project's view API." },
      { title: "Limit repeat counts", description: "An in-memory server check limits repeat counts for the same IP address and project within an hour. This check is local to each running server instance." },
      { title: "Update the stored count", description: "Prisma increments the counter in PostgreSQL and the API returns the total. The browser displays that result beside the project title." },
    ],
    source: "src/app/api/projects/[slug]/view/route.js",
    sourceLabel: "Read the view counter API",
  },
};
