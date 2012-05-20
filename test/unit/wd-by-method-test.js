// Generated by CoffeeScript 1.3.3
(function() {
  var CoffeeScript, Wd, WdWrap, async, express, should, test, wd, _ref;

  _ref = require('../../index'), wd = _ref.wd, Wd = _ref.Wd, WdWrap = _ref.WdWrap;

  should = require('should');

  CoffeeScript = require('coffee-script');

  express = require('express');

  async = require('async');

  test = function(browserName) {
    var browser, capabilities, funcSuffix, _fn, _i, _len, _ref1;
    browser = null;
    WdWrap = WdWrap({
      "with": (function() {
        return browser;
      })
    });
    capabilities = null;
    it("wd.remote", function(done) {
      browser = wd.remote({
        mode: 'sync'
      });
      browser.on("status", function(info) {
        return console.log("\u001b[36m%s\u001b[0m", info);
      });
      browser.on("command", function(meth, path) {
        return console.log(" > \u001b[33m%s\u001b[0m: %s", meth, path);
      });
      Wd = Wd({
        "with": browser
      });
      return done();
    });
    it("status", WdWrap(function() {
      return should.exist(this.status());
    }));
    it("sessions", WdWrap(function() {
      return should.exist(this.sessions());
    }));
    it("init", WdWrap(function() {
      return this.init({
        browserName: browserName
      });
    }));
    it("sessionCapabilities", WdWrap(function() {
      capabilities = this.sessionCapabilities();
      should.exist(capabilities);
      should.exist(capabilities.browserName);
      return should.exist(capabilities.platform);
    }));
    it("altSessionCapabilities", WdWrap(function() {
      capabilities = this.altSessionCapabilities();
      should.exist(capabilities);
      should.exist(capabilities.browserName);
      return should.exist(capabilities.platform);
    }));
    it("setPageLoadTimeout", WdWrap(function() {
      return this.setPageLoadTimeout(500);
    }));
    it("get", WdWrap(function() {
      return this.get("http://127.0.0.1:8181/test-page.html");
    }));
    it("refresh", WdWrap(function() {
      return this.refresh();
    }));
    it("back / forward", WdWrap(function() {
      this.refresh();
      this.get("http://127.0.0.1:8181/test-page.html?p=2");
      this.url().should.include("?p=2");
      this.back();
      this.url().should.not.include("?p=2");
      this.forward();
      this.url().should.include("?p=2");
      return this.get("http://127.0.0.1:8181/test-page.html");
    }));
    it("eval", WdWrap(function() {
      (this["eval"]("1+2")).should.equal(3);
      (this["eval"]("document.title")).should.equal("TEST PAGE");
      (this["eval"]("$('#eval').length")).should.equal(1);
      return (this["eval"]("$('#eval li').length")).should.equal(2);
    }));
    it("safeEval", WdWrap(function() {
      var _this = this;
      (this.safeEval("1+2")).should.equal(3);
      (this.safeEval("document.title")).should.equal("TEST PAGE");
      (this.safeEval("$('#eval').length")).should.equal(1);
      (this.safeEval("$('#eval li').length")).should.equal(2);
      return (function() {
        return _this.safeEval("++wrong >expr");
      }).should["throw"](/Error response status/);
    }));
    it("execute (no args)", WdWrap(function() {
      this.execute("window.wd_sync_execute_test = 'It worked!'");
      return (this["eval"]("window.wd_sync_execute_test")).should.equal('It worked!');
    }));
    it("execute (with args)", WdWrap(function() {
      var script;
      script = "window.wd_sync_execute_test = 'It worked! ' + (arguments[0] + arguments[1])";
      this.execute(script, [10, 5]);
      return (this["eval"]("window.wd_sync_execute_test")).should.equal('It worked! 15');
    }));
    it("safeExecute (no args)", WdWrap(function() {
      var _this = this;
      this.safeExecute("window.wd_sync_execute_test = 'It worked!'");
      (this["eval"]("window.wd_sync_execute_test")).should.equal('It worked!');
      return (function() {
        return _this.safeExecute("a wrong <> expr");
      }).should["throw"](/Error response status/);
    }));
    it("safeExecute (with args)", WdWrap(function() {
      var script,
        _this = this;
      script = "window.wd_sync_execute_test = 'It worked! ' + (arguments[0] + arguments[1])";
      this.safeExecute(script, [10, 5]);
      (this["eval"]("window.wd_sync_execute_test")).should.equal('It worked! 15');
      return (function() {
        return _this.safeExecute("a wrong <> expr", [10, 5]);
      }).should["throw"](/Error response status/);
    }));
    it("executeAsync (async mode, no args)", function(done) {
      var scriptAsCoffee, scriptAsJs;
      scriptAsCoffee = "[args...,done] = arguments\ndone \"OK\"              ";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      return browser.executeAsync(scriptAsJs, function(err, res) {
        res.should.equal("OK");
        return done();
      });
    });
    it("executeAsync (async mode, with args)", function(done) {
      var scriptAsCoffee, scriptAsJs;
      scriptAsCoffee = "[args...,done] = arguments\ndone(\"OK \" + (args[0]+args[1]))              ";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      return browser.executeAsync(scriptAsJs, [10, 4], function(err, res) {
        res.should.equal("OK 14");
        return done();
      });
    });
    it("safeExecuteAsync (async mode, no args)", function(done) {
      return async.series([
        function(done) {
          var scriptAsCoffee, scriptAsJs;
          scriptAsCoffee = "[args...,done] = arguments\ndone \"OK\"              ";
          scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
            bare: 'on'
          });
          return browser.safeExecuteAsync(scriptAsJs, function(err, res) {
            res.should.equal("OK");
            return done(null);
          });
        }, function(done) {
          return browser.safeExecuteAsync("a @@ wrong expr!", function(err, res) {
            should.exist(err);
            (err instanceof Error).should.be["true"];
            return done(null);
          });
        }
      ], function() {
        return done();
      });
    });
    it("safeExecuteAsync (async mode, with args)", function(done) {
      return async.series([
        function(done) {
          var scriptAsCoffee, scriptAsJs;
          scriptAsCoffee = "[args...,done] = arguments\ndone(\"OK \" + (args[0]+args[1]))              ";
          scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
            bare: 'on'
          });
          return browser.safeExecuteAsync(scriptAsJs, [10, 4], function(err, res) {
            res.should.equal("OK 14");
            return done(null);
          });
        }, function(done) {
          return browser.safeExecuteAsync("a @@ wrong expr!", [10, 4], function(err, res) {
            should.exist(err);
            (err instanceof Error).should.be["true"];
            return done(null);
          });
        }
      ], function() {
        return done();
      });
    });
    it("executeAsync (sync mode, no args)", WdWrap(function() {
      var res, scriptAsCoffee, scriptAsJs;
      scriptAsCoffee = "[args...,done] = arguments\ndone \"OK\"              ";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      res = this.executeAsync(scriptAsJs);
      return res.should.equal("OK");
    }));
    it("executeAsync (sync mode, with args)", WdWrap(function() {
      var res, scriptAsCoffee, scriptAsJs;
      scriptAsCoffee = "[args...,done] = arguments\ndone(\"OK \" + (args[0] + args[1]))              ";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      res = this.executeAsync(scriptAsJs, [10, 2]);
      return res.should.equal("OK 12");
    }));
    it("safeExecuteAsync (sync mode, no args)", WdWrap(function() {
      var res, scriptAsCoffee, scriptAsJs,
        _this = this;
      scriptAsCoffee = "[args...,done] = arguments\ndone \"OK\"              ";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      res = this.safeExecuteAsync(scriptAsJs);
      res.should.equal("OK");
      return (function() {
        return _this.safeExecuteAsync("!!!a wrong expr");
      }).should["throw"](/Error response status/);
    }));
    it("safeExecuteAsync (sync mode, with args)", WdWrap(function() {
      var res, scriptAsCoffee, scriptAsJs,
        _this = this;
      scriptAsCoffee = "[args...,done] = arguments\ndone(\"OK \" + (args[0] + args[1]))              ";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      res = this.safeExecuteAsync(scriptAsJs, [10, 2]);
      res.should.equal("OK 12");
      return (function() {
        return _this.safeExecuteAsync("!!!a wrong expr", [10, 2]);
      }).should["throw"](/Error response status/);
    }));
    it("setWaitTimeout / setImplicitWaitTimeout", WdWrap(function() {
      var scriptAsCoffee, scriptAsJs;
      this.setWaitTimeout(0);
      scriptAsCoffee = 'setTimeout ->\n  $(\'#setWaitTimeout\').html \'<div class="child">a child</div>\'\n, 1000           ';
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      this.execute(scriptAsJs);
      should.not.exist(this.elementByCssIfExists("#setWaitTimeout .child"));
      this.setImplicitWaitTimeout(2000);
      should.exist(this.elementByCss("#setWaitTimeout .child"));
      return this.setWaitTimeout(0);
    }));
    it("setAsyncScriptTimeout", WdWrap(function() {
      var err, res, scriptAsCoffee, scriptAsJs;
      this.setAsyncScriptTimeout(500);
      scriptAsCoffee = "[args...,done] = arguments\nsetTimeout ->\n  done \"OK\"\n, 2000";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      err = null;
      try {
        this.executeAsync(scriptAsJs);
      } catch (_err) {
        err = _err;
      }
      should.exist(err);
      err.status.should.equal(28);
      this.setAsyncScriptTimeout(2000);
      scriptAsCoffee = "[args...,done] = arguments\nsetTimeout ->\n  done \"OK\"\n, 500";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      res = this.executeAsync(scriptAsJs);
      res.should.equal("OK");
      return this.setAsyncScriptTimeout(0);
    }));
    it("element", WdWrap(function() {
      should.exist(this.element("name", "elementByName"));
      return (function() {
        return this.element("name", "elementByName2");
      }).should["throw"]();
    }));
    it("elementOrNull", WdWrap(function() {
      should.exist(this.elementOrNull("name", "elementByName"));
      return should.not.exist(this.elementOrNull("name", "elementByName2"));
    }));
    it("elementIfExists", WdWrap(function() {
      should.exist(this.elementIfExists("name", "elementByName"));
      return should.not.exist(this.elementIfExists("name", "elementByName2"));
    }));
    it("hasElement", WdWrap(function() {
      (this.hasElement("name", "elementByName")).should.be["true"];
      return (this.hasElement("name", "elementByName2")).should.be["false"];
    }));
    it("element", WdWrap(function() {
      (this.elements("name", "elementsByName")).should.have.length(3);
      return (this.elements("name", "elementsByName2")).should.eql([]);
    }));
    _ref1 = ['ByClassName', 'ByCssSelector', 'ById', 'ByName', 'ByLinkText', 'ByPartialLinkText', 'ByTagName', 'ByXPath', 'ByCss'];
    _fn = function() {
      var elementFuncName, elementsFuncName, hasElementFuncName, searchSeveralText, searchSeveralText2, searchText, searchText2;
      elementFuncName = 'element' + funcSuffix;
      hasElementFuncName = 'hasElement' + funcSuffix;
      elementsFuncName = 'elements' + funcSuffix;
      searchText = elementFuncName;
      if (searchText.match(/ByLinkText/)) {
        searchText = "click " + searchText;
      }
      if (searchText.match(/ByCss/)) {
        searchText = "." + searchText;
      }
      if (searchText.match(/ByXPath/)) {
        searchText = "//div[@id='elementByXPath']/input";
      }
      if (searchText.match(/ByTagName/)) {
        searchText = "span";
      }
      searchText2 = searchText + '2';
      if (searchText.match(/ByXPath/)) {
        searchText2 = "//div[@id='elementByXPath2']/input";
      }
      if (searchText.match(/ByTagName/)) {
        searchText2 = "span2";
      }
      searchSeveralText = searchText.replace('element', 'elements');
      searchSeveralText2 = searchText2.replace('element', 'elements');
      it(elementFuncName, WdWrap(function() {
        should.exist(this[elementFuncName](searchText));
        return (function() {
          return this[elementFuncName](searchText2);
        }).should["throw"]();
      }));
      it(elementFuncName + 'OrNull', WdWrap(function() {
        should.exist(this[elementFuncName + 'OrNull'](searchText));
        return should.not.exist(this[elementFuncName + 'OrNull'](searchText2));
      }));
      it(elementFuncName + 'IfExists', WdWrap(function() {
        should.exist(this[elementFuncName + 'IfExists'](searchText));
        return should.not.exist(this[elementFuncName + 'IfExists'](searchText2));
      }));
      it(hasElementFuncName, WdWrap(function() {
        (this[hasElementFuncName](searchText)).should.be["true"];
        return (this[hasElementFuncName](searchText2)).should.be["false"];
      }));
      return it(elementsFuncName, WdWrap(function() {
        var res;
        res = this[elementsFuncName](searchSeveralText);
        if (elementsFuncName.match(/ById/)) {
          res.should.have.length(1);
        } else if (elementsFuncName.match(/ByTagName/)) {
          (res.length > 1).should.be["true"];
        } else {
          res.should.have.length(3);
        }
        res = this[elementsFuncName](searchSeveralText2);
        return res.should.eql([]);
      }));
    };
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      funcSuffix = _ref1[_i];
      _fn();
    }
    it("getAttribute", WdWrap(function() {
      var testDiv;
      testDiv = this.elementById("getAttribute");
      should.exist(testDiv);
      (this.getAttribute(testDiv, "weather")).should.equal("sunny");
      return should.not.exist(this.getAttribute(testDiv, "timezone"));
    }));
    it("getValue (input)", WdWrap(function() {
      var inputField;
      inputField = this.elementByCss("#getValue input");
      should.exist(inputField);
      return (this.getValue(inputField)).should.equal("Hello getValueTest!");
    }));
    it("getValue (textarea)", WdWrap(function() {
      var inputField;
      inputField = this.elementByCss("#getValue textarea");
      should.exist(inputField);
      return (this.getValue(inputField)).should.equal("Hello getValueTest2!");
    }));
    it("clickElement", WdWrap(function() {
      var anchor, scriptAsCoffee, scriptAsJs;
      anchor = this.elementByCss("#clickElement a");
      (this.text(anchor)).should.equal("not clicked");
      scriptAsCoffee = 'jQuery ->\n  a = $(\'#clickElement a\')\n  a.click ->\n    a.html \'clicked\'    \n    false          ';
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      this.execute(scriptAsJs);
      (this.text(anchor)).should.equal("not clicked");
      this.clickElement(anchor);
      return (this.text(anchor)).should.equal("clicked");
    }));
    it("moveTo", WdWrap(function() {
      var a1, a2, current, scriptAsCoffee, scriptAsJs;
      a1 = this.elementByCss("#moveTo .a1");
      a2 = this.elementByCss("#moveTo .a2");
      current = this.elementByCss("#moveTo .current");
      should.exist(a1);
      should.exist(a2);
      should.exist(current);
      (this.text(current)).should.equal("");
      scriptAsCoffee = 'jQuery ->\n  a1 = $(\'#moveTo .a1\')\n  a2 = $(\'#moveTo .a2\')\n  current = $(\'#moveTo .current\')\n  a1.hover ->\n    current.html \'a1\'\n  a2.hover ->\n    current.html \'a2\'';
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      this.execute(scriptAsJs);
      (this.text(current)).should.equal("");
      this.moveTo(a1, 5, 5);
      (this.text(current)).should.equal("a1");
      this.moveTo(a2);
      return (this.text(current)).should.equal("a2");
    }));
    it("buttonDown / buttonUp", WdWrap(function() {
      var a, resDiv, scriptAsCoffee, scriptAsJs;
      a = this.elementByCss("#mouseButton a");
      resDiv = this.elementByCss("#mouseButton div");
      should.exist(a);
      should.exist(resDiv);
      scriptAsCoffee = 'jQuery ->\n  a = $(\'#mouseButton a\')\n  resDiv = $(\'#mouseButton div\')\n  a.mousedown ->\n    resDiv.html \'button down\'\n  a.mouseup ->\n    resDiv.html \'button up\'';
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      this.execute(scriptAsJs);
      (this.text(resDiv)).should.equal('');
      this.moveTo(a);
      this.buttonDown();
      (this.text(resDiv)).should.equal('button down');
      this.buttonUp();
      return (this.text(resDiv)).should.equal('button up');
    }));
    it("click", WdWrap(function() {
      var buttonNumberDiv, numOfClicksDiv, scriptAsCoffee, scriptAsJs;
      numOfClicksDiv = this.elementByCss("#click .numOfClicks");
      buttonNumberDiv = this.elementByCss("#click .buttonNumber");
      scriptAsCoffee = 'jQuery ->\n  window.numOfClick = 0\n  numOfClicksDiv = $(\'#click .numOfClicks\')\n  buttonNumberDiv = $(\'#click .buttonNumber\')\n  numOfClicksDiv.mousedown (eventObj) ->\n    button = eventObj.button\n    button = \'default\' unless button?\n    window.numOfClick = window.numOfClick + 1\n    numOfClicksDiv.html "clicked #{window.numOfClick}"\n    buttonNumberDiv.html "#{button}"    \n    false                                         ';
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      this.execute(scriptAsJs);
      (this.text(numOfClicksDiv)).should.equal("not clicked");
      this.moveTo(numOfClicksDiv);
      this.click(0);
      (this.text(numOfClicksDiv)).should.equal("clicked 1");
      (this.text(buttonNumberDiv)).should.equal("0");
      this.moveTo(numOfClicksDiv);
      this.click();
      (this.text(numOfClicksDiv)).should.equal("clicked 2");
      return (this.text(buttonNumberDiv)).should.equal("0");
    }));
    it("doubleclick", WdWrap(function() {
      var div, scriptAsCoffee, scriptAsJs;
      div = this.elementByCss("#doubleclick div");
      (this.text(div)).should.equal("not clicked");
      scriptAsCoffee = 'jQuery ->\n  div = $(\'#doubleclick div\')\n  div.dblclick ->\n    div.html \'doubleclicked\'                                                 ';
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      this.execute(scriptAsJs);
      this.moveTo(div);
      this.doubleclick();
      return (this.text(div)).should.equal("doubleclicked");
    }));
    it("type", WdWrap(function() {
      var altKey, inputField, nullKey;
      altKey = wd.SPECIAL_KEYS['Alt'];
      nullKey = wd.SPECIAL_KEYS['NULL'];
      inputField = this.elementByCss("#type input");
      should.exist(inputField);
      this.type(inputField, "Hello");
      (this.getValue(inputField)).should.equal("Hello");
      this.type(inputField, [altKey, nullKey, " World"]);
      (this.getValue(inputField)).should.equal("Hello World");
      this.type(inputField, "\n");
      return (this.getValue(inputField)).should.equal("Hello World");
    }));
    it("keys", WdWrap(function() {
      var altKey, inputField, nullKey;
      altKey = wd.SPECIAL_KEYS['Alt'];
      nullKey = wd.SPECIAL_KEYS['NULL'];
      inputField = this.elementByCss("#keys input");
      should.exist(inputField);
      this.clickElement(inputField);
      this.keys("Hello");
      (this.getValue(inputField)).should.equal("Hello");
      this.keys([altKey, nullKey, " World"]);
      (this.getValue(inputField)).should.equal("Hello World");
      this.keys("\n");
      return (this.getValue(inputField)).should.equal("Hello World");
    }));
    it("clear", WdWrap(function() {
      var inputField;
      inputField = this.elementByCss("#clear input");
      should.exist(inputField);
      (this.getValue(inputField)).should.equal("not cleared");
      this.clear(inputField);
      return (this.getValue(inputField)).should.equal("");
    }));
    it("title", WdWrap(function() {
      return this.title().should.equal("TEST PAGE");
    }));
    it("text (passing element)", WdWrap(function() {
      var textDiv;
      textDiv = this.elementByCss("#text");
      should.exist(textDiv);
      (this.text(textDiv)).should.include("text content");
      return (this.text(textDiv)).should.not.include("div");
    }));
    it("text (passing undefined)", WdWrap(function() {
      var res;
      res = this.text(void 0);
      res.should.include("text content");
      res.should.include("sunny");
      res.should.include("click elementsByLinkText");
      return res.should.not.include("div");
    }));
    it("text (passing body)", WdWrap(function() {
      var res;
      res = this.text('body');
      res.should.include("text content");
      res.should.include("sunny");
      res.should.include("click elementsByLinkText");
      return res.should.not.include("div");
    }));
    it("text (passing null)", WdWrap(function() {
      var res;
      res = this.text(null);
      res.should.include("text content");
      res.should.include("sunny");
      res.should.include("click elementsByLinkText");
      return res.should.not.include("div");
    }));
    it("textPresent", WdWrap(function() {
      var textDiv;
      textDiv = this.elementByCss("#textPresent");
      should.exist(textDiv);
      (this.textPresent('sunny', textDiv)).should.be["true"];
      return (this.textPresent('raining', textDiv)).should.be["false"];
    }));
    it("acceptAlert", WdWrap(function() {
      var a, res, scriptAsCoffee, scriptAsJs;
      a = this.elementByCss("#acceptAlert a");
      should.exist(a);
      scriptAsCoffee = "a = $('#acceptAlert a')\na.click ->\n  alert \"coffee is running out\"\n  false";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      res = this.execute(scriptAsJs);
      this.clickElement(a);
      return this.acceptAlert();
    }));
    it("dismissAlert", WdWrap(function() {
      var a, res, scriptAsCoffee, scriptAsJs;
      a = this.elementByCss("#dismissAlert a");
      should.exist(a);
      scriptAsCoffee = "a = $('#dismissAlert a')\na.click ->\n  alert \"coffee is running out\"\n  false";
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      res = this.execute(scriptAsJs);
      this.clickElement(a);
      if (!(capabilities.platform === 'MAC' && capabilities.browserName === 'chrome')) {
        return this.dismissAlert();
      } else {
        return this.acceptAlert();
      }
    }));
    it("active", WdWrap(function() {
      var i1, i2;
      i1 = this.elementByCss("#active .i1");
      i2 = this.elementByCss("#active .i2");
      this.clickElement(i1);
      this.active().should.equal(i1);
      this.clickElement(i2);
      return this.active().should.equal(i2);
    }));
    it("url", WdWrap(function() {
      var url;
      url = this.url();
      url.should.include("test-page.html");
      return url.should.include("http://");
    }));
    it("allCookies / setCookies / deleteAllCookies / deleteCookie", WdWrap(function() {
      var cookies;
      this.deleteAllCookies();
      this.allCookies().should.eql([]);
      this.setCookie({
        name: 'fruit1',
        value: 'apple'
      });
      cookies = this.allCookies();
      (cookies.filter(function(c) {
        return c.name === 'fruit1' && c.value === 'apple';
      })).should.have.length(1);
      this.setCookie({
        name: 'fruit2',
        value: 'pear'
      });
      cookies = this.allCookies();
      cookies.should.have.length(2);
      (cookies.filter(function(c) {
        return c.name === 'fruit2' && c.value === 'pear';
      })).should.have.length(1);
      this.setCookie({
        name: 'fruit3',
        value: 'orange'
      });
      this.allCookies().should.have.length(3);
      this.deleteCookie('fruit2');
      cookies = this.allCookies();
      cookies.should.have.length(2);
      (cookies.filter(function(c) {
        return c.name === 'fruit2' && c.value === 'pear';
      })).should.have.length(0);
      this.deleteAllCookies();
      this.allCookies().should.eql([]);
      this.setCookie({
        name: 'fruit3',
        value: 'orange',
        secure: true
      });
      return this.deleteAllCookies();
    }));
    it("waitForCondition", WdWrap(function() {
      var exprCond, scriptAsCoffee, scriptAsJs,
        _this = this;
      scriptAsCoffee = 'setTimeout ->\n  $(\'#waitForCondition\').html \'<div class="child">a waitForCondition child</div>\'\n, 1500';
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      this.execute(scriptAsJs);
      should.not.exist(this.elementByCssIfExists("#waitForCondition .child"));
      exprCond = "$('#waitForCondition .child').length > 0";
      (this.waitForCondition(exprCond, 2000, 200)).should.be["true"];
      (this.waitForCondition(exprCond, 2000)).should.be["true"];
      (this.waitForCondition(exprCond)).should.be["true"];
      return (function() {
        return _this.waitForCondition("sdsds ;;sdsd {}");
      }).should["throw"](/Error response status/);
    }));
    it("waitForConditionInBrowser", WdWrap(function() {
      var exprCond, scriptAsCoffee, scriptAsJs,
        _this = this;
      scriptAsCoffee = 'setTimeout ->\n  $(\'#waitForConditionInBrowser\').html \'<div class="child">a waitForCondition child</div>\'\n, 1500';
      scriptAsJs = CoffeeScript.compile(scriptAsCoffee, {
        bare: 'on'
      });
      this.execute(scriptAsJs);
      should.not.exist(this.elementByCssIfExists("#waitForConditionInBrowser .child"));
      this.setAsyncScriptTimeout(5000);
      exprCond = "$('#waitForConditionInBrowser .child').length > 0";
      (this.waitForConditionInBrowser(exprCond, 2000, 200)).should.be["true"];
      (this.waitForConditionInBrowser(exprCond, 2000)).should.be["true"];
      (this.waitForConditionInBrowser(exprCond)).should.be["true"];
      (function() {
        return _this.waitForConditionInBrowser("sdsds ;;sdsd {}");
      }).should["throw"](/Error response status/);
      return this.setAsyncScriptTimeout(0);
    }));
    it("err.inspect", WdWrap(function() {
      var err;
      err = null;
      try {
        browser.safeExecute("invalid-code> here");
      } catch (_err) {
        err = _err;
      }
      should.exist(err);
      (err instanceof Error).should.be["true"];
      err.inspect().should.include('"screen": "[hidden]"');
      return err.inspect().should.include('browser-error:');
    }));
    it("close", WdWrap(function() {
      return this.close();
    }));
    return it("quit", WdWrap(function() {
      return this.quit();
    }));
  };

  describe("wd-sync", function() {
    return describe("method by method tests", function() {
      var app;
      app = null;
      before(function(done) {
        app = express.createServer();
        app.use(express["static"](__dirname + '/assets'));
        app.listen(8181);
        return done();
      });
      after(function(done) {
        app.close();
        return done();
      });
      describe("using chrome", function() {
        return test('chrome');
      });
      return describe("using firefox", function() {
        return test('firefox');
      });
    });
  });

}).call(this);
