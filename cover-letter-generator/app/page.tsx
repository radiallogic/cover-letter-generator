// app/page.tsx
"use client";

import { useState } from "react";

export default function HomePage() {
  const [roleTitle, setRoleTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("professional but friendly");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCoverLetter("");

    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roleTitle,
          companyName,
          jobDescription,
          tone,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Request failed");
      }

      const data = await res.json();
      setCoverLetter(data.coverLetter);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Cover Letter Generator</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Role title
          </label>
          <input
            className="border rounded-md w-full px-3 py-2 text-sm"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            placeholder="Senior Software Engineer"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Company name
          </label>
          <input
            className="border rounded-md w-full px-3 py-2 text-sm"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Goodstack"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tone
          </label>
          <select
            className="border rounded-md w-full px-3 py-2 text-sm"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="professional but friendly">
              Professional but friendly
            </option>
            <option value="concise and direct">Concise and direct</option>
            <option value="enthusiastic and energetic">
              Enthusiastic and energetic
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Job description
          </label>
          <textarea
            className="border rounded-md w-full px-3 py-2 text-sm min-h-[180px]"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md border text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate cover letter"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">Error: {error}</p>}

      {coverLetter && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Generated cover letter</h2>
          <pre className="whitespace-pre-wrap border rounded-md p-4 text-sm bg-gray-50 text-black">
            {coverLetter}
          </pre>
        </section>
      )}
    </main>
  );
}
