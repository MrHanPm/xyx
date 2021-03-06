import getLastOne from '../libs/get-last-one'
import { boxHeight, boxWidth } from '../sprites/boxes'
import { changeCanDown } from '../runtime/update'

let fixDenoFlag = false
let msFlag = false
let exFlag = false
let hourglassFlag = false
let sightFlag = false

let funcs = {
  // 两层ctx的绘画函数
  // 指游戏过程中
  ctxAssociateRender () {
    this.background.render()
    this.boxes.drawBoxes()
    this.water.drawWater()
    if (dataBus.isShowSight) this.sight.drawSightLine()
    // this.light.drawLight()
  },

  ctxRender () {
    this.fixProgress.drawFixProgress()
    this.score.drawScoreNumber()
    this.sight.drawSight()
    this.hourglass.drawHourglass()
    this.pause.drawPauseButton()
    this.scorePlus.drawPlus()
  },

  listenEvent () {
    if (!dataBus.touchStartPoint) return false

    // 因为原图是全屏的，容易误点
    // 所以此处自定义了一个area
    if (dataBus.isPaused &&
         dataBus.touchStartPoint.pageX >= screenWidth * 0.3 &&
         dataBus.touchStartPoint.pageX <= screenWidth * 0.7 &&
         -dataBus.touchStartPoint.pageY + screenHeight >= screenHeight * 0.3 &&
         -dataBus.touchStartPoint.pageY + screenHeight <= screenHeight * 0.7) {
      dataBus.isPaused = false
      dataBus.touchStartPoint = {}
    }

    if (dataBus.isPaused)
      return void 0
      
    if (this.pause.runningIcon.isCollideWith(
      dataBus.touchStartPoint.pageX || 0,
      dataBus.touchStartPoint.pageY - screenHeight || 0)) {
        dataBus.isPaused = true
        dataBus.touchStartPoint = {}
    }

    
    if (this.sight.iconLight.isCollideWith(
      dataBus.touchStartPoint.pageX || 0,
      dataBus.touchStartPoint.pageY - screenHeight || 0)) {
        if (dataBus.sightNumber === 0) return false
        if (sightFlag === false) {
          sightFlag = true
          dataBus.sightNumber--
          dataBus.isShowSight = true
          socket.pushItem('1')
          setTimeout(() => {
            sightFlag = false
            dataBus.isShowSight = false
          }, 5000)
        }
        dataBus.touchStartPoint = {}
    }

    if (this.hourglass.iconLight.isCollideWith(
      dataBus.touchStartPoint.pageX || 0,
      dataBus.touchStartPoint.pageY - screenHeight || 0)) {
        if (dataBus.hourglassNumber === 0) return false
        if (hourglassFlag === false) {
          hourglassFlag = true
          dataBus.hourglassNumber--        
          socket.pushItem('2')
          dataBus.isShowHourglass = true
          setTimeout(() => {
            hourglassFlag = false
            dataBus.isShowHourglass = false
          }, 5000)
        }
        dataBus.touchStartPoint = {}
    }

    if (dataBus.touchStartPoint.pageX && dataBus.boxList.length) {
      dataBus.boxList[dataBus.boxList.length - 1].isDown = true
      if (fixDenoFlag === false) {
        changeCanDown(false)
        setTimeout(() => {
          dataBus.fixNumerator++
          fixDenoFlag = false
          changeCanDown(true)
        }, 600)
        fixDenoFlag = true
      }
    }

    dataBus.touchStartPoint = {}
  },

  missionFall () {
    dataBus.boxList.forEach(el => {
      dataBus.isStoped = true
      if (msFlag === false) {
        msFlag = true
        setTimeout(() => {
          msFlag = false
          dataBus.boxList.length = 0
          dataBus.height = 0
          dataBus.fixNumerator = 0
          dataBus.gameStatus = 'show_score'
          console.log('123')
          socket.pushScore()
          wx.setUserCloudStorage({
            KVDataList: [{
              key: 'all',
              value: JSON.stringify({
                sightNumber: dataBus.sightNumber,
                hourglassNumber: dataBus.hourglassNumber,
                score: Math.max(dataBus.userData.highestScore, dataBus.score)
              })
            }]
          })
          // score及时更新
          if (dataBus.score > dataBus.userData.highestScore)
            dataBus.userData.highestScore = dataBus.score
        }, 1000)
      }
    })
  },

  excllent () {
    if (exFlag === false) {
      exFlag = true
      dataBus.isShowScore = true
      dataBus.plusShow = dataBus.boxList[dataBus.boxList.length - 1].type * 2
      console.log('fdsafasdfdasfdsdas')
      setTimeout(() => {
        exFlag = false
        dataBus.isShowScore = false
      }, 1000)
    }
  }
}
// 事件处理函数
// 监听出现在该页面的诸如使用道具，满槽修正之类的事件
let eventFuncs = {
  fixFill () {
    if (fixFillControl) {
      let length = dataBus.boxList.length,
        index = length - 10 >= 0
          ? length - 10
          : 0
      for (; index < length - 1; index++) {
        if (dataBus.boxList[index].x >= 3) {
          dataBus.boxList[index].x -= 3
        } else if (dataBus.boxList[index].x <= -3) {
          dataBus.boxList[index].x += 3
        } else {
          dataBus.boxList[index].x = 0
        }
      }
      if (dataBus.boxList.some((el, index) => el.x === 0)) {
        setTimeout(() => fixFillControl = false, 1000)
      }
    }
  }
}

// 使用这个的原因是为了实现一个动画效果
// 因为我的animation类，每次绑定只能绑定一个值
// 诸如此类的要绑定一个数组的，就不方便了
let fixFillControl = false

export default function () {
  funcs.ctxAssociateRender.call(this)

  // if (dataBus.gameControl.isNeedRefreshPlaying)
  funcs.ctxRender.call(this)

  // 修正条的函数
  if (dataBus.fixNumerator >= dataBus.fixDenominator && fixFillControl === false) {
    fixFillControl = true
    dataBus.boxPoint = 0
    dataBus.fixNumerator = 0
  }
  eventFuncs.fixFill.call(this)

  let compareX = dataBus.boxList[dataBus.boxList.length - 2]
    ? dataBus.boxList[dataBus.boxList.length - 2].x
    : 0
  if (getLastOne(dataBus.boxList) &&
     getLastOne(dataBus.boxList).isDowned &&
     (getLastOne(dataBus.boxList).x < compareX - (boxWidth / 2) ||
         getLastOne(dataBus.boxList).x > compareX + (boxWidth / 2)) &&
     dataBus.gameStatus === 'playing') {
    funcs.missionFall.call(this)
  }
  else if ( getLastOne(dataBus.boxList) &&
            getLastOne(dataBus.boxList).isDowned &&
            getLastOne(dataBus.boxList).x > compareX - (boxWidth / 4) &&
            getLastOne(dataBus.boxList).x < compareX + (boxWidth / 4) &&
            dataBus.gameStatus === 'playing' ) {
    funcs.excllent.call(this)
  }
  
  funcs.listenEvent.call(this)
}
