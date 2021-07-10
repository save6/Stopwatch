class BackStopWatch {
  constructor() {
    this.statuses = {
      running: new RunningStatus(this),
      stop: new StopStatus(this),
      pause: new PauseStatus(this)
    }
    this.count = 0
    this.currentLap = 0
    this.lastLap = 0
    this.state = this.statuses.stop
    this.runningFlag = false
  }

  run() {
    this.state = this.statuses.running
    this.runningFlag = true
    this.timer = setInterval(() => {
      this.count++;
    }, 1000);
  }

  lap() {
    this.currentLap = this.count - this.lastLap;
    this.lastLap = this.count;
  }

  pause() {
    clearInterval(this.timer);
    this.state = this.statuses.pause
    this.runningFlag = false
  }

  reset() {
    this.count = 0
    this.lastLap = 0
    this.currentLap = 0
    this.state = this.statuses.stop
    this.runningFlag = false
  }
}

class StopStatus {
  constructor(app) {
    this.app = app
  }

  setup(frontWatch){
    frontWatch.state = frontWatch.statuses.stop
    frontWatch.count = 0
    frontWatch.lastLap = 0
    frontWatch.currentLap = 0
    frontWatch.nortify('reset')
  }
}

class RunningStatus {
  constructor(app) {
    this.app = app
  }

  setup(frontWatch){
    frontWatch.state = frontWatch.statuses.running
    frontWatch.count = this.app.count
    frontWatch.lastLap = this.app.lastLap
    frontWatch.currentLap = this.app.currentLap
    frontWatch.nortify('run')
  }
}

class PauseStatus {
  constructor(app) {
    this.app = app
  }

  setup(frontWatch){
    frontWatch.state = frontWatch.statuses.pause
    frontWatch.count = this.app.count
    frontWatch.lastLap = this.app.lastLap
    frontWatch.currentLap = this.app.currentLap
    frontWatch.nortify('pause')
  }
}

var sw = new BackStopWatch();

function getBackStopWatch(){
  return sw;
}