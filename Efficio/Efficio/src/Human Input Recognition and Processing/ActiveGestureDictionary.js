define(function () {
    var ActiveGesturesDictionary = {}

    function RetrieveEntry(trackingType, gestureName, dictionary, subdictionary1, subdictionary2) {
        var entry;

        if (!ActiveGesturesDictionary[trackingType]) {
            ActiveGesturesDictionary[trackingType] = {};
        }

        if (dictionary) {
            if (!ActiveGesturesDictionary[trackingType][dictionary]) {
                ActiveGesturesDictionary[trackingType][dictionary] = {};
            }

            if (subdictionary1) {
                if (!ActiveGesturesDictionary[trackingType][dictionary][subdictionary1]) {
                    ActiveGesturesDictionary[trackingType][dictionary][subdictionary1] = {};
                }

                if (subdictionary2) {
                    if (!ActiveGesturesDictionary[trackingType][dictionary][subdictionary1][subdictionary2]) {
                        ActiveGesturesDictionary[trackingType][dictionary][subdictionary1][subdictionary2] = {};
                    }

                    entry = ActiveGesturesDictionary[trackingType][dictionary][subdictionary1][subdictionary2][gestureName];
                } else {
                    entry = ActiveGesturesDictionary[trackingType][dictionary][subdictionary1][gestureName];
                }
            }
            else {
                entry = ActiveGesturesDictionary[trackingType][dictionary][gestureName];
            }
        }
        else {
            if (ActiveGesturesDictionary[trackingType]) {
                entry = ActiveGesturesDictionary[trackingType][gestureName];
            }
        }

        return entry;
    }

    function AddEntry(entry, trackingType, gestureName, dictionary, subdictionary1, subdictionary2) {
        if (!ActiveGesturesDictionary[trackingType]) {
            ActiveGesturesDictionary[trackingType] = {};
        }

        if (dictionary) {
            if (!ActiveGesturesDictionary[trackingType][dictionary]) {
                ActiveGesturesDictionary[trackingType][dictionary] = {};
            }

            if (subdictionary1) {
                if (!ActiveGesturesDictionary[trackingType][dictionary][subdictionary1]) {
                    ActiveGesturesDictionary[trackingType][dictionary][subdictionary1] = {};
                }

                if (subdictionary2) {
                    if (!ActiveGesturesDictionary[trackingType][dictionary][subdictionary1][subdictionary2]) {
                        ActiveGesturesDictionary[trackingType][dictionary][subdictionary1][subdictionary2] = {};
                    }

                    ActiveGesturesDictionary[trackingType][dictionary][subdictionary1][subdictionary2][gestureName] = entry;
                }

                ActiveGesturesDictionary[trackingType][dictionary][subdictionary1][gestureName] = entry;
            }
            else {
                ActiveGesturesDictionary[trackingType][dictionary][gestureName] = entry;
            }
        }
        else {
            ActiveGesturesDictionary[trackingType][gestureName] = entry;
        }
    }

    function CreateOrUpdateEntry(trackingType, gestureName, dictionary, subdictionary1, subdictionary2) {
        var entry = RetrieveEntry(trackingType, gestureName, dictionary, subdictionary1, subdictionary2);

        if (!entry) {
            entry = {
                // Time properties
                StartTime: new Date(),
                EndTime: null,
                GestureDuration: function () {
                    var endTime = this.EndTime || new Date();

                    return Math.abs(this.StartTime - endTime)
                },

                // Fire count properties
                FireCount: 0,
                FirstFire: function () { return this.FireCount === 0 }
            }

            AddEntry(entry, trackingType, gestureName, dictionary, subdictionary1, subdictionary2);
        }
        else {
            entry.FireCount++;
        }

        return entry;
    }

    function DeleteEntry(trackingType, gestureName, dictionary, subdictionary1, subdictionary2) {
        var toDelete;

        if (!ActiveGesturesDictionary[trackingType]) {
            return;
        }

        if (dictionary) {
            if (ActiveGesturesDictionary[trackingType][dictionary]) {
                if (subdictionary1) {
                    if (ActiveGesturesDictionary[trackingType][dictionary][subdictionary1]) {
                        if (subdictionary2) {
                            if (ActiveGesturesDictionary[trackingType][dictionary][subdictionary1][subdictionary2]) {
                                toDelete = ActiveGesturesDictionary[trackingType][dictionary][subdictionary1][subdictionary2];
                            }
                        }
                        else {
                            toDelete = ActiveGesturesDictionary[trackingType][dictionary][subdictionary1];
                        }
                    }
                }
                else {
                    toDelete = ActiveGesturesDictionary[trackingType][dictionary];
                }
            }
        }
        else {
            toDelete = ActiveGesturesDictionary[trackingType];
        }

        if (gestureName && toDelete) {
            delete toDelete[gestureName];
        }
        else {
            delete toDelete;
        }
    }

    function DeleteAllBut(trackingType, gestureName, dictionary, subdictionary1, subdictionary2) {
        var toDelete;

        if (!ActiveGesturesDictionary[trackingType]) {
            return;
        }

        if (dictionary) {
            if (ActiveGesturesDictionary[trackingType][dictionary]) {
                if (subdictionary1) {
                    if (ActiveGesturesDictionary[trackingType][dictionary][subdictionary1]) {
                        if (subdictionary2) {
                            if (ActiveGesturesDictionary[trackingType][dictionary][subdictionary1][subdictionary2]) {
                                toDelete = ActiveGesturesDictionary[trackingType][dictionary][subdictionary1][subdictionary2];
                            }
                        }
                        else {
                            toDelete = ActiveGesturesDictionary[trackingType][dictionary][subdictionary1];
                        }
                    }
                }
                else {
                    toDelete = ActiveGesturesDictionary[trackingType][dictionary];
                }
            }
        }
        else {
            toDelete = ActiveGesturesDictionary[trackingType];
        }

        for(prop in toDelete){
            if (prop != gestureName){
                toDelete[prop] = null;
            }
        }
    }

    return {
        ActiveGesturesDictionary: ActiveGesturesDictionary,
        CreateOrUpdateEntry: CreateOrUpdateEntry,
        RetrieveEntry: RetrieveEntry,
        DeleteEntry: DeleteEntry,
        DeleteAllBut: DeleteAllBut
    }
});