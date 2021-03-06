let funcs = {
  ctxRender () {
    this.clover.drawClover()
  },

  listenEvent () {
    if (!dataBus.touchStartPoint) { return false }

    if (this.clover.playButton.isCollideWith(
      dataBus.touchStartPoint.pageX || 0,
      dataBus.touchStartPoint.pageY - screenHeight || 0)) { dataBus.gameStatus = 'playing' }

    if (this.clover.rankingButton.isCollideWith(
      dataBus.touchStartPoint.pageX || 0,
      dataBus.touchStartPoint.pageY - screenHeight || 0)) { dataBus.gameStatus = 'show_rank' }

    dataBus.touchStartPoint = {}
  }
}

export default function () {
  funcs.ctxRender.call(this)

  funcs.listenEvent.call(this)
}
