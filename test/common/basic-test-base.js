// Generated by CoffeeScript 1.6.3
(function() {
  var TIMEOUT, should, testCurrent, testSleep, testWithBrowser, wdSync;

  wdSync = require('../../index');

  should = require('should');

  TIMEOUT = 45000;

  testWithBrowser = function(opt) {
    return describe("basic browsing", function() {
      var _ref, _ref1;
      return it((((_ref = opt.desired) != null ? _ref.browserName : void 0) != null ? "using " + ((_ref1 = opt.desired) != null ? _ref1.browserName : void 0) : "without passing browser"), function(done) {
        var browser, sync, _ref2, _ref3, _ref4;
        this.timeout(opt.timeout || TIMEOUT);
        _ref2 = {}, browser = _ref2.browser, sync = _ref2.sync;
        switch (opt.type) {
          case 'remote':
            _ref3 = wdSync.remote(opt.remoteConfig), browser = _ref3.browser, sync = _ref3.sync;
            break;
          case 'headless':
            _ref4 = wdSync.headless(), browser = _ref4.browser, sync = _ref4.sync;
        }
        return sync(function() {
          var caps, queryField, sessionId;
          should.exist(this.status());
          if (typeof browserName !== "undefined" && browserName !== null) {
            this.init({
              browserName: "" + browserName
            });
          } else {
            this.init(opt.desired);
          }
          sessionId = this.getSessionId();
          should.exist(sessionId);
          caps = this.sessionCapabilities();
          should.exist(caps);
          if (typeof browserName !== "undefined" && browserName !== null) {
            should.exist(caps.browserName);
          }
          this.get("http://saucelabs.com/test/guinea-pig");
          this.title().toLowerCase().should.include('sauce labs');
          queryField = this.elementById('i_am_a_textbox');
          this.type(queryField, "Hello World");
          this.type(queryField, "\n");
          this.quit();
          return done();
        });
      });
    });
  };

  testCurrent = function(opt) {
    return describe("wd.current()", function() {
      return it("browsing with using wd.current()", function(done) {
        var browser, myOwnTitle, sync, _ref, _ref1, _ref2;
        this.timeout(opt.timeout || TIMEOUT);
        _ref = {}, browser = _ref.browser, sync = _ref.sync;
        switch (opt.type) {
          case 'remote':
            _ref1 = wdSync.remote(opt.remoteConfig), browser = _ref1.browser, sync = _ref1.sync;
            break;
          case 'headless':
            _ref2 = wdSync.headless(), browser = _ref2.browser, sync = _ref2.sync;
        }
        myOwnTitle = function() {
          return wdSync.current().title();
        };
        return sync(function() {
          if (typeof browserName !== "undefined" && browserName !== null) {
            this.init({
              browserName: "" + browserName
            });
          } else {
            this.init(opt.desired);
          }
          this.get("http://saucelabs.com/test/guinea-pig");
          myOwnTitle().toLowerCase().should.include('sauce labs');
          this.quit();
          return done();
        });
      });
    });
  };

  testSleep = function(opt) {
    return describe("wdSync.sleep()", function() {
      return it("should sleep", function(done) {
        var browser, sync, _ref, _ref1, _ref2;
        this.timeout(opt.timeout || TIMEOUT);
        _ref = {}, browser = _ref.browser, sync = _ref.sync;
        switch (opt.type) {
          case 'remote':
            _ref1 = wdSync.remote(opt.remoteConfig), browser = _ref1.browser, sync = _ref1.sync;
            break;
          case 'headless':
            _ref2 = wdSync.headless(), browser = _ref2.browser, sync = _ref2.sync;
        }
        return sync(function() {
          wdSync.sleep(50);
          return done();
        });
      });
    });
  };

  exports.testWithBrowser = testWithBrowser;

  exports.testCurrent = testCurrent;

  exports.testSleep = testSleep;

}).call(this);
