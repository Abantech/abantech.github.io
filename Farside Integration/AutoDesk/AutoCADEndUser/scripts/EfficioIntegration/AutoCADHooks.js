var materialIndex = 0;

function EfficioAutoCADHelper() {
    self = this;

    this.Initialize = function Initialize(viewer) {
        self.viewer = viewer;
    }

    this.AssetManagement = {
        CreateAsset: function (mesh, materialName) {
            if (!materialName) {
                materialName = 'Material' + materialIndex;
                materialIndex++;
            }

            self.viewer.impl.matman().addMaterial(materialName, mesh.material, true);

            // Add mesh to scene
            self.viewer.impl.scene.add(mesh);

            this.UpdateScene();
        },

        RemoveAsset: function (mesh) {
            self.viewer.impl.scene.remove(mesh);
            this.UpdateScene();
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
                Position: function (fragProxy) {
                    fragProxy.updateAnimTransform();
                    return fragProxy.position
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
                var fragProxy = self.viewer.impl.getFragmentProxy(self.viewer.model, i);
                var tempPosition = new THREE.Vector3();

                var distance = tempPosition.subVectors(point, self.AssetManagement.Descriptor.Position(fragProxy)).length()
                //drawMeshData(i, self.viewer);

                if (!result.Fragment) {
                    result.Fragment = fragProxy;
                    result.Distance = distance;
                }
                else {
                    if (distance < result.Distance) {
                        result.Fragment = fragProxy;
                        result.Distance = distance;
                    }
                }
            }

            return result;
        }
    }

    this.Navigation = {
        Panning: {
            // 2 seems to be a good 'amount'
            PanLeft: function (amount) {
                this.PanX(-amount);
            },

            // 2 seems to be a good 'amount'
            PanRight: function (amount) {
                this.PanX(amount);
            },

            // 2 seems to be a good 'amount'
            PanUp: function (amount) {
                this.PanY(amount);
            },

            // 2 seems to be a good 'amount'
            PanDown: function (amount) {
                this.PanY(-amount);
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
                this.Rotate(amount);
            },

            // .05 seems to be a good 'amount'
            RotateCounterClockwise: function (amount) {
                this.Rotate(-amount);
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
                this.Zoom(-amount);
            },

            ZoomOut: function (amount) {
                this.Zoom(amount)
            },

            Zoom: function (amount) {
                var pos = self.viewer.navigation.getPosition();
                var target = self.viewer.navigation.getTarget();

                self.viewer.navigation.dollyFromPoint(amount, target);
            }
        }
    }
};