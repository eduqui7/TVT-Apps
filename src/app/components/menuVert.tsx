export default function MenuVert({ setSelectedComponent }: { setSelectedComponent: (component: string) => void }) {
    return (
        <ul className="menu bg-base-200 rounded-box w-56">
            <li><a onClick={() => setSelectedComponent('welcome')}>Home</a></li>
            <li>
                <details open>
                    <summary>Dados</summary>
                    <ul>
                        <li><a onClick={() => setSelectedComponent('scrap')}>Gerar News</a></li>
                        <li><a onClick={() => setSelectedComponent('open')}>Gerar Tempo</a></li>
                    </ul>
                </details>
                <details open>
                    <summary>Recursos para PGMs</summary>
                    <ul>
                        <li><a onClick={() => setSelectedComponent('xEmb')}>Gerar Card Twitter</a></li>
                        <li><a onClick={() => setSelectedComponent('instaEmb')}>Gerar Card Instagram</a></li>
                        <li><a onClick={() => setSelectedComponent('resumo')}>Resumo AI</a></li>
                        <li><a onClick={() => setSelectedComponent('rewrite')}>Título AI</a></li>
                    </ul>
                </details>
            </li>
        </ul>
    );
}