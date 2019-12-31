import Module from '../../global/js/module';

export default class Hello extends Module {
  static getBaseSelector() {
    return '.hello';
  }
}

Hello.initializeAll();
