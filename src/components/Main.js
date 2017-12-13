require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';
import ReactDOM from 'react-dom';
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
  //位置初始化
  Constant:{
    centerPos:{//中心点的位置
      left: 0,
      right: 0
    },
    hPosRange:{//水平方向的取值范围
      leftSecX: [0,0],
      rightSecX: [0,0],
      y: [0,0]
    },
    vPosRange:{//垂直方向的取值范围
      x: [0,0],
      topY: [0,0]
    }
  };
  //组件加载以后，为每张图片计算其位置d额范围
  componentDidMount(){
    //首先拿到舞台大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollHeight,
      stageH = stageDOM.scrollWidth,
      halfStageW = Math.ceil(stageW/2),
      halfStageH = Math.ceil(stageH/2);
    //拿到imgFigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW/2),
      halfImgH = Math.ceil(imgH/2);
    //计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      right: halfStageH - halfImgH
    };
    //计算水平方向
    this.Constant.hPosRange.leftSecX[0] =  -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW-halfImgW*3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW+halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW-halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[0] = stageH-halfImgH;

    //垂直方向的取值范围
    this.Constant.vPosRange.x[0] = 0;
    this.Constant.vPosRange.x[1] = 0;
    this.Constant.vPosRange.topY[0] = 0;
    this.Constant.vPosRange.topY[1] = 0;
  }
  render(){
    console.log(this.Constant);
    let controllerUnits = [],
      imgFigures = [];
    imagesData.forEach(function (value,index) {
      imgFigures.push(<ImageFigure data={value} key={'imgFigures'+index} ref={'imgFigure' + index}/>);
    });
    return (
      <section className="stage" ref="stage">
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
