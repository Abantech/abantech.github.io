if (typeof THREE === 'object') {
    define('three', function () { return THREE; });
}

if (typeof Leap === 'function') {
    define('leapjs', function () { return Leap; });
}

require(["Efficio"], function (Efficio) {
    Efficio.Initialize(EfficioConfiguration);
    Efficio.Start();
});