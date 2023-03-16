import hljs from 'highlight.js';

const highlight = (code, language) => {
  if (language && hljs.getLanguage(language)) {
    try {
      const { value } = hljs.highlight(code, {
        language,
      });

      return value;
    } catch (err) {
      throw (err);
    }
  }

  return '';
};

export default highlight;
