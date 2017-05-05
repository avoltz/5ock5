window.onload = function() {
  var elements = {
    host : document.getElementById('host'),
    port : document.getElementById('port'),
    bypass : document.getElementById('bypass'),
    status : document.getElementById('status'),
    verify : document.getElementById('verify')
  };
  
  disableUi = function() {
    for (var e in elements) {
      e.disabled = true;
    }
  };
  
  updateStatusUi = function() {
    elements.host.disabled = ProxyStatus.is_enabled;
    elements.port.disabled = ProxyStatus.is_enabled;
    elements.bypass.disabled = ProxyStatus.is_enabled;
    elements.status.value = ProxyStatus.is_enabled ? "Disable" : "Enable";
    elements.status.disabled = false;
    elements.verify.disabled = false;
  };
  
  elements.verify.onclick = function() {
    disableUi();
    ProxyStatus.check();
    updateStatusUi();
  };
  
  elements.status.onclick = function() {
    disableUi();
    if (! ProxyStatus.is_enabled) {
      console.log(elements.bypass.value);
      ProxyStatus.save(elements.host.value, elements.port.value, elements.bypass.value);
    }
    ProxyStatus.toggle();
    updateStatusUi();
  };
  
  // update immediately
  ProxyStatus.load();
  elements.host.value = ProxyStatus.host;
  elements.port.value = ProxyStatus.port;
  elements.bypass.value = ProxyStatus.getBypass();
  elements.verify.onclick();
};