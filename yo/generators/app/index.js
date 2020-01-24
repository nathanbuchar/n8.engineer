const Generator = require('yeoman-generator');

const figlet = require('figlet');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

module.exports = class extends Generator {
  constructor(...args) {
    super(...args);

    // Display welcome message.
    // eslint-disable-next-line no-console
    console.log(`\n\n${figlet.textSync('Yo Nate!', { font: 'Slant' })}\n`);

    this.destinationRoot(path.join(__dirname, '../../../src'));
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          {
            name: 'Create a new page',
            short: 'Create page',
            value: 'createPage',
          },
          {
            name: 'Exit',
            value: 'exit',
          },
        ],
      },
      {
        type: 'input',
        name: 'title',
        message: 'Name? (Ex. "Cool Page")',
        when({ action }) {
          return action === 'createPage';
        },
        validate(str) {
          if (str.length === 0) {
            return 'Your page needs a name!';
          }

          return true;
        },
      },
      {
        type: 'input',
        name: 'slug',
        message: 'Slug?',
        when({ action }) {
          return action === 'createPage';
        },
        default({ title }) {
          return slugify(title.toLowerCase());
        },
        validate(str) {
          return str.length > 0;
        },
      },
      {
        type: 'input',
        name: 'filename',
        message: 'Output filename?',
        when({ action }) {
          return action === 'createPage';
        },
        default({ slug }) {
          return `/${slug}/index.html`;
        },
      },
    ]);
  }

  writing() {
    if (this.answers.action === 'createPage') {
      fs.readdirSync(this.templatePath('page')).forEach((template) => {
        const filename = template.replace(/(^_|\.ejs$)/g, '');

        this.fs.copyTpl(
          this.templatePath(`page/${template}`),
          this.destinationPath(`pages/${this.answers.slug}/${filename}`),
          this.answers,
        );
      });
    }
  }
};
