import hljs from 'highlight.js';

function highlight(code, language) {
  if (language && hljs.getLanguage(language)) {
    return hljs.highlight(code, { language }).value;
  }

  return '';
}

export default highlight;
