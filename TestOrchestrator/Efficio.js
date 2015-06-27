var bus = require('./Message Bus/MessageBus.js');
var hirp = require('./Human Input Recognition and Processing/HumanInputRecognitionAndProcessing.js');
var ami = require('./Asset Management And Inventory/AssetManager.js');
var sketchup = require('./Plugins/SketchUp/SketchUp.js');
var leap;

module.exports = 
{
    Initialize: function () {
        bus.Initialize();
        hirp.Initialize();
        ami.Initialize();
        sketchup.Init();
        
        // Stub for simulating input
        leap = require('./Plugins/LeapMotion/LeapMotionStub.js');
        leap.Init();
    },
    Start: function () {
        var option = 0;
        
        while (true) {
            if (Date.now() % 2000 === 0) {
                if (option === 0) {
                    leap.StubPinch();
                    
                    option = 1;
                }
                else {
                    if (option === 1) {
                        leap.StubGrasp();
                        
                        option = 2;
                    }
                    else {
                        if (option === 2) {
                            leap.StubCustomGesture();
                            
                            option = 0;
                        }
                    }
                }
            }
        }
    }
}