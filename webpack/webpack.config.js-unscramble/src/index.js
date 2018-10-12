import _ from 'lodash';
import './style.css';

  function component() {
    var element = document.createElement('div');

    // lodash 是由当前 script 脚本 import 导入进来的
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
   element.classList.add('hello');

    return element;
  }

  document.body.appendChild(component());