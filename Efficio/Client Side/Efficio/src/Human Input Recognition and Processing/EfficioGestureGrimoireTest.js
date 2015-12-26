var bus = require('postal');
var source = 'Efficio Gesture Grimoire';
var fs = require('fs');

var GestureLibrary = [];

function ConnectToGestureSource() {
    // Create connection to gesture source
    var file = '{    "Gestures": [        {            "Name": "FiveFingersAbovePalm",            "Hands": [                {                    "Hand": "Either",                    "Fingers": [                        {                            "Name": "Index",                            "Extended": "true",                            "RelativeTo": {                                "Hand": "Self",                                "Part": "Palm",                                "Position": "Above",                                "Value": "1"                            }                        },                        {                            "Name": "Middle",                            "Extended": "true",                            "RelativeTo": {                                "Hand": "Self",                                "Part": "Palm",                                "Position": "Above",                                "Value": "1"                            }                        },                        {                            "Name": "Ring",                            "Extended": "true",                            "RelativeTo": {                                "Hand": "Self",                                "Part": "Palm",                                "Position": "Above",                                "Value": "1"                            }                        },                        {                            "Name": "Pinky",                            "Extended": "true",                            "RelativeTo": {                                "Hand": "Self",                                "Part": "Palm",                                "Position": "Above",                                "Value": "1"                            }                        }                    ]                }            ]        },        {            "Name": "FiveFingersBelowPalm",            "Hands": [                {                    "Hand": "Either",                    "Fingers": [                        {                            "Name": "Index",                            "Extended": "true",                            "RelativeTo": {                                "Hand": "Self",                                "Part": "Palm",                                "Position": "Below",                                "Value": "2"                            }                        },                        {                            "Name": "Middle",                            "Extended": "true",                            "RelativeTo": {                                "Hand": "Self",                                "Part": "Palm",                                "Position": "Below",                                "Value": "2"                            }                        },                        {                            "Name": "Ring",                            "Extended": "true",                            "RelativeTo": {                                "Hand": "Self",                                "Part": "Palm",                                "Position": "Below",                                "Value": "2"                            }                        },                        {                            "Name": "Pinky",                            "Extended": "true",                            "RelativeTo": {                                "Hand": "Self",                                "Part": "Palm",                                "Position": "Below",                                "Value": "2"                            }                        }                    ]                }            ]        }    ] }'
    GestureLibrary = JSON.parse(file);
}

function distance(position1, position2) {
    var x = (position1[0] - position2[0]);
    var y = (position1[1] - position2[1]);
    var z = (position1[2] - position2[2]);
    return Math.sqrt((x * x) + (y * y) + (z * z));
}

function DetectPredefinedGestures(data) {
    GestureLibrary.Gestures.forEach(function (gesture) {
        
        if (!data || !data.input) {
            return;
        }
        
        if (data.input.hands.length === 0) {
            //bus.publish({
            //    channel: "Input.Processed.Efficio",
            //    topic: "NoHandsDetected", 
            //    source: source,
            //    data: {
            //        message: 'No hands detected'
            //    }
            //});
            
            return;
        }
        
        if (gesture.Hands.length < 1) {
            return;
        }
        
        if (gesture.Hands.length === 1) {
            var type = data.input.hands[0].type;
            
            if (gesture.Hands[0].Hand != 'Either' && gesture.Hands[0].Hand.toUpperCase() != type.toUpperCase()) {
                return;
            }
            
            var success = true;
            
            gesture.Hands[0].Fingers.forEach(function (finger) {
                var fingerValues = { "Thumb" : 0, "Index" : 1, "Middle" : 2, "Ring" : 3, "Pinky" : 4 }
                var fingerValue = fingerValues[finger.Name];
                var leapFinger = data.input.hands[0].fingers[fingerValue];
                
                if ("Extended" in finger) {
                    if (finger.Extended != leapFinger.extended.toString()) {
                        success = false;
                    }
                }
                
                if ("RelativeTo" in finger) {
                    if (finger.RelativeTo.Hand === 'Self') {
                        if (finger.RelativeTo.Part != finger.Name) {
                            
                            var relativeTo;
                            
                            if (finger.RelativeTo.Part != 'Palm') {
                                relativeTo = data.input.hands[0].fingers[fingerValues[finger.RelativeTo.Part]];
                            } else {
                                relativeTo = { tipPosition: data.input.hands[0].palmPosition}
                            }
                            
                            switch (finger.RelativeTo.Position) {
                                case "Above": {
                                    if (leapFinger.tipPosition[1] - relativeTo.tipPosition[1] < finger.RelativeTo.Value) {
                                        success = false;
                                    }

                                    break;
                                }
                                case "Below": {
                                    if (leapFinger.tipPosition[1] - relativeTo.tipPosition[1] > finger.RelativeTo.Value) {
                                        success = false;
                                    }
                                    
                                    break;
                                }
                                case "Left": {
                                    //TODO
                                    if (leapFinger.tipPosition[0] - relativeTo.tipPosition[0] < finger.RelativeTo.Value) {
                                        success = false;
                                    }
                                    
                                    break;
                                }
                                case "Right": {
                                    //TODO
                                    if (leapFinger.tipPosition[1] - relativeTo.tipPosition[1] < finger.RelativeTo.Value) {
                                        success = false;
                                    }
                                    
                                    break;
                                }
                                case "CloseTo": {
                                    //TODO
                                    if (distance(leapFinger.tipPosition, relativeTo.tipPosition) >finger.RelativeTo.Value) {
                                        success = false;
                                    }
                                    
                                    break;
                                }
                                case "FarFrom": {
                                    //TODO
                                    if (distance(leapFinger.tipPosition, relativeTo.tipPosition) < finger.RelativeTo.Value) {
                                        success = false;
                                    }
                                    
                                    break;
                                }
                            }
                        }
                        else {
                            bus.publish({
                                channel: "UserNotification",
                                topic: "Error", 
                                source: source,
                                data: {
                                    message: 'Parts cannot be made relative to themselves.'
                                }
                            });
                        }
                    } else {
                        //bus.publish({
                        //    channel: "UserNotification",
                        //    topic: "Error", 
                        //    source: source,
                        //    data: {
                        //        message: 'Single hand gestures cannot be relative to other hands'
                        //    }
                        //});
                    }
                }
            }, data, success);
            
            if (success) {
                bus.publish({
                    channel: "Input.Processed.Efficio",
                    topic: gesture.Name, 
                    source: source,
                    data: {
                        message: 'No hands detected'
                    }
                });
            }
        }
    }, data);
}

module.exports = {
    Initialize: function () {
        ConnectToGestureSource();
    },
    
    ProcessInput: function (data) {
        // Where input is processed and Custom Gestures are published on the channel
        DetectPredefinedGestures(data);
    }
}