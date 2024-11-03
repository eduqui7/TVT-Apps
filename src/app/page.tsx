'use client'
import { useState } from 'react'
import MenuVert from "./components/menuVert"
import NavBar from "./components/navBar"
import NewsLinkSummarizer from "./components/NewsLinkSummarizer"
import Welcome from "./components/welcome"
import NewsTitleRewriter from "./components/NewsTitleRewriter"
import InstagramEmbed from './components/InstagramEmbed'
import XEmbed from './components/XEmbed'
import WebScraper from './components/WebScraper'
import WeatherCard from './components/WeatherCard'


export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState('welcome')

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'welcome':
        return <Welcome />
      case 'resumo':
        return <NewsLinkSummarizer />
      case 'rewrite':
        return <NewsTitleRewriter />
      case 'instaEmb':
        return <InstagramEmbed />
      case 'xEmb':
        return <XEmbed />
      case 'scrap':
        return <WebScraper />
      case 'temp':
        return <WeatherCard />
      default:
        return <Welcome />
    }
  }
  return (
    <>
      <NavBar />
      <div className="flex">
        <div className="flex mt-3">
          <MenuVert setSelectedComponent={setSelectedComponent} />
        </div>
        <div className="mockup-window bg-base-300 mt-3 ml-3 mr-3 w-screen h-fit">
          <div className="bg-base-200 flex justify-center px-2 py-2">
            {renderComponent()}
          </div>
        </div>
      </div>
    </>
  )
}
