import Sprite from '../interfaces/sprite'
import Animation from '../interfaces/animation'

const iconPath = 'images/score-plus/'

let sprIcon = []
sprIcon[2] = new Sprite({
  imgSrc: `${iconPath}/+2.png`,
  width: 132,
  height: 79,  
})
sprIcon[3] = new Sprite({
  imgSrc: `${iconPath}/+3.png`,
  width: 132,
  height: 79
})
sprIcon[5] = new Sprite({
  imgSrc: `${iconPath}/+5.png`,
  width: 132,
  height: 79
})
sprIcon[4] = new Sprite({
  imgSrc: `${iconPath}/2X2.png`,
  width: 190,
  height: 82
})
sprIcon[6] = new Sprite({
  imgSrc: `${iconPath}/2X3.png`,
  width: 190,
  height: 82
})
sprIcon[10] = new Sprite({
  imgSrc: `${iconPath}/2X5.png`,
  width: 190,
  height: 82
})

export default class ScorePlus {
  constructor (ctx) {
    // 维护ctx
    this.ctx = ctx

    this.sprIcon = sprIcon

    this.num = 0
  }

  /**
   * 绘画指定数目的分数number
   * num 为绘画的数字，ctx为绘画的幕布对象
   */
  drawScoreNumber (num = this.num, ctx = this.ctx) {
    
  }

  drawPlus (type = dataBus.plusShow, isDraw = dataBus.isShowScore) {
    if (!isDraw)
      return false

    this.sprIcon[type].y = -screenHeight / 2 - 50
    this.sprIcon[type].x = screenWidth * .5 - 100
    this.sprIcon[type].draw(this.ctx)
  }
}
