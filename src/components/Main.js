require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';

//获取图片相关路径信息
let imagesData = require('../data/imageDatas.json');
//将图片路径信息转化为真实地址
imagesData = (function genImageURL(imageDatasArr){
  for(let i = 0; i < imageDatasArr.length; i++){
    let singleImageData = imageDatasArr[i];
    singleImageData.imagesUrl = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imagesData);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">

        </section>
        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
