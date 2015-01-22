//This creates sliders that allow adjustment of the hand mesh wtihin the scene
//This should be generalized to craete the other 2-d controls like the pinwheel button

var xTranslation, yTranslation, zTranslation

function initializeAdjustmentHandlers(inputElementID, outputElementID, setterCallback) {
    setterCallback(parseInt(document.getElementById(inputElementID).value, 10));
    transformPlugin.position.set(xTranslation, yTranslation, zTranslation);
    document.getElementById(outputElementID).innerHTML = document.getElementById(inputElementID).value;

    document.getElementById(inputElementID).oninput = function (e) {
        var value = e.target.value;
        setterCallback(parseInt(value, 10));
        transformPlugin.position.set(xTranslation, yTranslation, zTranslation);
        document.getElementById(outputElementID).innerHTML = value;
    };
}

function createAdjuster(dimension, minValue, maxValue, initialValue, setterCallback) {
    var outputElementID = dimension + "positionOutput";
    var inputElementID = dimension + "positionInput";

    var newDiv = document.createElement("div");
    newDiv.style = "float: left;"
    newDiv.style.zIndex = "-1";
    var newLabel = document.createElement("label");
    newLabel.innerHTML = dimension + " offset: "

    var newOutputSpan = document.createElement("span");
    newOutputSpan.id = outputElementID
    newOutputSpan.innerHTML = initialValue;
    newLabel.appendChild(newOutputSpan);

    newDiv.appendChild(newLabel);
    newDiv.appendChild(document.createElement("br"));

    var newSlider = document.createElement("input");
    newSlider.id = inputElementID;
    newSlider.type = "range";
    newSlider.min = minValue;
    newSlider.max = maxValue;
    newSlider.step = 1;
    newSlider.value = initialValue;
    newDiv.appendChild(newSlider);

    document.body.appendChild(newDiv);

    initializeAdjustmentHandlers(inputElementID, outputElementID, setterCallback);
}

