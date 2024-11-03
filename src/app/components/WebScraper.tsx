'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';

interface NewsItem {
  title: string;
  imageUrl: string;
  link: string;
}

interface ScrapingResult {
  data: NewsItem[] | null;
  status: 'idle' | 'loading' | 'success' | 'error';
}

export default function WebScraper() {
  const [result, setResult] = useState<ScrapingResult>({
    data: null,
    status: 'idle'
  });

  const exportToXLSX = () => {
    if (!result.data) return;
    
    const worksheet = XLSX.utils.json_to_sheet(
      result.data.map(news => ({
        'Título': news.title,
        'URL da Imagem': news.imageUrl
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Notícias');
    
    XLSX.writeFile(workbook, 'noticias-tvt.xlsx');
  };

  const scrapeWebsite = async () => {
    try {
      setResult({ data: null, status: 'loading' });
      
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: 'https://tvtnews.com.br/ultimas-noticias/' }),
      });
      
      const data = await response.json();
      
      const filteredData = data
        .filter((item: NewsItem) => item.imageUrl)
        .slice(0, 10);
      
      setResult({
        data: filteredData,
        status: 'success'
      });
    } catch (error) {
      setResult({
        data: null,
        status: 'error'
      });
    }
  };

  return (
    <div className="p-4 rounded-lg bg-background">
      <h2 className="text-xl font-bold mb-4">TVT News - Últimas Notícias</h2>
      <div className="flex gap-2 mb-6">
        <button 
          onClick={scrapeWebsite}
          className="btn btn-primary"
        >
          Gerar
        </button>
        {result.data && (
          <button 
            onClick={exportToXLSX}
            className="btn btn-secondary"
          >
            Exportar XLSX
          </button>
        )}
      </div>
      
      <div className="mt-4">
        {result.status === 'loading' && (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
        
        {result.status === 'success' && result.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {result.data.map((news, index) => (
              <div key={index} className="card bg-base-100 shadow-xl h-full">
                <figure>
                  <img 
                    src={news.imageUrl} 
                    alt={news.title}
                    className="h-40 w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-sm">{news.title}</h3>
                  <div className="card-actions justify-end mt-auto">
                    <a 
                      href={news.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Leia Mais
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {result.status === 'error' && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Erro ao trazer as notícias</span>
          </div>
        )}
      </div>
    </div>
  );
}
