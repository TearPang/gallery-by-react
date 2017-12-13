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

class ImageFigure extends React.Component {
  render(){
    return(
      <figure className="img-figure">
        <img src={this.props.data.imagesUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}

class AppComponent extends React.Component {
  render() {
    let controllerUnits = [],
      imgFigures = [];
    imagesData.forEach(function (value,index) {
      imgFigures.push(<ImageFigure data={value} key={'imgFigures'+index}/>);
    });
    return (
      <section className="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
