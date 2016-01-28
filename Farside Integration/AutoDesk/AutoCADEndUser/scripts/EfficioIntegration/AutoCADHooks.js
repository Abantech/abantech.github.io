var materialIndex = 0;

function EfficioAutoCADHelper(viewer) {
    self = this;
    self.viewer = viewer;

    this.AssetManagement = {
        CreateAsset: function (mesh, materialName) {
            if (!materialName) {
                materialName = 'Material' + materialIndex;
                materialIndex++;
            }

            self.viewer.impl.matman().addMaterial(materialName, mesh.material, true);

            // Add mesh to scene
            self.viewer.impl.scene.add(mesh);

            self.AssetManagement.UpdateScene();
        },

        RemoveAsset: function (mesh) {
            self.viewer.impl.scene.remove(mesh);
            self.AssetManagement.UpdateScene();
        },

        GetAssetByID(id) {
            return self.viewer.impl.scene.getObjectById(id);
        },

        UpdateScene: function () {
            // Update the viewer       
            self.viewer.impl.invalidate(true);
        },

        Transformer:
            {
                Translate: function (flagProxy, vec3) {
                    flagProxy.getAnimTransform();
                    flagProxy.position.copy(vec3);
                    flagProxy.updateAnimTransform();

                },

                Scale: function (flagProxy, vec3) {
                    flagProxy.getAnimTransform();
                    flagProxy.scale.copy(vec3);
                    flagProxy.updateAnimTransform();

                },

                Rotate: function (flagProxy, axis, deg) {
                    flagProxy.getAnimTransform();
                    flagProxy.quaternion.setFromAxisAngle(axis, THREE.Math.degToRad(deg));
                    flagProxy.updateAnimTransform();

                },
            },

        Descriptor:
            {
                Position: function (fragID) {
                    var mesh = self.viewer.impl.getRenderProxy(self.viewer.model, fragID);
                    self.viewer.impl.scene.updateMatrixWorld(true);
                    var position = new THREE.Vector3();
                    position.getPositionFromMatrix(mesh.matrixWorld);
                    return position;
                },

                Scale: function (fragProxy) {
                    fragProxy.updateAnimTransform();
                    return fragProxy.scale;

                },

                Rotation: function (fragProxy) {
                    fragProxy.updateAnimTransform();
                    return fragProxy.rotation;

                }
            },

        GetClosestFragmentToPoint: function (point) {
            point = new THREE.Vector3(point[0], point[1], point[2]);

            var result = {
                Distance: 0,
                Fragment: null,
            }

            var fragments = viewer3D.model.getData().fragments;

            for (var i = 0; i < fragments.length; i++) {
                var distance = new THREE.Vector3().subVectors(point, self.AssetManagement.Descriptor.Position(i)).length()

                if (!result.Fragment) {
                    result.Fragment = self.viewer.impl.getFragmentProxy(self.viewer.model, i);
                    result.Distance = distance;
                }
                else {
                    if (distance < result.Distance) {
                        result.Fragment = self.viewer.impl.getFragmentProxy(self.viewer.model, i);
                        result.Distance = distance;
                    }
                }
            }

            return result;
        },
    }

    this.Navigation = {
        Panning: {
            // 2 seems to be a good 'amount'
            PanLeft: function (amount) {
                self.Navigation.Panning.PanX(-amount);
            },

            // 2 seems to be a good 'amount'
            PanRight: function (amount) {
                self.Navigation.Panning.PanX(amount);
            },

            // 2 seems to be a good 'amount'
            PanUp: function (amount) {
                self.Navigation.Panning.PanY(amount);
            },

            // 2 seems to be a good 'amount'
            PanDown: function (amount) {
                self.Navigation.Panning.PanY(-amount);
            },
            PanX: function (amount) {
                self.viewer.navigation.getCamera().translateX(amount)
                self.viewer.impl.invalidate(true);
            },
            PanY: function (amount) {
                self.viewer.navigation.getCamera().translateY(amount)
                self.viewer.impl.invalidate(true);
            }

        },

        Rotation: {
            // .05 seems to be a good 'amount'
            RotateClockwise: function (amount) {
                self.Navigation.Rotation.Rotate(amount);
            },

            // .05 seems to be a good 'amount'
            RotateCounterClockwise: function (amount) {
                self.Navigation.Rotation.Rotate(-amount);
            },

            // .05 seems to be a good 'amount'
            Rotate: function (amount) {
                var pos = self.viewer.navigation.getPosition();

                var position = new THREE.Vector3(pos.x, pos.y, pos.z);

                var matrix = new THREE.Matrix4().makeRotationAxis(self.viewer.navigation.getWorldUpVector(), amount);

                position.applyMatrix4(matrix);

                self.viewer.navigation.setPosition(position);
            }
        },

        Zoom: {
            ZoomIn: function (amount) {
                self.Navigation.Zoom.Zoom(-amount);
            },

            ZoomOut: function (amount) {
                self.Navigation.Zoom.Zoom(amount)
            },

            Zoom: function (amount) {
                var pos = self.viewer.navigation.getPosition();
                var target = self.viewer.navigation.getTarget();

                self.viewer.navigation.dollyFromPoint(amount, target);
            }
        }
    },

    this.Tools = {
        Navigation: {
            // Options: orbit, pan, dolly, worldup, fov
            SetActiveNavigationTool: function (toolName) {
                if (!self.viewer.setActiveNavigationTool(toolName)) {
                    // TODO send error message
                }
            },

            GetActiveNavigationTool: function () {
                return self.viewer.getActiveNavigationTool();
            }
        },

        Model: {
            Model: self.viewer.model,

            SelectObject: function (objectName) {
                self.viewer.getObjectTree(function (objectTree) {
                    var obj = FindObject(objectName, objectTree.root)

                    if (obj) {
                        self.viewer.select(obj.dbId);
                    }
                });
            },

            IsolateObject: function (objectName) {
                self.viewer.getObjectTree(function (objectTree) {
                    var obj = FindObject(objectName, objectTree.root)

                    if (obj) {
                        self.viewer.isolate(obj.dbId);
                    }
                });
            },

            ClearSelection: function () {
                self.viewer.clearSelection();
                self.viewer.isolate();
            },

            GetMinAndMaxCoordinates: function () {
                // Get Scene mins and maxes
                var boundingBox = self.viewer.model.getBoundingBox();
                var maxpt = boundingBox.max;
                var minpt = boundingBox.min;

                return {
                    Minimums: [minpt.x, minpt.y, minpt.z],
                    Maximums: [maxpt.x, maxpt.y, maxpt.z]
                }
            }
        }
    }
};

function FindObject(objectName, node) {
    var object = [];

    if (node.children) {
        object = node.children.filter(function (child) {
            return child.name.toLowerCase() === objectName.toLowerCase();
        });
    }

    if (object.length != 0) {
        return object[0];
    }

    if (node.children) {
        node.children.forEach(function (child) {
            if (object.length == 0) {
                var tempObject = FindObject(objectName, child);

                if (tempObject) {
                    object = tempObject;
                }
            }
        });
    }

    return object;
}