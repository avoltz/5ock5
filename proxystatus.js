ProxyStatus = {
  default_port : 8888,
  port : 8888,
  
  default_host : "127.0.0.1",
  host : "127.0.0.1",
  
  bypass : [],
  
  is_enabled : false,
  
  // set the internal values from the string values passed in
  set : function(host, port, bypass) {
    console.trace();
    var is_port = parseInt(port);
    if (! isNaN(is_port)) {
      this.port = is_port;
    }
    if (typeof bypass === 'string') {
      this.bypass = bypass.split(',');
    }
    this.host = host;
    console.log('set values, port(%d), host(%s), bypass(%s)', this.port, this.host, this.bypass.join(','));
  },
  
  // load from localstoreage - values are stored as strings
  load : function() {
    var outer = this;
    chrome.storage.local.get(['sock5port', 'sock5bypass'], function(values) {
      if (typeof values.socks5port === 'undefined') {
        values.socks5port = outer.default_port;
      }
      if (typeof values.socks5bypass === 'undefined') {
        values.socks5bypass = "";
      }
      if (typeof values.socks5host === 'undefined') {
        values.socks5host = outer.default_host;
      }
      outer.set(values.socks5host, values.socks5port, values.socks5bypass);
    });
  },
  
  getBypass : function() { return this.bypass.join(','); },

  // save to localStorage - stored as strings...
  save : function(host, port, bypass) {
    this.set(host, port, bypass);
    var outer = this;
    chrome.storage.local.set({ 'socks5host' : outer.host, 'sock5port' : outer.port.toString(), 'sock5bypass': outer.getBypass() }, function() {});
  },
 
  // get a config structure for setting 
  getProxyConfig : function() {
    var outer = this;
    return {
      mode: "fixed_servers",
      rules: {
        singleProxy: {
          scheme: "socks5",
          host: outer.host,
          port: outer.port
        },
        bypassList: outer.bypass
      }
    };
  },
  
  // sync with what the chrome OS vars tell us, in case another app changes stuff
  toggle : function() {
    if (this.is_enabled) {
      chrome.proxy.settings.clear({}, function() {});
    } else {
      var outer = this;
      chrome.proxy.settings.set({ value: outer.getProxyConfig(), scope: "regular"}, function() {});
    }
    this.is_enabled = ! this.is_enabled;
  },

  check : function() {
    var outer = this;
    chrome.proxy.settings.get({}, function(details) {
      outer.is_enabled = (details.value.mode == "fixed_servers");
      if (outer.is_enabled) {
        outer.port = details.value.rules.singleProxy.port;
        if (details.value.rules.bypassList instanceof Array) {
          outer.bypass = details.value.rules.bypassList;
        }
        outer.host = details.value.rules.singleProxy.host;
      }
    });
  },
  
  kill : function() {
    chrome.proxy.settings.clear({}, function() {});
    this.is_enabled = false;
  }
};