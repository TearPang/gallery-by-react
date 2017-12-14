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
function getRangeRandom(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

//生成正负30度的旋转随机数
function get30Random() {
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30))
}

class ImageFigure extends React.Component {
  /*
  * 处理点击事件
  * */
  handleClick(e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    let styleObj = {};
    //如果具有位置属性，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos
    }
    //如果有旋转角度且不为0，为其添加rotate属性
    if (this.props.arrange.rotate && this.props.arrange.rotate !== 0) {
      (['MozTransform', 'msTransform', 'WebkitTransform', 'OTransform', 'transform']).forEach(function (value) {
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)'
      }.bind(this));
    }
    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }
    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>{/*如果不绑定this，泽handleClick将找不到this*/}
        <img src={this.props.data.imagesUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick.bind(this)}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
}

class ControllerUnit extends React.Component {
  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    return (
      <span className="controller-unit" onClick={this.handleClick}>
      </span>
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
          },
          rotate:0, //旋转角度
          isInverse: false, //是否翻转
          isCenter: false //是否为中心图片
        }*/
      ]
    };
  }

  /*
  * 翻转图片
  * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index 值
  * @return {Function} 这是一个闭包函数，其内return一个真正待被执行的函数
  * */
  inverse(index) {
    return function () {
      let imgArrangeArr = this.state.imgArrangeArr;
      imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;
      this.setState({
        imgArrangeArr: imgArrangeArr
      });
    }.bind(this);
  }

  /*
   * 利用rearrange函数居中对应index的图片
   * @param index 需要被居中显示的index的图片
   * @return {Function}
   * */

  center(index) {
    return function () {
      this.rearrange(index)
    }.bind(this)
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

    //首先居中中心图片,居中图片不需要旋转
    imgArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };
    /*
    * 取出布局在上侧的图片
    * 随机取0或1个图片，所以要计算上侧图片位置时，需要计算数组中还有多少
    * 取出数组时，按照topImgNum进行取出
    * */
    topImgSpliceIndex = Math.floor(Math.random() * (imgArrangeArr.length - topImgNum));
    imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);
    //布局上侧图片
    imgArrangeTopArr.forEach(function (value, index) {
      imgArrangeTopArr[index] = {
        pos: {
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
        },
        rotate: get30Random(),
        isCenter: false
      }
    });
    //布局左右区间的图片
    for (let i = 0, j = imgArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }
      imgArrangeArr[i] = {
        pos: {
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1]),
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1])
        },
        rotate: get30Random(),
        isCenter: false
      }
    }
    //将取出的上侧、中心图片放回imgArrangeArr
    if (imgArrangeTopArr && imgArrangeTopArr[0]) {
      imgArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
    }
    imgArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);
    this.setState({
      imgArrangeArr: imgArrangeArr
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
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImageFigure data={value}
                                   key={'imgFigures' + index}
                                   ref={'imgFigure' + index}
                                   arrange={this.state.imgArrangeArr[index]}
                                   inverse={this.inverse(index)}
                                   center={this.center(index)}/>);
      controllerUnits.push(<ControllerUnit key={index}/>);
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
