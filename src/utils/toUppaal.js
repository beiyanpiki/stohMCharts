const randomString = (randomLen, min, max) => {
    let str = "", range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    if (randomLen) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}

const generateID = () => {
    return `${randomString(false, 8)}-${randomString(false, 4)}-${randomString(false, 4)}-${randomString(false, 4)}-${randomString(false, 12)}`
}

const test_data_a = {
    "cells": [{
        "position": {
            "x": 60, "y": 320
        }, "size": {
            "width": 180, "height": 86
        }, "view": "react-shape-view", "shape": "delay-unif", "id": "dae1165e-9beb-4d85-bb34-9931c43a014a", "data": {
            "title": "NEW STATE", "exp": "", "variable": "c", "a": 10, "b": 20, "composite": false
        }, "ports": {
            "groups": {
                "top": {
                    "position": "top", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "right": {
                    "position": "right", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "bottom": {
                    "position": "bottom", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "left": {
                    "position": "left", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }
            }, "items": [{
                "group": "top", "id": "093f87d4-3a07-498b-9426-52dfd051189b"
            }, {
                "group": "right", "id": "8645606e-b683-42fe-9ac3-45a0e21b59f3"
            }, {
                "group": "bottom", "id": "d19ad04c-36ed-45d3-bbc3-4e2da68be6dc"
            }, {
                "group": "left", "id": "cdd718e5-d747-42ce-bd4d-e71ca351e984"
            }]
        }, "zIndex": 1
    }, {
        "position": {
            "x": 344, "y": 320
        }, "size": {
            "width": 180, "height": 86
        }, "view": "react-shape-view", "shape": "delay-exp", "id": "07b3d3eb-6af4-4d95-ac45-ec54bed9dee4", "data": {
            "title": "NEW STATE", "exp": "", "variable": "c", "rate": 2, "composite": false
        }, "ports": {
            "groups": {
                "top": {
                    "position": "top", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "right": {
                    "position": "right", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "bottom": {
                    "position": "bottom", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "left": {
                    "position": "left", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }
            }, "items": [{
                "group": "top", "id": "ebfb6b49-4ae2-457f-91c0-02b00a773eb4"
            }, {
                "group": "right", "id": "84bbc50c-7b45-4d84-b10b-d2a9ef9976e4"
            }, {
                "group": "bottom", "id": "ef530fd4-3306-473a-bc2c-faaeb3c743bc"
            }, {
                "group": "left", "id": "6505897b-f37e-4937-b24e-2002513b2419"
            }]
        }, "zIndex": 2
    }, {
        "position": {
            "x": 639, "y": 320
        }, "size": {
            "width": 180, "height": 86
        }, "view": "react-shape-view", "shape": "delay-normal", "id": "113b140c-dfa9-4ca6-af49-1e96384d8fc2", "data": {
            "title": "NEW STATE", "exp": "", "variable": "v", "a": 10, "u": 5, "composite": false
        }, "ports": {
            "groups": {
                "top": {
                    "position": "top", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "right": {
                    "position": "right", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "bottom": {
                    "position": "bottom", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "left": {
                    "position": "left", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }
            }, "items": [{
                "group": "top", "id": "8ebe39f1-e75d-4cb1-a6c4-ddc5e7830a2d"
            }, {
                "group": "right", "id": "6593669e-bd6a-47c6-94df-f90110c35299"
            }, {
                "group": "bottom", "id": "ab08214f-c4ea-4cb4-a1c5-65850226e2fa"
            }, {
                "group": "left", "id": "656212b1-226b-49b4-b14c-98ea4e1a1083"
            }]
        }, "zIndex": 3
    }, {
        "position": {
            "x": 639, "y": 514
        }, "size": {
            "width": 180, "height": 86
        }, "view": "react-shape-view", "shape": "delay", "id": "e0327f75-2ca3-4470-adb3-43fe194c81fc", "data": {
            "title": "NEW STATE", "exp": "", "variable": "c", "t": 5, "composite": false
        }, "ports": {
            "groups": {
                "top": {
                    "position": "top", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "right": {
                    "position": "right", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "bottom": {
                    "position": "bottom", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "left": {
                    "position": "left", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }
            }, "items": [{
                "group": "top", "id": "88291e36-c470-41e5-b0bc-a16feac17472"
            }, {
                "group": "right", "id": "4a9e4d70-39f9-4f10-88f7-da345cb7d578"
            }, {
                "group": "bottom", "id": "6e883722-aec1-492b-ac16-ea7adc32b695"
            }, {
                "group": "left", "id": "e6a8a5b4-19fb-4686-b1d0-5ac4a68f8849"
            }]
        }, "zIndex": 4
    }, {
        "shape": "transition", "router": {
            "name": "metro"
        }, "connector": {
            "name": "rounded"
        }, "data": {
            "guard": "", "sync": "", "update": ""
        }, "id": "30565e2b-7bc5-4d91-94ad-816d002555b9", "source": {
            "cell": "dae1165e-9beb-4d85-bb34-9931c43a014a", "port": "8645606e-b683-42fe-9ac3-45a0e21b59f3"
        }, "target": {
            "cell": "07b3d3eb-6af4-4d95-ac45-ec54bed9dee4", "port": "6505897b-f37e-4937-b24e-2002513b2419"
        }, "zIndex": 5
    }, {
        "shape": "transition", "router": {
            "name": "metro"
        }, "connector": {
            "name": "rounded"
        }, "data": {
            "guard": "", "sync": "", "update": ""
        }, "id": "29f0fe87-4d17-4bc5-b6a8-f2f8bee0f58e", "source": {
            "cell": "07b3d3eb-6af4-4d95-ac45-ec54bed9dee4", "port": "84bbc50c-7b45-4d84-b10b-d2a9ef9976e4"
        }, "target": {
            "cell": "113b140c-dfa9-4ca6-af49-1e96384d8fc2", "port": "656212b1-226b-49b4-b14c-98ea4e1a1083"
        }, "zIndex": 6
    }, {
        "shape": "transition", "router": {
            "name": "metro"
        }, "connector": {
            "name": "rounded"
        }, "data": {
            "guard": "", "sync": "", "update": ""
        }, "id": "05acbb19-b621-4b87-82e1-8ae96c406489", "source": {
            "cell": "113b140c-dfa9-4ca6-af49-1e96384d8fc2", "port": "ab08214f-c4ea-4cb4-a1c5-65850226e2fa"
        }, "target": {
            "cell": "e0327f75-2ca3-4470-adb3-43fe194c81fc", "port": "88291e36-c470-41e5-b0bc-a16feac17472"
        }, "zIndex": 7
    }, {
        "position": {
            "x": 639, "y": 667
        }, "size": {
            "width": 180, "height": 86
        }, "view": "react-shape-view", "shape": "state", "id": "e82304cf-4ea9-46ec-b7a1-2d22961d10b4", "data": {
            "title": "NEW STATE", "exp": "", "inv": "", "composite": false
        }, "ports": {
            "groups": {
                "top": {
                    "position": "top", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "right": {
                    "position": "right", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "bottom": {
                    "position": "bottom", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "left": {
                    "position": "left", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }
            }, "items": [{
                "group": "top", "id": "4d4360ec-34d7-4e60-8a1d-c4790ec7fbec"
            }, {
                "group": "right", "id": "0cde881b-a818-4e06-89c6-9f6cbb3c4121"
            }, {
                "group": "bottom", "id": "f8835677-3e9c-4bcd-83d4-3f41a8e69c19"
            }, {
                "group": "left", "id": "45e866dc-757a-447d-87a5-f0cae9dbcfba"
            }]
        }, "zIndex": 8
    }, {
        "shape": "transition", "router": {
            "name": "metro"
        }, "connector": {
            "name": "rounded"
        }, "data": {
            "guard": "", "sync": "", "update": ""
        }, "id": "1c6e1262-a070-4ea4-94e7-10ba4192087d", "source": {
            "cell": "e0327f75-2ca3-4470-adb3-43fe194c81fc", "port": "6e883722-aec1-492b-ac16-ea7adc32b695"
        }, "target": {
            "cell": "e82304cf-4ea9-46ec-b7a1-2d22961d10b4", "port": "4d4360ec-34d7-4e60-8a1d-c4790ec7fbec"
        }, "zIndex": 9
    }, {
        "position": {
            "x": 947, "y": 700
        },
        "size": {
            "width": 20, "height": 20
        },
        "visible": true,
        "shape": "probability-node",
        "id": "60565c16-79d2-4c0d-bae1-3ff4b8dcb671",
        "data": {},
        "ports": {
            "groups": {
                "top": {
                    "position": "top", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "right": {
                    "position": "right", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "bottom": {
                    "position": "bottom", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "left": {
                    "position": "left", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }
            }, "items": [{
                "group": "top", "id": "9fec58db-8aee-4bd3-a550-ba5d4f88bf21"
            }, {
                "group": "right", "id": "a623f099-1acc-4f58-a998-4a40dc1ccb70"
            }, {
                "group": "bottom", "id": "6aacd9ad-c875-4b31-b1f0-ccf4e660972b"
            }, {
                "group": "left", "id": "7ad0a58b-b2c8-4453-bea2-34be5478949f"
            }]
        },
        "zIndex": 10
    }, {
        "position": {
            "x": 1099, "y": 514
        }, "size": {
            "width": 180, "height": 86
        }, "view": "react-shape-view", "shape": "state", "id": "0551cbd3-8a33-4b2d-82f3-f4bf2576f880", "data": {
            "title": "NEW STATE", "exp": "", "inv": "", "composite": false
        }, "ports": {
            "groups": {
                "top": {
                    "position": "top", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "right": {
                    "position": "right", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "bottom": {
                    "position": "bottom", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "left": {
                    "position": "left", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }
            }, "items": [{
                "group": "top", "id": "4d4360ec-34d7-4e60-8a1d-c4790ec7fbec"
            }, {
                "group": "right", "id": "0cde881b-a818-4e06-89c6-9f6cbb3c4121"
            }, {
                "group": "bottom", "id": "f8835677-3e9c-4bcd-83d4-3f41a8e69c19"
            }, {
                "group": "left", "id": "45e866dc-757a-447d-87a5-f0cae9dbcfba"
            }]
        }, "zIndex": 11
    }, {
        "position": {
            "x": 1099, "y": 800
        }, "size": {
            "width": 180, "height": 86
        }, "view": "react-shape-view", "shape": "state", "id": "acdefd6e-d723-4a43-9e64-de3b4c654073", "data": {
            "title": "NEW STATE", "exp": "", "inv": "", "composite": false
        }, "ports": {
            "groups": {
                "top": {
                    "position": "top", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "right": {
                    "position": "right", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "bottom": {
                    "position": "bottom", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "left": {
                    "position": "left", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }
            }, "items": [{
                "group": "top", "id": "4d4360ec-34d7-4e60-8a1d-c4790ec7fbec"
            }, {
                "group": "right", "id": "0cde881b-a818-4e06-89c6-9f6cbb3c4121"
            }, {
                "group": "bottom", "id": "f8835677-3e9c-4bcd-83d4-3f41a8e69c19"
            }, {
                "group": "left", "id": "45e866dc-757a-447d-87a5-f0cae9dbcfba"
            }]
        }, "zIndex": 12
    }, {
        "shape": "transition", "router": {
            "name": "metro"
        }, "connector": {
            "name": "rounded"
        }, "data": {
            "guard": "", "sync": "", "update": ""
        }, "id": "880e264a-e137-4674-8a20-ed3fad8d69d4", "source": {
            "cell": "e82304cf-4ea9-46ec-b7a1-2d22961d10b4", "port": "0cde881b-a818-4e06-89c6-9f6cbb3c4121"
        }, "target": {
            "cell": "60565c16-79d2-4c0d-bae1-3ff4b8dcb671", "port": "7ad0a58b-b2c8-4453-bea2-34be5478949f"
        }, "zIndex": 13
    }, {
        "shape": "probability-transition", "attrs": {
            "line": {
                "stroke": "#1890ff", "strokeDasharray": 5
            }
        }, "router": {
            "name": "metro"
        }, "connector": {
            "name": "rounded"
        }, "data": {
            "guard": "", "sync": "", "update": "", "weight": 13
        }, "id": "291c7891-f0d1-40a1-9a8b-376d9bed50e4", "source": {
            "cell": "60565c16-79d2-4c0d-bae1-3ff4b8dcb671", "port": "a623f099-1acc-4f58-a998-4a40dc1ccb70"
        }, "target": {
            "cell": "0551cbd3-8a33-4b2d-82f3-f4bf2576f880", "port": "45e866dc-757a-447d-87a5-f0cae9dbcfba"
        }, "zIndex": 14
    }, {
        "shape": "probability-transition", "attrs": {
            "line": {
                "stroke": "#1890ff", "strokeDasharray": 5
            }
        }, "router": {
            "name": "metro"
        }, "connector": {
            "name": "rounded"
        }, "data": {
            "guard": "", "sync": "", "update": "", "weight": 38
        }, "id": "5b7fed3a-05f8-4087-aa4f-6fa1ab64b353", "source": {
            "cell": "60565c16-79d2-4c0d-bae1-3ff4b8dcb671", "port": "9fec58db-8aee-4bd3-a550-ba5d4f88bf21"
        }, "target": {
            "cell": "acdefd6e-d723-4a43-9e64-de3b4c654073", "port": "45e866dc-757a-447d-87a5-f0cae9dbcfba"
        }, "zIndex": 15
    }], "roots": [{
        "position": {
            "x": 60, "y": 320
        }, "size": {
            "width": 180, "height": 86
        }, "view": "react-shape-view", "shape": "delay-unif", "id": "dae1165e-9beb-4d85-bb34-9931c43a014a", "data": {
            "title": "NEW STATE", "exp": "", "variable": "c", "a": 10, "b": 20, "composite": false
        }, "ports": {
            "groups": {
                "top": {
                    "position": "top", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "right": {
                    "position": "right", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "bottom": {
                    "position": "bottom", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }, "left": {
                    "position": "left", "attrs": {
                        "circle": {
                            "r": 8, "magnet": true, "stroke": "#5F95FF", "strokeWidth": 2, "fill": "#fff", "style": {
                                "visibility": "hidden"
                            }
                        }
                    }
                }
            }, "items": [{
                "group": "top", "id": "093f87d4-3a07-498b-9426-52dfd051189b"
            }, {
                "group": "right", "id": "8645606e-b683-42fe-9ac3-45a0e21b59f3"
            }, {
                "group": "bottom", "id": "d19ad04c-36ed-45d3-bbc3-4e2da68be6dc"
            }, {
                "group": "left", "id": "cdd718e5-d747-42ce-bd4d-e71ca351e984"
            }]
        }, "zIndex": 1
    }]
}

class Graph {
    constructor() {
        this.vertices = []; // Save ID
        this.data = new Map()  // for node, {id: data, shape}; for edge, {id: data, shape, target}
        this.adjList = new Map(); // {id: [edge_id1, edge_id2]}

        this.roots = []
    }

    add_vertices(id, shape, data) {
        this.vertices.push(id)
        this.data.set(id, {shape, data})
        this.adjList.set(id, [])
    }

    add_edge(id, shape, data, source, target) {
        this.adjList.get(source).push(id)
        this.data.set(id, {shape, data, target})
    }

    loadData(data) {
        let nodes = [], edges = []
        data.cells.forEach((cell) => {
            if (cell.shape === 'transition' || cell.shape === 'probability-transition') {
                edges.push(cell)
            } else {
                nodes.push(cell)
            }
        })

        nodes.forEach(({id, shape, data}) => {
            this.add_vertices(id, shape, data)
        })
        edges.forEach(({id, shape, data, source, target}) => {
            this.add_edge(id, shape, data, source.cell, target.cell)
        })

        data.roots.forEach(({id}) => {
            this.roots.push(id)
        })
    }
}

const convert = (data) => {
    let G = new Graph(), A = new Graph()
    const convertNode = (node_id) => {
        const node_data = G.data.get(node_id)
        // If node is not exist, create it.
        if (!A.vertices.includes(node_id)) {
            A.add_vertices(node_id, node_data.shape === 'probability-node' ? 'branch' : 'location', {
                title: node_data.data.title, invariant: "", rate_exp: ""
            })
        }
        const edges = G.adjList.get(node_id)
        edges.forEach((edge_id) => {
            const edge_data = G.data.get(edge_id)
            const target_id = edge_data.target

            // If target node is not exist, create it.
            const target_data = G.data.get(target_id)
            if (!A.vertices.includes(target_id)) {
                A.add_vertices(target_id, target_data.shape === 'probability-node' ? 'branch' : 'location', {
                    title: target_data.data.title, invariant: "", rate_exp: ""
                })
            }
            // Link source to target
            if (node_data.shape !== 'delay') {
                if (node_data.shape === 'probability-node') {
                    A.add_edge(edge_id, 'prob-transition', {
                        update: edge_data.data.update,
                        sync: edge_data.data.sync,
                        weight: edge_data.data.weight
                    }, node_id, target_id)
                } else {
                    A.add_edge(edge_id, 'transition', {
                        guard: edge_data.data.guard,
                        sync: edge_data.data.sync,
                        update: edge_data.data.update
                    }, node_id, target_id)
                }

            }

            // DelayUnif(a, b)
            if (node_data.shape === 'delay-unif') {
                // Algorithm 1: Line 7
                const {variable, a, b} = node_data.data
                const node_data_raw = A.data.get(node_id)
                A.data.set(node_id, {
                    ...node_data_raw, data: {
                        ...node_data_raw.data, invariant: `${variable} <= ${b}`
                    }
                })

                const edge_data_raw = A.data.get(edge_id)
                A.data.set(edge_id, {
                    ...edge_data_raw, data: {
                        ...edge_data_raw.data, guard: `${variable} >= ${a}`
                    }
                })
            }
            // DelayExp(rate)
            if (node_data.shape === 'delay-exp') {
                // Algorithm 1: Line 8
                const {rate} = node_data.data
                const node_data_raw = A.data.get(node_id)
                A.data.set(node_id, {
                    ...node_data_raw, data: {
                        ...node_data_raw.data, rate_exp: rate
                    },
                })
            }
            // Delay(t)
            if (node_data.shape === 'delay') {
                // Algorithm 1: Line 9
                // Create New Node and Link node
                const new_node_id = generateID()
                A.add_vertices(new_node_id, 'location', {
                    title: '', invariant: `${node_data.data.variable} <= ${node_data.data.t}`, rate_exp: ''
                })
                const new_edge_1 = generateID();
                A.add_edge(new_edge_1, 'transition', {
                    guard: '', sync: '', update: `${node_data.data.variable} = 0`
                }, node_id, new_node_id)
                A.add_edge(edge_id, 'transition', {

                    guard: `${node_data.data.variable} == ${node_data.data.t}`,
                    sync: edge_data.data.sync,
                    update: edge_data.data.update
                }, new_node_id, target_id)
            }
            // Normal(a, u)
            if (node_data.shape === 'normal') {
                // Algorithm 1: Line 10
                const {variable, a, u} = node_data.data
                const edge_data_raw = A.data.get(edge_id)
                A.data.set(edge_id, {
                    ...edge_data_raw, data: {
                        ...edge_data_raw.data, update: `${variable} = Norm(${a}, ${u})`
                    }
                })
            }
            // Probability
            if (node_data.shape === 'probability-node') {
                // Algorithm 1: Line 13
                const my_prob = edge_data.data.weight
                let sum_prob = 0
                edges.forEach((edge) => {
                    const ed = G.data.get(edge)
                    if (ed.shape === 'probability-transition') {
                        sum_prob += ed.data.weight
                    }
                })
                const prob = my_prob / sum_prob
                const edge_data_raw = A.data.get(edge_id)
                A.data.set(edge_id, {
                    ...edge_data_raw, data: {
                        ...edge_data_raw.data, weight: prob
                    }
                })
            }
            convertNode(target_id)
        })
    }
    G.loadData(data)
    G.roots.forEach((root_id) => {
        convertNode(root_id)
    })

    return {
        vertices: A.vertices, data: A.data, adjList: A.adjList,
    }
}
const baseXML = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE nta PUBLIC '-//Uppaal Team//DTD Flat System 1.1//EN' 'http://www.it.uu.se/research/group/darts/uppaal/flat-1_2.dtd'>
<nta>
\t<declaration>// Place global declarations here.</declaration>
\t<template>
\t\t<name>Empty Template</name>
\t\t<declaration>// Place local declarations here.</declaration>
\t</template>
\t<system>// Place template instantiations here.
Process = Template();
// List one or more processes to be composed into a system.
system Process;
    </system>
\t<queries>
\t\t<query>
\t\t\t<formula></formula>
\t\t\t<comment></comment>
\t\t</query>
\t</queries>
</nta>`


const xml2js = require('xml-js');

const data = convert(test_data_a)

const toUppaalXML = (data) => {
    console.log(data)
    let result1 = xml2js.xml2js(baseXML, {compact: true});
    result1.nta.template = []
    let x = 0, y = 0;
    const tpl = {
        name: {_text: 'Template'},
        declaration: {_text: '// Place local declarations here.'},
        location: [],
        branchpoint: [],
        init: {},
        transition: []
    }
    // Add location and branchpoint
    data.vertices.forEach((node_id) => {
        x += 100;
        y += 0;
        const node_data = data.data.get(node_id)
        const node_shape = node_data.shape
        // Insert node
        let obj = {
            _attributes: {id: node_id, x: x, y: y},
        }
        if (node_shape === 'location') {
            const {title, invariant, rate_exp} = node_data.data
            if (title !== "") {
                obj.name = {
                    _attributes: {x: x, y: y + 20,}, _text: title
                }
            }
            if (invariant !== "" || rate_exp !== "") {
                obj.label = []
                if (invariant !== "") {
                    obj.label.push({_attributes: {kind: "invariant", x: x, y: y + 40}, _text: invariant})
                }
                if (rate_exp !== "") {
                    obj.label.push({_attributes: {kind: "exponentialrate", x: x, y: y + 60}, _text: `${rate_exp}`})
                }
            }
            tpl.location.push(obj)
        } else if (node_shape === 'branch') {
            tpl.branchpoint.push(obj)
        }
        // Insert edge
        const source_id = node_id
        const edges = data.adjList.get(node_id)
        edges.forEach((edge_id) => {
            const edge_data = data.data.get(edge_id)
            obj = {
                source: {_attributes: {ref: source_id}},
                target: {_attributes: {ref: edge_data.target}},
                label: []
            }
            if (edge_data.shape === 'transition') {
                const {guard, sync, update} = edge_data.data
                if (guard !== "") {
                    obj.label.push({
                        _attributes: {kind: "guard", x: x + 50, y: y + 10},
                        _text: guard
                    })
                }
                if (sync !== "") {
                    obj.label.push({
                        _attributes: {kind: "sync", x: x + 50, y: y + 20},
                        _text: sync
                    })
                }
                if (update !== "") {
                    obj.label.push({
                        _attributes: {kind: "update", x: x + 50, y: y + 30},
                        _text: update
                    })
                }
            } else if (edge_data.shape === 'prob-transition') {
                const {update, sync, weight} = edge_data.data
                if (weight !== "") {
                    obj.label.push({
                        _attributes: {kind: "probability", x: x + 50, y: y + 10},
                        _text: `${weight}`
                    })
                }
                if (sync !== "") {
                    obj.label.push({
                        _attributes: {kind: "sync", x: x + 50, y: y + 20},
                        _text: sync
                    })
                }
                if (update !== "") {
                    obj.label.push({
                        _attributes: {kind: "update", x: x + 50, y: y + 30},
                        _text: update
                    })
                }
            }
            tpl.transition.push(obj)
        })
    })
    tpl.init = {_attributes: {ref: data.vertices[0]}}

    result1.nta.template.push(tpl)
    const newXml = xml2js.js2xml(result1, {compact: true})
    const fileSave = require('file-save')
    fileSave('./new.xml').write(newXml, 'utf-8')
}

toUppaalXML(data)