'use client'

import { useState } from 'react'

interface TitleResponse {
  newTitle: string
  error?: string
}

export default function NewsTitleRewriter() {
  const [originalTitle, setOriginalTitle] = useState<string>('')
  const [newTitle, setNewTitle] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!originalTitle?.toString().trim()) {
      setNewTitle('Por favor insira um título ou subtítulo')
      return
    }
    setLoading(true)

    try {
      const response = await fetch('/api/rewrite-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalTitle: originalTitle.toString() }),
      })

      const data: TitleResponse = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setNewTitle(data.newTitle)
    } catch (error) {
      console.error('Erro ao reescrever título:', error)
      setNewTitle('Falha ao gerar novo título. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-2/4 mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Título AI</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="originalTitle" className="block mb-2">
            Cole o título ou subtítulo original:
          </label>
          <textarea
            id="originalTitle"
            value={originalTitle}
            onChange={(e) => setOriginalTitle(e.target.value)}
            className="w-full p-2 rounded bg-base-100 min-h-[100px]"
            placeholder="Cole aqui..."
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Reescrevendo Título...' : 'Reescrever Título'}
        </button>
      </form>

      {newTitle && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Novo Título:</h2>
          <div className="bg-base-100 w-full p-4 rounded">{newTitle}</div>
        </div>
      )}
    </div>
  )
}
