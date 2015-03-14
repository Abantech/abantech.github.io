/// <reference path="../../Libs/THREEJS/three.js" />

var useRayCasterMethod = false;

function PinchGesture()
{
    this.options =
    {
        // Minimum distance between the two fingers to determine if pinch has been achieved
        distance: 150,

        // Minimum time of gesture for full gesture to be achieved
        delay: 0.3,

        // Indicates whether or not to scale the gesture distance with the zoom of the camera
        scaleWithScene: true,

        // Indicates which hand the pinch gesture applies to
        type: "right"
    };

    this.singleHandGesture = new SingleHandGesture();
    this.singleHandGesture.gestureOptions.delay = this.options.delay;
    this.singleHandGesture.gestureOptions.type = this.options.type;
    this.singleHandGesture.gestureAction = function(hand)
    {
        if (useRayCasterMethod)
        {
            //HACK: if either thumb or finger are extended the pinch will reset
            if (hand.indexFinger.extended || hand.thumb.extended)
            {
                this.addtionalOptions.distance = 100;
                return false;
            }
            else
            {
                var indexTipPos = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);
                var thumbTipPos = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);

                //HACK using 100 for now in case other values break other stuff
                //HACK For now, 100 means there was previously no pinch
                if (this.addtionalOptions.distance == 100)
                {
                    //This is the only one that works.
                    var rayCasterFromFinger = getRayCasterBetweenPoints(indexTipPos, thumbTipPos);

                    var intersections = getAssetIntersectionFromRaycaster(rayCasterFromFinger);
                    if (typeof (intersections) != "undefined" && intersections.length > 1)
                    {
                        console.log("ASSETS IN PINCH ZONE")

                        var intersectionPoints = getAssetIntersectionPoints(intersections);
                        //HACK: Assuming that point[0] is closer and point[1] is further but this may cause issues

                        if (intersectionPoints.length > 1) {
                            var allowableMargin = 10;

                            if (indexTipPos.distanceTo(intersectionPoints[0]) < allowableMargin) {
                                console.log("Pinch within range of INDEX")
                            }

                            if (thumbTipPos.distanceTo(intersectionPoints[1]) < allowableMargin) {
                                console.log("Pinch within range of THUMB")
                            }

                            if (indexTipPos.distanceTo(intersectionPoints[0]) < allowableMargin && thumbTipPos.distanceTo(intersectionPoints[1]) < allowableMargin) {
                                console.log("Pinch only in range of BOTH")
                                this.addtionalOptions.distance = intersectionPoints[0].distanceTo(intersectionPoints[1]);
                            }
                            else {
                                console.log("Pinch only in range of One finger")
                            }
                        }
                    }
                }

                var pinchDistance = this.addtionalOptions.distance + (allowableMargin * 2);

                // Scale distance between thumb and index
                if (this.addtionalOptions.scaleWithScene)
                {
                    pinchDistance = pinchDistance * transformPlugin.getScale().x;
                }

                var result = indexTipPos.distanceTo(thumbTipPos) <= pinchDistance;

                if (result)
                {
                    console.log("PINCH SUCCESS")
                }

                return result;
            }
        }
        else
        {
            var indexTipVector = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);
            var thumbTipVector = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);

            var pinchDistance = this.addtionalOptions.distance;

            // Scale distance between thumb and index
            if (this.addtionalOptions.scaleWithScene)
            {
                pinchDistance = pinchDistance * transformPlugin.getScale().x;
            }

            // Checks if the distance between the thumb and index meets the minimum requirement for the gesture.
            return hand.pinchStrength > 0.3 && indexTipVector.distanceTo(thumbTipVector) < pinchDistance;
        }
    }

    this.singleHandGesture.addtionalOptions = {
        scaleWithScene: this.options.scaleWithScene,
        distance: this.options.distance
    }

    this.action = this.singleHandGesture.action;

    // Set Options
    this.setDelay = function (delay)
    {
        this.options.delay = delay;
        this.singleHandGesture.gestureOptions.delay = delay;
    }

    this.setType = function (type)
    {
        this.options.type = type;
        this.singleHandGesture.gestureOptions.type = type;
    }

    // Set Addtional Options
    this.setDistance = function (distance)
    {
        this.options.distance = distance;
        this.singleHandGesture.addtionalOptions.distance = distance
    }

    this.setScaleWithScene = function (scaleWithScene)
    {
        this.options.scaleWithScene = scaleWithScene;
        this.singleHandGesture.addtionalOptions.scaleWithScene = scaleWithScene
    }

    // Code to register actions on the gesture
    this.registerOnGestureBegin = function (func)
    {
        this.singleHandGesture.registerOnGestureBegin(func);
    };

    this.registerOnFullGesture = function (func)
    {
        this.singleHandGesture.registerOnFullGesture(func);
    };

    this.registerOnFullGestureEnd = function (func)
    {
        this.singleHandGesture.registerOnFullGestureEnd(func);
    };

    this.registerOnGestureEnd = function (func)
    {
        this.singleHandGesture.registerOnGestureEnd(func);
    };
}

var rightHandPinchGesture = new PinchGesture();

var leftHandPinchGesture = new PinchGesture();
leftHandPinchGesture.setType("left");

var eitherHandPinchGesutre = new PinchGesture();
eitherHandPinchGesutre.setType("either");



var getAssetIntersectionFromRaycaster = function (rcaster) {
    var intersectionsOnAsset;

    for (var i = 0; i < window.scene.children.length; i++) {
        var sceneObject = window.scene.children[i];
        if (sceneObject.userData.isAsset && !assetManager.IsSelectedAsset(sceneObject)) {
            intersectionsOnAsset = rcaster.intersectObjects([sceneObject]);
            if (intersectionsOnAsset.length > 1) {
                return intersectionsOnAsset;
            }
        }
    }

    return intersectionsOnAsset;
}

function getPinchedObject(hand) {

    var foundObject = null;

    if (useRayCasterMethod)
    {
        var indexTipPos = (new THREE.Vector3()).fromArray(hand.fingers[1].tipPosition);
        var thumbTipPos = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);

        //This is the only one that works.
        var rayCasterFromFinger = getRayCasterBetweenPoints(indexTipPos, thumbTipPos);

        //var intersections = getAssetIntersectedByRaycaster(rayCasterFromFinger);
        //foundObject = intersections[0].object;

        //return foundObject;

        
        //This one never works
        var rayCasterFromThumb = getRayCasterBetweenPoints(thumbTipPos, indexTipPos);

        for (var i = 0; i < window.scene.children.length; i++) {
            var sceneObject = window.scene.children[i];
            if (sceneObject.userData.isAsset && !assetManager.IsSelectedAsset(sceneObject)) {

                if (rayCasterFromFinger.intersectObject(sceneObject).length == 1
                    //&& rayCasterFromThumb.intersectObject(sceneObject).length == 1
                    )
                {
                    console.log("Found pinched object " + sceneObject.id)
                    if (rayCasterFromThumb.intersectObject(sceneObject).length == 1)
                    {
                        console.log("INTERSECTED BY THUMB RAYCASTER!")
                    }
                    foundObject = sceneObject;
                    return foundObject;
                }

            }
        }
        
    }
    else
    {
        var indexTipVector = (new THREE.Vector3()).fromArray(hand.fingers[0].tipPosition);

        for (var i = 0; i < window.scene.children.length; i++) {
            var sceneObject = window.scene.children[i];
            if (sceneObject.userData.isAsset && !assetManager.IsSelectedAsset(sceneObject)) {
                var distance = indexTipVector.distanceTo(sceneObject.position);
                if (distance < 50) {
                    if (foundObject) {
                        if (distance < foundObject.distance) {
                            foundObject = sceneObject;
                            foundObject.distance = distance;
                        }
                    }
                    else {
                        foundObject = sceneObject;
                        foundObject.distance = distance;
                    }
                }
            }
        }
    }

    return foundObject;
}



function getRayCasterBetweenPoints(point0, point1)
{
    //var direction = new THREE.Vector3().subVectors(point0, point1).normalize();
    var direction = point1.sub(point0);
    return new THREE.Raycaster(point0, direction.normalize()); //, 0, direction.length());
}

function getAssetIntersectionPoints(intersections) {
    var intersectedObjects = {}
    var points = []
    if (intersections.length > 0) {
        for (var i = 0; i < intersections.length; i++) {
            if (!intersectedObjects[intersections[i].object.uuid]) {
                intersectedObjects[intersections[i].object.uuid] = {};
            }

            if (!intersectedObjects[intersections[i].object.uuid].point1) {
                intersectedObjects[intersections[i].object.uuid].point1 = intersections[i].point;
            }
            else {
                if (!intersectedObjects[intersections[i].object.uuid].point2) {
                    //this second check because sometimes the same point is returned for the same object
                    if (!intersectedObjects[intersections[i].object.uuid].point1.equals(intersections[i].point)) {
                        intersectedObjects[intersections[i].object.uuid].point2 = intersections[i].point;

                        //console.log("Assigning intersected points after two were found for asset with id: " + intersections[i].object.uuid)
                        points.push(intersectedObjects[intersections[i].object.uuid].point1)
                        points.push(intersectedObjects[intersections[i].object.uuid].point2)
                        return points;
                    }
                }
                else if (!intersectedObjects[intersections[i].object.uuid].point2.equals(intersections[i].point)) {
                    console.warn("Third intersection point detected, which one to use? Oh the horror!")
                }
                else {
                    console.warn("THIS SHOULD NEVER HAPPEN! CHECK THE LOGIC!!!")
                }
            }
        }
    }

    return points;
}