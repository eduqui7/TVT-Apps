import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: Request) {
  const { url } = await request.json();
  
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  await page.goto(url);

  const posts = await page.evaluate(async () => {
    await new Promise((resolve) => {
      const distance = 100;
      let scrolledAmount = 0;

      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        scrolledAmount += distance;

        if (scrolledAmount >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve(void 0);
        }
      }, 100);
    });

    // Extract the news title, featured image, and link
    const articles = document.querySelectorAll('.elementor-post');
    return Array.from(articles).map((article) => {
      const title = article.querySelector('.elementor-post__title')?.textContent?.trim() || '';
      const imageUrl = article.querySelector(".elementor-post__thumbnail__link img")?.getAttribute("src") || '';
      const link = article.querySelector('.elementor-post__thumbnail__link')?.getAttribute('href') || '';
      
      return {
        title,
        imageUrl,
        link
      };
    });
  });

  await browser.close();
  
  return NextResponse.json(posts);
}