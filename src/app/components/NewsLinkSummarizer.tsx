import { useState } from 'react'

export default function NewsLinkSummarizer() {
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })
      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-2/4 mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Resumo AI</h1>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <label htmlFor="originalTitle" className="block mb-2">
          Cole o link da notícia:
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole aqui..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Resumindo...' : 'Resumir'}
        </button>
      </form>
      {summary && (
        <div className="mt-6 p-4 bg-base-100 rounded-lg shadow-md w-full">
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  )
}
