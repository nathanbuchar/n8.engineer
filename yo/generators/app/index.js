const figlet = require('figlet');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(...args) {
    super(...args);

    // Display welcome message.
    console.log(`\n\n${figlet.textSync('Yo Nate!', { font: 'Slant' })}\n`);

    this.destinationRoot(path.join(__dirname, '../../../src'));
  }

  async promptingAction() {
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
          return str.length > 0;
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
        this.fs.copyTpl(
          this.templatePath(`page/${template}`),
          this.destinationPath(`pages/${this.answers.slug}/${template.replace(/(^_|\.ejs$)/g, '')}`),
          this.answers,
        );
      });
    }
  }
};
