// app/library/page.tsx

export default async function LibraryPage() {
  // This page will stay cached for 3600 seconds (1 hour)
  // Even if 1,000 users visit, the DB is only hit once per hour
  const response = await fetch('https://your-api.com/api/books', { 
    next: { revalidate: 3600 } 
  });
  const books = await response.json();

  return (
    <div>{/* Render books */}</div>
  );
}