import _ from 'lodash';
import style from './style.css';
import img from './image/img.jfif'


  function component() {
    console.log(style)
    var element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack', 'not','为什么这么慢', '再应该快了点'], ' ');
    element.classList.add(style.hello);

   var myIcon = new Image();
   myIcon.src = img;

   element.appendChild(myIcon);

    return element;
  }

  document.body.appendChild(component());