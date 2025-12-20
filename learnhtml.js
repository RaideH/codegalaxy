let links = [
`HTML Editors`,
`HTML Basic`,
`HTML Elements`,
`HTML Attributes`,
`HTML Headings`,
`HTML Paragraphs`,
`HTML Styles`,
`HTML Formatting`,
`HTML Quotations`,
`HTML Comments`,
`HTML Colors`,
`HTML CSS`,
`HTML Links`,
`HTML Images`,
`HTML Favicon`,
`HTML Page Title`,
`HTML Tables`,
`HTML Lists`,
`HTML Block & Inline`,
`HTML Div`,
`HTML Classes`,
`HTML Id`,
`HTML Iframes`,
`HTML JavaScript`,
`HTML File Paths`,
`HTML Head`,
`HTML Layout`,
`HTML Responsive`,
`HTML Computercode`,
`HTML Semantics`,
`HTML Style Guide`,

]

const content = document.getElementById('content');


const fragment = document.createDocumentFragment();

// 2. Используй 'let i' для правильного объявления переменной в цикле
for(let i = 0; i < links.length; i++) {
    let link = document.createElement('a');
  let br = document.createElement('br');
    link.href = '#';
    link.className = 'lesson-link';
    link.innerText = links[i];
    
    // 3. Добавляем все ссылки во "фрагмент", а не на страницу
    fragment.append(link , br); 
}

// 4. Добавляем "фрагмент" со всеми ссылками на страницу ОДИН РАЗ
content.append(fragment);