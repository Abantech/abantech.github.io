var devices = [];
var finger = {};
var pointer;
var timeStartHover = new Date().getTime();
var lastAnchorID = '';

EfficioSitePlugin = {
    DownDirectionDetected: function () {
        window.scrollBy(0, 20);
        
        $('#LeapModal').modal('hide')
    },
    UpDirectionDetected: function () {
        window.scrollBy(0, -20);
        
        $('#LeapModal').modal('hide')
    },
    DeviceRegistered: function (Device) {
        devices.push(Device);
    },
    Hello: function () {
        $('#LeapModal').modal('hide')
        $('#NoDeviceModal').modal('hide')
    },
    NextSection: function () {
        moveTab("Next");
    },
    LastSection: function () {
        moveTab("Previous");
    },
    
    
    GoToSection: function (Message) {
        if (Message.toUpperCase() === "HOME") {
            $('.navbar-brand').click();
        }
        
        if (Message.toUpperCase() === "OFFICIAL" || Message.toUpperCase() === "PHYSIO" || Message.toUpperCase() === "A PHYSIO" || Message.toUpperCase() === "A FISHY OH") {
            $('#Efficio').click();
        }
        
        $('.navbar-nav li').each(function () {
            if ($(this).children()[0].innerText.toUpperCase() === Message.toUpperCase()) {
                $(this).children()[0].click();
            }
        });
    },
    Point: function (Frame, PointedFingers) {
        if (!pointer) {
            pointer = $('#pointer')[0];
        }
        
        if (PointedFingers.length === 1) {
            pointer.style.background = "red";
        }
        
        
        if (PointedFingers.indexOf(1) != -1) {
            var interactionBox = Frame.interactionBox;
            var normalizedPosition = interactionBox.normalizePoint(Frame.hands[0].fingers[1].tipPosition, true);
            
            // Convert the normalized coordinates to span the canvas
            var canvasX = window.innerWidth * normalizedPosition[0];
            var canvasY = window.innerHeight * (1 - normalizedPosition[1]);
            
            pointer.style.opacity = (((1 - normalizedPosition[2]) < .5) ? ((1 - normalizedPosition[2])) : normalizedPosition[2]) * .7;
            pointer.style.position = 'absolute';
            pointer.style.left = canvasX + 'px';
            pointer.style.top = $(window).scrollTop() + canvasY + 'px';
            
            if ($('#pointer').touching('a').length > 0) {
                if (lastAnchorID != $('#pointer').touching("a")[0].id) {
                    ClearBG();
                    lastAnchorID = $('#pointer').touching("a")[0].id;
                    timeStartHover = new Date().getTime();
                } else {
                    if (!timeStartHover) {
                        timeStartHover = new Date().getTime();
                    }
                    
                    if (!$('#pointer').touching("a")[0].classList.contains('btn-lg')) {
                        if ((new Date().getTime() - timeStartHover) > 750) {
                            if (!$('#pointer').touching("a")[0].parentElement.classList.contains('active')) {
                                $('#pointer').touching("a")[0].click();
                            }
                        }
                    }
                    else {
                        if ((new Date().getTime() - timeStartHover) > 2000) {
                            $('#pointer').touching("a")[0].click();
                        }
                    }
                }
                
                if ($('#pointer').touching('a')[0]) {
                    $('#pointer').touching('a')[0].style.backgroundColor = "grey";
                }
            }
            else {
                ClearBG();
                timeStartHover = new Date().getTime();
            }

        }
        else {
            pointer.style.opacity = 0;
        }
    },
    TwoFingerPoint: function (Frame, PointedFingers) {
        if (!pointer) {
            pointer = $('#pointer')[0];
        }
        
        pointer.style.background = "blue";
        
        EfficioSitePlugin.Point(Frame, PointedFingers);
    }
}


function ClearBG() {
    $('a').each(function () {
        $(this)[0].style.backgroundColor = '';
    });
}


function moveTab(nextOrPrev) {
    var currentTab = "";
    $('.navbar-nav li').each(function () {
        if ($(this).hasClass('active')) {
            currentTab = $(this);
        }
    });
    
    
    if (nextOrPrev == "Next") {
        if (currentTab.next().length) {
            currentTab.next().children()[0].click();
        }
        else { } // do nothing for now

    } else {
        if (currentTab.prev().length) {
            currentTab.prev().children()[0].click();
        }
        else { } //do nothing for now 
    }
}

AudioCommands = {
    "make :size (foot) container": MakeSizeContainer,
}

function MakeSizeContainer(size) {
    alert(size);
}