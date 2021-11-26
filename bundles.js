var bundles = document.currentScript.dataset.scripts || undefined;
    bundles = bundles ? bundles.split(/;|,| /) : [];
    bundles = bundles.filter(e =>  e);

var bundleLocation = document.currentScript.src.replace(/\\/g,'/').replace(/\/[^\/]*$/, '') + "/bundles";

var debug = document.currentScript.dataset.debug || undefined;
    debug = (debug ? debug.split(/;|,| /) : undefined);
    debug = (debug ? debug.filter(e => e) : undefined);

if (debug && debug.length == 1 && bundles.find(e => e == debug[0]) == undefined)
    debug = Boolean(debug);

if(debug) {

  console.log("Current script: ", document.currentScript);
  if (document.currentScript.async) console.log("- Executing asynchronously");
  else console.log("- Executing synchronously");
  if (document.currentScript.defer) console.log("- Deferred execution");
  else console.log("- Direct execution");

  console.log("Bundle directory location: ", bundleLocation);
  console.log("Bundle(s) to load: ", bundles);
}

var debugBak = false;
for( var i = 0; i < bundles.length; i++) {

    var debug = false;
    if (typeof debugBak == "boolean") debug = debugBak;
    else if (typeof debugBak == "array" && debugBak.indexOf(bundle) > -1) debug = true;

    var bundle = bundles[i];
    var script = document.createElement('script');
        script.src = bundleLocation + "/" + bundles[i] + ".js";

    document.body.appendChild(script);
}
