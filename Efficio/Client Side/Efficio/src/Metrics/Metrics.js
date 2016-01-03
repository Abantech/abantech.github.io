define(function () {
    var startTime;
    var framesSinceStart = 0;
    var Metrics = {};
    var myReq;

    function incrementFrames() {
        framesSinceStart++;
        myReq = requestAnimationFrame(incrementFrames);
    }

    function AverageFPS() {
        return framesSinceStart / (UpTime() / 1000);
    }

    function UpTime() {
        return new Date() - startTime;
    }

    function Ready() {
        return myReq != null;
    }

    function Initialize() {
        Metrics.AverageFPS = AverageFPS;
        Metrics.UpTime = UpTime;
        Metrics.Ready = Ready

        return Metrics;
    }

    function Start() {
        startTime = new Date();

        if (window) {
            requestAnimationFrame(incrementFrames);
        }
    }

    return {
        Initialize: Initialize,
        Start: Start
    }
});