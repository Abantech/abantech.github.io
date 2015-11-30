define(function () {
    var ActiveGesturesDictionary = {}

    function GetActiveGestureDictionary() {
        if (!ActiveGesturesDictionary) {
            ActiveGesturesDictionary == {};
        }

        return ActiveGesturesDictionary;
    }

    function RetrieveEntry(trackingType, gestureName, dictionary, subdictionary1, subdictionary2) {
        var entry;
        var agd = GetActiveGestureDictionary();

        if (dictionary) {
            if (!agd[trackingType][dictionary]) {
                agd[trackingType][dictionary] = {};
            }

            if (subdictionary1) {
                if (!agd[trackingType][dictionary][subdictionary1]) {
                    agd[trackingType][dictionary][subdictionary1] = {};
                }

                if (subdictionary2) {
                    if (!agd[trackingType][dictionary][subdictionary1][subdictionary2]) {
                        agd[trackingType][dictionary][subdictionary1][subdictionary2] = {};
                    }

                    entry = agd[trackingType][dictionary][subdictionary1][subdictionary2][gestureName];
                } else {
                    entry = agd[trackingType][dictionary][subdictionary1][gestureName];
                }
            }
            else {
                entry = agd[trackingType][dictionary][gestureName];
            }
        }
        else {
            if (agd[trackingType]) {
                entry = agd[trackingType][gestureName];
            }
        }

        return entry;
    }

    function AddEntry(entry, trackingType, gestureName, dictionary, subdictionary1, subdictionary2) {
        var agd = GetActiveGestureDictionary();

        if (!agd[trackingType]) {
            agd[trackingType] = {};
        }

        if (dictionary) {
            if (!agd[trackingType][dictionary]) {
                agd[trackingType][dictionary] = {};
            }

            if (subdictionary1) {
                if (!agd[trackingType][dictionary][subdictionary1]) {
                    agd[trackingType][dictionary][subdictionary1] = {};
                }

                if (subdictionary2) {
                    if (!agd[trackingType][dictionary][subdictionary1][subdictionary2]) {
                        agd[trackingType][dictionary][subdictionary1][subdictionary2] = {};
                    }

                    agd[trackingType][dictionary][subdictionary1][subdictionary2][gestureName] = entry;
                }

                agd[trackingType][dictionary][subdictionary1][gestureName] = entry;
            }
            else {
                agd[trackingType][dictionary][gestureName] = entry;
            }
        }
        else {
            agd[trackingType][gestureName] = entry;
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
        var agd = GetActiveGestureDictionary();
        var toDelete;

        if (!agd[trackingType]) {
            return;
        }

        if (dictionary) {
            if (agd[trackingType][dictionary]) {
                if (subdictionary1) {
                    if (agd[trackingType][dictionary][subdictionary1]) {
                        if (subdictionary2) {
                            if (agd[trackingType][dictionary][subdictionary1][subdictionary2]) {
                                toDelete = agd[trackingType][dictionary][subdictionary1][subdictionary2];
                            }
                        }
                        else {
                            toDelete = agd[trackingType][dictionary][subdictionary1];
                        }
                    }
                }
                else {
                    toDelete = agd[trackingType][dictionary];
                }
            }
        }
        else {
            toDelete = agd[trackingType];
        }

        if (gestureName && toDelete) {
            toDelete[gestureName] = null;
        }
        else {
            toDelete = null;
        }
    }

    function DeleteAllBut(trackingType, gestureName, dictionary, subdictionary1, subdictionary2) {
        var agd = GetActiveGestureDictionary();
        var toDelete;

        if (!agd[trackingType]) {
            return;
        }

        if (dictionary) {
            if (agd[trackingType][dictionary]) {
                if (subdictionary1) {
                    if (agd[trackingType][dictionary][subdictionary1]) {
                        if (subdictionary2) {
                            if (agd[trackingType][dictionary][subdictionary1][subdictionary2]) {
                                toDelete = agd[trackingType][dictionary][subdictionary1][subdictionary2];
                            }
                        }
                        else {
                            toDelete = agd[trackingType][dictionary][subdictionary1];
                        }
                    }
                }
                else {
                    toDelete = agd[trackingType][dictionary];
                }
            }
        }
        else {
            toDelete = agd[trackingType];
        }

        for(prop in toDelete){
            if (prop != gestureName){
                toDelete[prop] = null;
            }
        }
    }

    return {
        GetActiveGesturesDictionary: GetActiveGestureDictionary,
        CreateOrUpdateEntry: CreateOrUpdateEntry,
        RetrieveEntry: RetrieveEntry,
        DeleteEntry: DeleteEntry,
        DeleteAllBut: DeleteAllBut
    }
});