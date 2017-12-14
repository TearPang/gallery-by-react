require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';
import ReactDOM from 'react-dom';
//获取图片相关路径信息
let imagesData = require('../data/imageDatas.json');
//将图片路径信息转化为真实地址
imagesData = (function genImageURL(imageDatasArr) {
  for (let i = 0; i < imageDatasArr.length; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imagesUrl = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imagesData);

//生成区间内的随机数
function getRangeRandom(low,high){
  return Math.floor(Math.random() * (high - low) + low);
}

class ImageFigure extends React.Component {
  render() {
    let styleObj = {};
    //如果具有位置属性，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos
    }
    return (
      <figure className="img-figure" style={styleObj}>
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
  constructor(props) {
    super(props);
    this.state = {
      //区域位置
      Constant: {
        centerPos: {//中心点的位置
          left: 0,
          top: 0
        },
        hPosRange: {//水平左右两侧区域的取值范围
          leftSecX: [0, 0],
          rightSecX: [0, 0],
          y: [0, 0]
        },
        vPosRange: {//上侧区域的取值范围
          x: [0, 0],
          topY: [0, 0]
        }
      },
      //存储每张图片的位置
      imgArrangeArr: [
        /*{
          pos:{
            left:0,
            top:0
          }
        }*/
      ]
    };
  }

  /*
  * 重新定位图片位置
  * @param centerIndex 指定居中图片
  * */
  rearrange(centerIndex) {
    let imgArrangeArr = this.state.imgArrangeArr,
      Constant = this.state.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeX = vPosRange.x,
      vPosRangeTopY = vPosRange.topY,
      //上侧区域初始化
      imgArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),
      topImgSpliceIndex = 0,
      //中心图片
      imgArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);

      //首先居中中心图片
      imgArrangeCenterArr[0].pos = {
        left: centerPos.left,
        top: centerPos.top
      };
      /*
      * 取出布局在上侧的图片
      * 随机取0或1个图片，所以要计算上侧图片位置时，需要计算数组中还有多少
      * 取出数组时，按照topImgNum进行取出
      * */
      topImgSpliceIndex = Math.floor(Math.random() * (imgArrangeArr.length - topImgNum));
      imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex,topImgNum);
      //布局上侧图片
      imgArrangeTopArr.forEach(function (value,index) {
        imgArrangeTopArr[index].pos = {
          left:getRangeRandom(vPosRangeX[0],vPosRangeX[1]),
          top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1])
        }
      });
      //布局左右区间的图片
      for(let i = 0, j = imgArrangeArr.length, k = j / 2; i < j; i++){
        let hPosRangeLORX = null;
        if(i < k){
          hPosRangeLORX = hPosRangeLeftSecX;
        }else{
          hPosRangeLORX = hPosRangeRightSecX;
        }
        imgArrangeArr[i].pos = {
          left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
          top:getRangeRandom(hPosRangeY[0],hPosRangeY[1])
        }
      }
      //将取出的上侧、中心图片放回imgArrangeArr
      if(imgArrangeTopArr && imgArrangeTopArr[0]){
        imgArrangeArr.splice(topImgSpliceIndex,0,imgArrangeTopArr[0]);
      }
      imgArrangeArr.splice(centerIndex,0,imgArrangeCenterArr[0]);
      this.setState({
        imgArrangeArr:imgArrangeArr
      });
  }

  //组件加载以后，为每张图片计算其位置d额范围
  componentDidMount() {
    //首先拿到舞台大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.floor(stageW / 2),
      halfStageH = Math.floor(stageH / 2);
    //拿到imgFigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.floor(imgW / 2),
      halfImgH = Math.floor(imgH / 2);
    //计算中心图片的位置点
    this.state.Constant.centerPos.left = halfStageW - halfImgW;
    this.state.Constant.centerPos.top = halfStageH - halfImgH;
    //计算水平方向
    this.state.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.state.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.state.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.state.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.state.Constant.hPosRange.y[0] = -halfImgH;
    this.state.Constant.hPosRange.y[1] = stageH - halfImgH;
    //计算上侧方向
    this.state.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.state.Constant.vPosRange.x[1] = halfStageW;
    this.state.Constant.vPosRange.topY[0] = -halfImgH;
    this.state.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.rearrange(0);

  }

  render() {
    let controllerUnits = [],
      imgFigures = [];
    imagesData.forEach(function (value, index) {
      //如果没有初始化图片位置，则给图片位置初始化
      if (!this.state.imgArrangeArr[index]) {
        this.state.imgArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          }
        }
      }
      imgFigures.push(<ImageFigure data={value} key={'imgFigures' + index} ref={'imgFigure' + index}
                      arrange={this.state.imgArrangeArr[index]}/>);
    }.bind(this));
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

AppComponent.defaultProps = {};

export default AppComponent;
