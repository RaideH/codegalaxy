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


const fragment = document.createElement('ol');

for(let i = 0; i < links.length; i++) {
    let link = document.createElement('li');
    link.innerText = links[i];
    
    fragment.append(link); 
}

content.appendchild(fragment);