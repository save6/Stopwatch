class StopWatch {
    setup (view) {
      this.statuses = {
        running: new RunningStatus(this),
        stop: new StopStatus(this),
        pause: new PauseStatus(this)
      }
      this.view = view
      this.bsw = chrome.extension.getBackgroundPage().getBackStopWatch();
      this.bsw.state.setup(this);
      //setIntervalが上記setupの中に入れると止まらなくなるためrunningFlagを作って別出し
      if(this.bsw.runningFlag){
        this.timer = setInterval(() => {
            this.count++;
            this.nortify('countUp');
        }, 1000);
      }
    }
  
    clickedMainButton() {
      this.state.clickedMainButton()
    }
  
    clickedSubButton() {
      this.state.clickedSubButton()
    }
  
    run() {
      this.bsw.run();
      this.state = this.statuses.running
      this.nortify('run')
      this.timer = setInterval(() => {
        this.count++;
        this.nortify('countUp');
      }, 1000);
    }
  
    lap() {
      this.bsw.lap();
      this.currentLap = this.count - this.lastLap;
      this.lastLap = this.count;
      this.nortify('lap')
    }
  
    pause() {
      this.bsw.pause();
      clearInterval(this.timer);
      this.state = this.statuses.pause
      this.nortify('pause')
    }
  
    reset() {
      this.bsw.reset();
      this.count = 0
      this.lastLap = 0
      this.currentLap = 0
      this.state = this.statuses.stop
      this.nortify('reset')
    }
  
    nortify(event) {
      this.view.update(event)
    }
  }
  
  class StopStatus {
    constructor(app) {
      this.app = app
      this.test = "stop"
    }
  
    clickedMainButton() {
      this.app.run()
    }
  
    clickedSubButton() { }
  }
  
  class RunningStatus {
    constructor(app) {
      this.app = app
      this.test = "running"
    }
  
    clickedMainButton() {
      this.app.pause()
    }
  
    clickedSubButton() {
      this.app.lap()
    }
  }
  
  class PauseStatus {
    constructor(app) {
      this.app = app
      this.test = "pause"
    }
  
    clickedMainButton() {
      this.app.run()
    }
  
    clickedSubButton() {
      this.app.reset()
    }
  }
  
  class StopWatchView {
    constructor(el) {
      this.$el = $(el);
      this.app = new StopWatch();
      this.app.setup(this)
      this.$('.buttons button.main').click( event => {
        this.app.clickedMainButton();
      });
      this.$('.buttons button.sub').click( event => {
        this.app.clickedSubButton();
      });
    }
  
    $(options) {
      return this.$el.find(options);
    }
  
    run() {
      this.updateDisplay();
      this.decorateStopButton('main');
      this.decorateLapButton('sub');
    }
  
    countUp() {
      this.setTime();
      this.$('.display').text(this.hour + "時間" + this.min + "分" + this.sec + "秒");
    }
  
    lap() {
      $("<li>" + this.getLapStr(this.app.currentLap) + "</li>").prependTo(this.$('.laps'));
    }
  
    pause() {
      this.updateDisplay();
      this.decorateRunButton('main');
      this.decorateResetButton('sub');
    }
  
    reset() {
      this.updateDisplay();
      this.clearLaps();
      this.decorateRunButton('main');
      this.decorateDisabledLapButton('sub')
    }
  
    getButton(name) {
      return this.$(`.buttons button.${name}`);
    }
  
    decorateRunButton(name) {
      this.getButton(name).text('run').removeAttr('disabled');
    }
  
    decorateStopButton(name) {
      this.getButton(name).text('stop').removeAttr('disabled');
    }
  
    decorateResetButton(name) {
      this.getButton(name).text('reset').removeAttr('disabled');
    }
  
    decorateLapButton(name) {
      this.getButton(name).text('lap').removeAttr('disabled');
    }
  
    decorateDisabledLapButton(name) {
      this.getButton(name).text('lap').attr('disabled', true);
    }
  
    updateDisplay() {
      this.setTime();
      this.$('.display').text(this.hour + "時間" + this.min + "分" + this.sec + "秒");
    }
  
    clearLaps() {
      this.$('.laps').empty();
    }
  
    update(event) {
      this[event]()
    }

    setTime(){
      this.hour = Math.floor(this.app.count / 3600);
      var htmp = this.app.count % 3600;
      this.min = Math.floor(htmp / 60);
      this.sec = htmp % 60;
    }
    
    getLapStr(lap){
    　let result = "";
    　let hour = Math.floor(lap / 3600);
    　let htmp = lap % 3600;
    　let min = Math.floor(htmp / 60);
    　let sec = htmp % 60;
      if (hour != 0){
          result += hour + "時間";
      }
      if (min != 0){
          result += min + "分";
      }
      if (sec != 0){
          result += sec + "秒";
      }
      return result;
    }
  }
  
  $(function () {  
    new StopWatchView($('.stopwatch'))
  });