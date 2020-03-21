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
        message: 'Title? (Ex. "Cool Page")',
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
        name: 'id',
        message: 'Chunk name?',
        when({ action }) {
          return action === 'createPage';
        },
        default({ title }) {
          return slugify(title.toLowerCase());
        },
      },
      {
        type: 'input',
        name: 'dir',
        message: 'Source dir?',
        when({ action }) {
          return action === 'createPage';
        },
        transformer(dir, answers, flags) {
          if (flags.isFinal) {
            return path.join('src/pages', dir);
          }

          return dir;
        },
        default({ id }) {
          return id;
        },
      },
      {
        type: 'input',
        name: 'filename',
        message: 'Output filename?',
        when({ action }) {
          return action === 'createPage';
        },
        transformer(filename, answers, flags) {
          if (flags.isFinal) {
            return path.join('dist', filename);
          }

          return filename;
        },
        default({ dir }) {
          return path.join(dir, 'index.html');
        },
      },
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Confirm?',
        when({ action }) {
          return action === 'createPage';
        },
      },
    ]);
  }

  writing() {
    if (this.answers.action === 'createPage' && this.answers.confirm) {
      fs.readdirSync(this.templatePath('page')).forEach((template) => {
        const file = template.replace(/(^_|\.ejs$)/g, '');

        this.fs.copyTpl(
          this.templatePath(`page/${template}`),
          this.destinationPath(`pages/${this.answers.dir}/${file}`),
          this.answers,
        );
      });
    }
  }
};
