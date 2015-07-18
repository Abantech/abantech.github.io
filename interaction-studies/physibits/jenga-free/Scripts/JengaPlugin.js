var pointer;
var isMouseDown;

JengaPlugin = {
    ClearPointer: function (){
        if (!pointer) {
            pointer = $('#pointer')[0];
        }

        pointer.style.opacity = 0;
    },
    Point: function (Frame, PointedFingers) {
        if (!pointer) {
            pointer = $('#pointer')[0];
        }
        
        if (PointedFingers.indexOf(1) != -1) {
            var normalizedPosition = GetNormalizedPosition(Frame, Frame.hands[0].fingers[1]);
            var screenPosition = ConvertLeapPositionToScreen(normalizedPosition);
            
            // Indicates one finger
            pointer.style.background = "red";
            
            pointer.style.position = 'absolute';
            pointer.style.left = screenPosition.x + 'px';
            pointer.style.top = $(window).scrollTop() + screenPosition.y + 'px';
            pointer.style.opacity = (((1 - normalizedPosition[2]) < .5) ? ((1 - normalizedPosition[2])) : normalizedPosition[2]) * .7;

            if (isMouseDown) {
                triggerMouseEvent(renderer.domElement, "mouseup", screenPosition.x, screenPosition.y)
                isMouseDown = false;
            }
        }
        else {
            JengaPlugin.ClearPointer();
        }
    },
    TwoFingerPoint: function (Frame, PointedFingers) {
        if (!pointer) {
            pointer = $('#pointer')[0];
        }
        
        // Indicates two fingers
        pointer.style.background = "blue";
        
        if (PointedFingers.indexOf(1) != -1 && PointedFingers.indexOf(0) != -1) {
            var normalizedPosition = GetNormalizedPosition(Frame, Frame.hands[0].fingers[1]);
            var screenPosition = ConvertLeapPositionToScreen(normalizedPosition);

            pointer.style.position = 'absolute';
            pointer.style.left = screenPosition.x + 'px';
            pointer.style.top = $(window).scrollTop() + screenPosition.y + 'px';
            pointer.style.opacity = (((1 - normalizedPosition[2]) < .5) ? ((1 - normalizedPosition[2])) : normalizedPosition[2]) * .7;

            if (!isMouseDown) {
                triggerMouseEvent(renderer.domElement, "mousedown", screenPosition.x, screenPosition.y)
                isMouseDown = true;
            }
            else {
                triggerMouseEvent(renderer.domElement, "mousemove", screenPosition.x, screenPosition.y)
            }

        }
        else {
            JengaPlugin.ClearPointer();
        }
    }
}

function triggerMouseEvent(node, eventType, xpos, ypos) {
    var clickEvent = document.createEvent('MouseEvents');
    
    clickEvent.initMouseEvent(eventType, true, true, window,
    0, 0, 0, xpos, ypos, false, false, false, false, 0, null);
    //clickEvent.clientX = xpos;
    //clickEvent.clientY = ypos;
    node.dispatchEvent(clickEvent);
}

function ConvertLeapPositionToScreen(normalizedPosition) {
    var screenPosition = {};
    
    // Convert the normalized coordinates to span the canvas
    screenPosition.x = window.innerWidth * normalizedPosition[0];
    screenPosition.y = window.innerHeight * (1 - normalizedPosition[1]);
    
    return screenPosition;
}

function GetNormalizedPosition(Frame, Finger) {
    var interactionBox = Frame.interactionBox;
    return interactionBox.normalizePoint(Finger.tipPosition, true);
}