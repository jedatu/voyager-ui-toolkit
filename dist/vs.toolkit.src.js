var vs;
(function (vs) {
    var tools;
    (function (tools) {
        'use strict';
        var Config = (function () {
            /** @ngInject */
            function Config($logProvider) {
                // enable log
                $logProvider.debugEnabled(true);
                // set options third-party lib
            }
            return Config;
        }());
        tools.Config = Config;
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        'use strict';
        var RunBlock = (function () {
            /** @ngInject */
            function RunBlock($log) {
                $log.debug('runBlock end');
            }
            return RunBlock;
        }());
        tools.RunBlock = RunBlock;
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

/// <reference path="../.tmp/typings/tsd.d.ts" />
/// <reference path="index.config.ts" />
/// <reference path="index.run.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        'use strict';
        angular.module('vs.tools', [])
            .config(tools.Config)
            .run(tools.RunBlock)
            .constant('config', config);
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var catalog;
        (function (catalog) {
            'use strict';
            angular.module('vs.tools.catalog', []);
        })(catalog = tools.catalog || (tools.catalog = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.catalog').
    /* @ngInject */
    factory('catalogResource', function ($http, $q) {
    'use strict';
    var uri = config.root + 'api/rest/index/config/federation.json';
    var locations = 'api/rest/i18n/field/location.json';
    function _fetch() {
        return $http.get(uri).then(function (res) {
            return res.data.servers;
        }, function (error) {
            console.log(error);
            return error;
        });
    }
    function _loadRemoteLocations(params) {
        return _fetch().then(function (catalogs) {
            var promises = [];
            catalogs.forEach(function (catalog) {
                if (angular.isDefined(catalog.url)) {
                    var url = catalog.url + locations;
                    var catalogPromise = $http.get(url, { withCredentials: false }).then(function (response) {
                        return response;
                    });
                    promises.push(catalogPromise);
                }
            });
            return $q.all(promises).then(function (res) {
                return res;
            }, function (error) {
                return error; // failure means the remote catalogs are offline, allow to continue, the search should show an error
            });
        });
    }
    return {
        fetch: _fetch,
        loadRemoteLocations: _loadRemoteLocations
    };
});

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var displayConfig;
        (function (displayConfig) {
            'use strict';
            angular.module('vs.tools.displayConfig', []);
        })(displayConfig = tools.displayConfig || (tools.displayConfig = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.displayConfig').
    /* @ngInject */
    factory('displayConfigResource', function ($http) {
    'use strict';
    var configUri = config.root + 'api/rest/display/config/';
    function _getListQueryString() {
        var queryString = configUri + 'list';
        queryString += '?rand=' + Math.random();
        return queryString;
    }
    function _getConfigQueryString(id) {
        var queryString = configUri + id;
        queryString += '?rand=' + Math.random();
        return queryString;
    }
    function _getDisplayConfigList() {
        return $http.get(_getListQueryString()).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _getDisplayConfig(id) {
        return $http.get(_getConfigQueryString(id)).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _deleteDisplayConfig(id) {
        return $http.delete(_getConfigQueryString(id)).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _saveDisplayConfig(template) {
        return $http.post(configUri, template).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    return {
        getDisplayConfigs: function () {
            return _getDisplayConfigList();
        },
        getDisplayConfig: function (id) {
            return _getDisplayConfig(id);
        },
        deleteDisplayConfig: function (id) {
            return _deleteDisplayConfig(id);
        },
        saveDisplayConfig: function (template) {
            return _saveDisplayConfig(template);
        }
    };
});

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var filters;
        (function (filters) {
            'use strict';
            angular.module('vs.tools.filters', [])
                .filter('replaceString', function () {
                return function (hayStack, oldNeedle, newNeedle) {
                    return hayStack.replace(new RegExp(oldNeedle, 'g'), newNeedle);
                };
            });
        })(filters = tools.filters || (tools.filters = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var util;
        (function (util) {
            'use strict';
            var Sugar = (function () {
                function Sugar(config, $http) {
                    this.config = config;
                    this.$http = $http;
                }
                Sugar.isString = function (val) {
                    return (typeof val === 'string' || val instanceof String);
                };
                Sugar.getInstance = function (config, $http) {
                    return new Sugar(config, $http);
                };
                Sugar.prototype.toMap = function (key, array) {
                    var map = {};
                    array.forEach(function (value) {
                        map[value[key]] = value;
                    });
                    return map;
                };
                Sugar.prototype.toStringMap = function (array) {
                    var map = {};
                    array.forEach(function (value) {
                        map[value] = value;
                    });
                    return map;
                };
                Sugar.prototype.pluck = function (array, name, fn) {
                    var fl = [];
                    array.forEach(function (value) {
                        if (fn && fn(value)) {
                            fl.push(value[name]);
                        }
                        else if (angular.isUndefined(fn)) {
                            fl.push(value[name]);
                        }
                    });
                    return fl;
                };
                Sugar.prototype.postForm = function (url, data) {
                    var service = this.config.root + url;
                    return this.$http({
                        method: 'POST',
                        url: service,
                        data: data,
                        withCredentials: true,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
                };
                Sugar.prototype.parseQueryString = function (queryString) {
                    var pairs = queryString.slice(1).split('&');
                    var result = {}, s;
                    pairs.forEach(function (pair) {
                        s = pair.split('=');
                        result[s[0]] = decodeURIComponent(s[1] || '');
                    });
                    return JSON.parse(JSON.stringify(result));
                };
                Sugar.prototype.postJson = function (request, api, action) {
                    return this.$http({
                        method: 'POST',
                        url: config.root + 'api/rest/' + api + '/' + action + '.json',
                        data: request,
                        headers: { 'Content-Type': 'application/json' }
                    });
                };
                return Sugar;
            }());
            util.Sugar = Sugar;
        })(util = tools.util || (tools.util = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

/// <reference path="../../.tmp/typings/tsd.d.ts" />
/// <reference path="../util/sugar.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var fields;
        (function (fields_1) {
            'use strict';
            var FieldsResource = (function () {
                /* @ngInject */
                function FieldsResource(sugar) {
                    var _this = this;
                    this.sugar = sugar;
                    this.fetch = function (fields) {
                        var fl = (fields || 'name,stype,category,docs,disp_en,sortable,filterable,tableable,displayable,editable');
                        return sugar.postForm('solr/fields/select?rand=' + Math.random(), _this.getFieldsParams(fl)).then(function (res) {
                            _this.ensureTagsFieldExist(res.data.response.docs);
                            return res.data.response.docs;
                        });
                    };
                    this.ensureTagsFieldExist = function (fields) {
                        var found = false;
                        for (var i = fields.length - 1; i >= 0; i--) {
                            if (fields[i].name === 'tag_tags') {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            fields.push({
                                category: 'TEXT',
                                disp_en: 'Tags',
                                displayable: true,
                                docs: 0,
                                filterable: true,
                                name: 'tag_tags',
                                sortable: false,
                                stype: 'string',
                                tableable: false
                            });
                        }
                    };
                    this.fetchHydrationStats = function (query) {
                        return _this.fetch().then(function (fields) {
                            var fl = sugar.pluck(fields, 'name', function (field) { return field.name.indexOf('_') !== 0 && field.docs > 0; });
                            return sugar.postForm('solr/v0/select?' + query, _this.getStatsParams(fl)).then(function (res) {
                                var statsFields = res.data.facet_counts.facet_fields;
                                var total = res.data.response.numFound;
                                _this.applyHydration(statsFields, fields, total);
                                return fields;
                            });
                        });
                    };
                }
                FieldsResource.prototype.getFieldsParams = function (fl) {
                    return 'q=*:*&fl=' + fl + '&rows=10000&sort=name%20asc&wt=json&rand=' + Math.random();
                };
                FieldsResource.prototype.getStatsParams = function (fl) {
                    return 'facet=true&facet.limit=10000&facet.mincount=100&rows=0&wt=json&facet.field=' + fl.join('&facet.field=') + '&rand=' + Math.random();
                };
                FieldsResource.prototype.applyHydration = function (statsFields, fields, total) {
                    var statsField, count;
                    for (var i = 0; i < fields.length; i++) {
                        statsField = statsFields[fields[i].name];
                        if (statsField && statsField.length > 0) {
                            fields[i].id = fields[i].name;
                            count = this.getCount(statsField);
                            fields[i].hydration = count / total * 100;
                        }
                    }
                    return i;
                };
                FieldsResource.prototype.getCount = function (field) {
                    var count = 0;
                    for (var i = 1; i < field.length; i += 2) {
                        count += field[i];
                    }
                    return count;
                };
                FieldsResource.refName = 'fieldsResource';
                return FieldsResource;
            }());
            fields_1.FieldsResource = FieldsResource;
        })(fields = tools.fields || (tools.fields = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

/// <reference path="../../.tmp/typings/tsd.d.ts" />
/// <reference path="./fields.resource.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var fields;
        (function (fields) {
            'use strict';
            angular.module('vs.tools.fields', ['vs.tools.util'])
                .service(fields.FieldsResource.refName, fields.FieldsResource);
        })(fields = tools.fields || (tools.fields = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var savedSearch;
        (function (savedSearch) {
            'use strict';
            angular.module('vs.tools.savedSearch', ['vs.tools.util']);
        })(savedSearch = tools.savedSearch || (tools.savedSearch = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.savedSearch').
    /* @ngInject */
    factory('savedSearchResource', function ($http, sugar) {
    'use strict';
    function _doSave(savedSearch) {
        return sugar.postJson(savedSearch, 'display', 'ssearch');
    }
    function _getQueryString(id) {
        var rows = 150; // @TODO set to what we really want
        var queryString = config.root + 'solr/ssearch/select?';
        queryString += 'rows=' + rows + '&rand=' + Math.random();
        queryString += '&fl=id,title,description,owner,path,share,query,config,order,saved,private,view,_version_,config_title:[configTitle],param*,labels';
        queryString += '&wt=json&json.wrf=JSON_CALLBACK';
        if (angular.isDefined(id)) {
            queryString += '&fq=id:' + id;
        }
        return queryString;
    }
    function _execute(id) {
        return $http.jsonp(_getQueryString(id)).then(function (data) {
            return data.data.response.docs;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    return {
        getSavedSearches: function () {
            return _execute();
        },
        fetch: function (id) {
            return _execute(id).then(function (docs) {
                return docs[0];
            });
        },
        saveSearch: function (savedSearch, params) {
            //  savedSearch.config = configService.getConfigId();
            //  savedSearch.query = converter.toClassicParams(params);
            return _doSave(savedSearch);
        },
        deleteSearch: function (id) {
            return $http.delete(config.root + 'api/rest/display/ssearch/' + id).then(function () {
                // observers.forEach(function (entry) {
                //   entry(id);
                // });
            });
        },
        wipe: function () {
            return $http.delete(config.root + 'api/rest/display/ssearch/wipe');
        },
        restore: function () {
            return sugar.postForm('api/rest/display/restore', '');
        },
        order: function (id, beforeId, afterId) {
            var data = '';
            if (beforeId !== null) {
                data += 'before=' + beforeId;
            }
            if (data !== '') {
                data += '&';
            }
            if (afterId !== null) {
                data += 'after=' + afterId;
            }
            // return sugar.postForm('api/rest/display/ssearch/' + id + '/order', data);
        },
        fetchLabels: function () {
            var url = config.root + 'solr/ssearch/select?rows=0&facet=true&facet.field=labels&wt=json&r=' + new Date().getTime();
            return $http.get(url).then(function (resp) {
                return resp.data.facet_counts.facet_fields.labels;
            }, function () {
                return [];
            });
        }
    };
});

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var translate;
        (function (translate) {
            'use strict';
            var Translator = (function () {
                /* @ngInject */
                function Translator(config, $http, $q) {
                    var _this = this;
                    this.config = config;
                    this.$http = $http;
                    this.$q = $q;
                    this.fields = null;
                    this.removePrefixHash = {};
                    var removePrefixList = ['fs_', 'ft_', 'fh_', 'fi_', 'fl_', 'fd_', 'ff_', 'fu_', 'fp_', 'fy_', 'fm_', 'fb_', 'tag_', 'meta_', 'fss_'];
                    removePrefixList.forEach(function (item) {
                        _this.removePrefixHash[item] = true;
                        var c = item.substring(1, 2);
                        var key = item.replace('_', c + '_');
                        _this.removePrefixHash[key] = true;
                    });
                }
                Translator.prototype.load = function () {
                    var _this = this;
                    var resourceUrl = this.config.root + 'api/rest/i18n/fields/standard.json';
                    if (!this.fields) {
                        return this.$http.get(resourceUrl).then(function (res) {
                            _this.fields = res.data;
                            return res.data;
                        });
                    }
                    else {
                        return this.$q.when();
                    }
                };
                Translator.prototype.translateField = function (field) {
                    var idx = field.indexOf('_');
                    if (idx > -1) {
                        var prefix = field.substring(0, idx + 1);
                        if (this.removePrefixHash[prefix]) {
                            field = field.replace(prefix, '');
                        }
                    }
                    var translated = this.fields.FIELD[field];
                    if (angular.isDefined(translated)) {
                        return translated;
                    }
                    else {
                        return this.classify(field);
                    }
                };
                Translator.prototype.classify = function (str) {
                    str = str.replace(/_/g, ' ');
                    return str.replace(/\w\S*/g, function (txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    });
                };
                return Translator;
            }());
            translate.Translator = Translator;
        })(translate = tools.translate || (tools.translate = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

/// <reference path="translator.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var translate;
        (function (translate) {
            'use strict';
            angular.module('vs.tools.translate', [])
                .factory('translator', function (config, $http, $q) { return new translate.Translator(config, $http, $q); })
                .constant('config', config);
        })(translate = tools.translate || (tools.translate = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

/// <reference path="sugar.ts" />
var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var util;
        (function (util) {
            'use strict';
            angular.module('vs.tools.util', [])
                .factory('sugar', function (config, $http) { return util.Sugar.getInstance(config, $http); });
        })(util = tools.util || (tools.util = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImNhdGFsb2cvQ2F0YWxvZ01vZHVsZS50cyIsImNhdGFsb2cvQ2F0YWxvZ1Jlc291cmNlLnRzIiwiZGlzcGxheS1jb25maWcvRGlzcGxheUNvbmZpZ01vZHVsZS50cyIsImRpc3BsYXktY29uZmlnL0Rpc3BsYXlDb25maWdSZXNvdXJjZS50cyIsImZpbHRlcnMvZmlsdGVycy50cyIsInV0aWwvc3VnYXIudHMiLCJmaWVsZHMvZmllbGRzLnJlc291cmNlLnRzIiwiZmllbGRzL2ZpZWxkcy5tb2R1bGUudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWQtc2VhcmNoLW1vZHVsZS50cyIsInNhdmVkLXNlYXJjaC9zYXZlZFNlYXJjaC5yZXNvdXJjZS50cyIsInRyYW5zbGF0ZS90cmFuc2xhdG9yLnRzIiwidHJhbnNsYXRlL3RyYW5zbGF0ZS5tb2R1bGUudHMiLCJ1dGlsL3V0aWwubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sRUFBRSxDQVlSO0FBWkQsV0FBTyxFQUFFO0lBQUMsSUFBQSxLQUFLLENBWWQ7SUFaUyxXQUFBLEtBQUssRUFBQyxDQUFDO1FBQ2YsWUFBWSxDQUFDO1FBRWI7WUFDRSxnQkFBZ0I7WUFDaEIsZ0JBQVksWUFBNkI7Z0JBQ3ZDLGFBQWE7Z0JBQ2IsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEMsOEJBQThCO1lBQ2hDLENBQUM7WUFFSCxhQUFDO1FBQUQsQ0FSQSxBQVFDLElBQUE7UUFSWSxZQUFNLFNBUWxCLENBQUE7SUFDSCxDQUFDLEVBWlMsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBWWQ7QUFBRCxDQUFDLEVBWk0sRUFBRSxLQUFGLEVBQUUsUUFZUjs7QUNaRCxJQUFPLEVBQUUsQ0FVUjtBQVZELFdBQU8sRUFBRTtJQUFDLElBQUEsS0FBSyxDQVVkO0lBVlMsV0FBQSxLQUFLLEVBQUMs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QUFTLEVBQUMsQ0FBQztZQUN6QixZQUFZLENBQUM7WUFJYixPQUFPLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsQ0FBQztpQkFFckMsT0FBTyxDQUFDLFlBQVksRUFBRSxVQUFDLE1BQVcsRUFBRSxLQUFzQixFQUFFLEVBQWdCLElBQUssT0FBQSxJQUFJLG9CQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBakMsQ0FBaUMsQ0FBQztpQkFDbkgsUUFBUSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoQyxDQUFDLEVBVGUsU0FBUyxHQUFULGVBQVMsS0FBVCxlQUFTLFFBU3hCO0lBQUQsQ0FBQyxFQVRTLEtBQUssR0FBTCxRQUFLLEtBQUwsUUFBSyxRQVNkO0FBQUQsQ0FBQyxFQVRNLEVBQUUsS0FBRixFQUFFLFFBU1I7O0FDVkQsaUNBQWlDO0FBQ2pDLElBQU8sRUFBRSxDQU1SO0FBTkQsV0FBTyxFQUFFO0lBQUMsSUFBQSxLQUFLLENBTWQ7SUFOUyxXQUFBLEtBQUs7UUFBQyxJQUFBLElBQUksQ0FNbkI7UUFOZSxXQUFBLElBQUksRUFBQyxDQUFDO1lBQ3BCLFlBQVksQ0FBQztZQUViLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQztpQkFFaEMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFDLE1BQU0sRUFBRSxLQUFLLElBQUssT0FBQSxVQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBaEMsQ0FBZ0MsQ0FBQyxDQUFDO1FBQzNFLENBQUMsRUFOZSxJQUFJLEdBQUosVUFBSSxLQUFKLFVBQUksUUFNbkI7SUFBRCxDQUFDLEVBTlMsS0FBSyxHQUFMLFFBQUssS0FBTCxRQUFLLFFBTWQ7QUFBRCxDQUFDLEVBTk0sRUFBRSxLQUFGLEVBQUUsUUFNUiIsImZpbGUiOiJ2cy50b29sa2l0Lm1pbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSB2cy50b29scyB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ29uZmlnIHtcclxuICAgIC8qKiBAbmdJbmplY3QgKi9cclxuICAgIGNvbnN0cnVjdG9yKCRsb2dQcm92aWRlcjogbmcuSUxvZ1Byb3ZpZGVyKSB7XHJcbiAgICAgIC8vIGVuYWJsZSBsb2dcclxuICAgICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZCh0cnVlKTtcclxuICAgICAgLy8gc2V0IG9wdGlvbnMgdGhpcmQtcGFydHkgbGliXHJcbiAgICB9XHJcblxyXG4gIH1cclxufVxyXG4iLCJtb2R1bGUgdnMudG9vbHMge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgZXhwb3J0IGNsYXNzIFJ1bkJsb2NrIHtcclxuICAgIC8qKiBAbmdJbmplY3QgKi9cclxuICAgIGNvbnN0cnVjdG9yKCRsb2c6IG5nLklMb2dTZXJ2aWNlKSB7XHJcbiAgICAgICRsb2cuZGVidWcoJ3J1bkJsb2NrIGVuZCcpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaW5kZXguY29uZmlnLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImluZGV4LnJ1bi50c1wiIC8+XHJcblxyXG5tb2R1bGUgdnMudG9vbHMge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgZGVjbGFyZSB2YXIgY29uZmlnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMnLCBbXSlcclxuICAgIC5jb25maWcoQ29uZmlnKVxyXG4gICAgLnJ1bihSdW5CbG9jaylcclxuICAgIC5jb25zdGFudCgnY29uZmlnJywgY29uZmlnKTtcclxufVxyXG4iLCJtb2R1bGUgdnMudG9vbHMuY2F0YWxvZyB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuY2F0YWxvZycsIFtdKTtcclxufVxyXG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXHJcbmRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5jYXRhbG9nJykuXHJcblx0LyogQG5nSW5qZWN0ICovXHJcblx0ZmFjdG9yeSgnY2F0YWxvZ1Jlc291cmNlJywgZnVuY3Rpb24gKCRodHRwOiBhbnksICRxOiBhbnkpIHtcclxuXHJcblx0XHQndXNlIHN0cmljdCc7XHJcblxyXG5cdFx0dmFyIHVyaSA9IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2luZGV4L2NvbmZpZy9mZWRlcmF0aW9uLmpzb24nO1xyXG5cdFx0dmFyIGxvY2F0aW9ucyA9ICdhcGkvcmVzdC9pMThuL2ZpZWxkL2xvY2F0aW9uLmpzb24nO1xyXG5cclxuXHRcdGZ1bmN0aW9uIF9mZXRjaCgpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldCh1cmkpLnRoZW4oZnVuY3Rpb24gKHJlczogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIHJlcy5kYXRhLnNlcnZlcnM7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfbG9hZFJlbW90ZUxvY2F0aW9ucyhwYXJhbXM6IGFueSkge1xyXG5cdFx0XHRyZXR1cm4gX2ZldGNoKCkudGhlbigoY2F0YWxvZ3M6IGFueSkgPT4ge1xyXG5cdFx0XHRcdHZhciBwcm9taXNlcyA9IFtdO1xyXG5cdFx0XHRcdGNhdGFsb2dzLmZvckVhY2goY2F0YWxvZyA9PiB7XHJcblx0XHRcdFx0XHRpZiAoYW5ndWxhci5pc0RlZmluZWQoY2F0YWxvZy51cmwpKSB7XHJcblx0XHRcdFx0XHRcdHZhciB1cmwgPSBjYXRhbG9nLnVybCArIGxvY2F0aW9ucztcclxuXHRcdFx0XHRcdFx0dmFyIGNhdGFsb2dQcm9taXNlID0gJGh0dHAuZ2V0KHVybCwge3dpdGhDcmVkZW50aWFsczogZmFsc2V9KS50aGVuKChyZXNwb25zZTogYW55KSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZXMucHVzaChjYXRhbG9nUHJvbWlzZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuICRxLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbihyZXMpIHtcclxuXHRcdFx0XHRcdHJldHVybiByZXM7XHJcblx0XHRcdFx0fSwgZnVuY3Rpb24oZXJyb3IpIHtcclxuXHRcdFx0XHRcdHJldHVybiBlcnJvcjsgLy8gZmFpbHVyZSBtZWFucyB0aGUgcmVtb3RlIGNhdGFsb2dzIGFyZSBvZmZsaW5lLCBhbGxvdyB0byBjb250aW51ZSwgdGhlIHNlYXJjaCBzaG91bGQgc2hvdyBhbiBlcnJvclxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRmZXRjaDogX2ZldGNoLFxyXG5cdFx0XHRsb2FkUmVtb3RlTG9jYXRpb25zOiBfbG9hZFJlbW90ZUxvY2F0aW9uc1xyXG5cdFx0fTtcclxuXHR9KTtcclxuIiwibW9kdWxlIHZzLnRvb2xzLmRpc3BsYXlDb25maWcge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmRpc3BsYXlDb25maWcnLCBbXSk7XHJcbn1cclxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xyXG5kZWNsYXJlIHZhciBjb25maWc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZGlzcGxheUNvbmZpZycpLlxyXG5cdC8qIEBuZ0luamVjdCAqL1xyXG5cdGZhY3RvcnkoJ2Rpc3BsYXlDb25maWdSZXNvdXJjZScsIGZ1bmN0aW9uICgkaHR0cDogYW55KSB7XHJcblxyXG5cdFx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRcdHZhciBjb25maWdVcmkgPSBjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L2NvbmZpZy8nO1xyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXRMaXN0UXVlcnlTdHJpbmcoKSB7XHJcblx0XHRcdHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZ1VyaSArICdsaXN0JztcclxuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xyXG5cdFx0XHRyZXR1cm4gcXVlcnlTdHJpbmc7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgaWQ7XHJcblx0XHRcdHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXREaXNwbGF5Q29uZmlnTGlzdCgpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXREaXNwbGF5Q29uZmlnKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZGVsZXRlRGlzcGxheUNvbmZpZyhpZDogc3RyaW5nKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5kZWxldGUoX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX3NhdmVEaXNwbGF5Q29uZmlnKHRlbXBsYXRlOiBhbnkpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoY29uZmlnVXJpLCB0ZW1wbGF0ZSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZ3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBfZ2V0RGlzcGxheUNvbmZpZ0xpc3QoKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBfZ2V0RGlzcGxheUNvbmZpZyhpZCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRlbGV0ZURpc3BsYXlDb25maWc6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gX2RlbGV0ZURpc3BsYXlDb25maWcoaWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzYXZlRGlzcGxheUNvbmZpZzogZnVuY3Rpb24odGVtcGxhdGU6IGFueSl7XHJcblx0XHRcdFx0cmV0dXJuIF9zYXZlRGlzcGxheUNvbmZpZyh0ZW1wbGF0ZSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fSk7XHJcbiIsIm1vZHVsZSB2cy50b29scy5maWx0ZXJzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5maWx0ZXJzJywgW10pXG4gICAgLmZpbHRlcigncmVwbGFjZVN0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGhheVN0YWNrOiBzdHJpbmcsIG9sZE5lZWRsZTogc3RyaW5nLCBuZXdOZWVkbGU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gaGF5U3RhY2sucmVwbGFjZShuZXcgUmVnRXhwKG9sZE5lZWRsZSwgJ2cnKSwgbmV3TmVlZGxlKTtcbiAgICAgIH07XG4gICAgfSk7XG4gfVxuIiwibW9kdWxlIHZzLnRvb2xzLnV0aWwge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcblx0ZXhwb3J0IGNsYXNzIFN1Z2FyIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbmZpZzogYW55LCBwcml2YXRlICRodHRwOiBuZy5JSHR0cFNlcnZpY2UpIHt9XHJcblxyXG5cdFx0cHVibGljIHN0YXRpYyBpc1N0cmluZyh2YWw6IGFueSkge1xyXG5cdFx0XHRyZXR1cm4gKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnIHx8IHZhbCBpbnN0YW5jZW9mIFN0cmluZyk7XHJcblx0XHR9XHJcblxyXG5cdFx0c3RhdGljIGdldEluc3RhbmNlKGNvbmZpZzogYW55LCAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlKSA6IFN1Z2FyIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBTdWdhcihjb25maWcsICRodHRwKTtcclxuXHRcdH1cclxuXHJcblx0XHR0b01hcChrZXk6IGFueSwgYXJyYXk6IGFueSkge1xyXG5cdFx0XHR2YXIgbWFwID0ge307XHJcblx0XHRcdGFycmF5LmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHtcclxuXHRcdFx0XHRtYXBbdmFsdWVba2V5XV0gPSB2YWx1ZTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBtYXA7XHJcblx0XHR9XHJcblxyXG5cdFx0dG9TdHJpbmdNYXAoYXJyYXk6IGFueSkge1xyXG5cdFx0XHR2YXIgbWFwID0ge307XHJcblx0XHRcdGFycmF5LmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHtcclxuXHRcdFx0XHRtYXBbdmFsdWVdID0gdmFsdWU7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbWFwO1xyXG5cdFx0fVxyXG5cclxuICAgIHBsdWNrKGFycmF5OiBhbnksIG5hbWU6IHN0cmluZywgZm4/OiBGdW5jdGlvbikge1xyXG4gICAgICB2YXIgZmwgPSBbXTtcclxuICAgICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZTogYW55KXtcclxuICAgICAgICBpZiAoZm4gJiYgZm4odmFsdWUpKSB7XHJcbiAgICAgICAgICBmbC5wdXNoKHZhbHVlW25hbWVdKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFuZ3VsYXIuaXNVbmRlZmluZWQoZm4pKSB7XHJcbiAgICAgICAgICBmbC5wdXNoKHZhbHVlW25hbWVdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gZmw7XHJcbiAgICB9XHJcblxyXG4gICAgcG9zdEZvcm0odXJsOiBzdHJpbmcsIGRhdGE6IGFueSkge1xyXG4gICAgICB2YXIgc2VydmljZSA9IHRoaXMuY29uZmlnLnJvb3QgKyB1cmw7XHJcbiAgICAgIHJldHVybiB0aGlzLiRodHRwKHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICB1cmw6IHNlcnZpY2UsXHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWUsXHJcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCd9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlUXVlcnlTdHJpbmcocXVlcnlTdHJpbmc6IHN0cmluZykge1xyXG4gICAgICB2YXIgcGFpcnMgPSBxdWVyeVN0cmluZy5zbGljZSgxKS5zcGxpdCgnJicpO1xyXG4gICAgICB2YXIgcmVzdWx0ID0ge30sIHM7XHJcbiAgICAgIHBhaXJzLmZvckVhY2goZnVuY3Rpb24ocGFpcikge1xyXG4gICAgICAgIHMgPSBwYWlyLnNwbGl0KCc9Jyk7XHJcbiAgICAgICAgcmVzdWx0W3NbMF1dID0gZGVjb2RlVVJJQ29tcG9uZW50KHNbMV0gfHwgJycpO1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVzdWx0KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcG9zdEpzb24ocmVxdWVzdCwgYXBpLCBhY3Rpb24pIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGh0dHAoe1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIHVybDogY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvJyArIGFwaSAgKyAnLycgKyBhY3Rpb24gKyAnLmpzb24nLFxyXG4gICAgICAgIGRhdGE6IHJlcXVlc3QsXHJcbiAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cdH1cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLnRtcC90eXBpbmdzL3RzZC5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi91dGlsL3N1Z2FyLnRzXCIgLz5cblxubW9kdWxlIHZzLnRvb2xzLmZpZWxkcyB7XG4ndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJRmllbGRzUmVzb3VyY2Uge1xuXHRcdGZldGNoKGZpZWxkcz86IHN0cmluZyk6IG5nLklQcm9taXNlPGFueT47XG5cdFx0ZmV0Y2hIeWRyYXRpb25TdGF0cyhxdWVyeTogc3RyaW5nKTogbmcuSVByb21pc2U8YW55Pjtcblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBGaWVsZHNSZXNvdXJjZSBpbXBsZW1lbnRzIElGaWVsZHNSZXNvdXJjZSB7XG5cdFx0c3RhdGljIHJlZk5hbWUgPSAnZmllbGRzUmVzb3VyY2UnO1xuXG5cdFx0ZmV0Y2g6IChwcm9wZXJ0aWVzPzogc3RyaW5nKSA9PiBhbnk7XG5cdFx0ZmV0Y2hIeWRyYXRpb25TdGF0czogKHF1ZXJ5OiBzdHJpbmcpID0+IGFueTtcblx0XHRlbnN1cmVUYWdzRmllbGRFeGlzdDogKGZpZWxkczogQXJyYXk8YW55PikgPT4gYW55O1xuXG5cdFx0LyogQG5nSW5qZWN0ICovXG5cdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBzdWdhcjogYW55KSB7XG5cbiAgICAgIHRoaXMuZmV0Y2ggPSAoZmllbGRzPzogYW55KSA9PiB7XG4gICAgICAgIHZhciBmbCA9IChmaWVsZHMgfHwgJ25hbWUsc3R5cGUsY2F0ZWdvcnksZG9jcyxkaXNwX2VuLHNvcnRhYmxlLGZpbHRlcmFibGUsdGFibGVhYmxlLGRpc3BsYXlhYmxlLGVkaXRhYmxlJyk7XG4gICAgICAgIHJldHVybiBzdWdhci5wb3N0Rm9ybSgnc29sci9maWVsZHMvc2VsZWN0P3JhbmQ9JyArIE1hdGgucmFuZG9tKCksIHRoaXMuZ2V0RmllbGRzUGFyYW1zKGZsKSkudGhlbigocmVzOiBhbnkpID0+IHtcbiAgICAgICAgICB0aGlzLmVuc3VyZVRhZ3NGaWVsZEV4aXN0KHJlcy5kYXRhLnJlc3BvbnNlLmRvY3MpO1xuICAgICAgICAgIHJldHVybiByZXMuZGF0YS5yZXNwb25zZS5kb2NzO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuZW5zdXJlVGFnc0ZpZWxkRXhpc3QgPSAoZmllbGRzOiBBcnJheTxhbnk+KSA9PiB7XG4gICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gZmllbGRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKGZpZWxkc1tpXS5uYW1lID09PSAndGFnX3RhZ3MnKSB7XG4gICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgZmllbGRzLnB1c2goe1xuICAgICAgICAgICAgY2F0ZWdvcnk6ICdURVhUJyxcbiAgICAgICAgICAgIGRpc3BfZW46ICdUYWdzJyxcbiAgICAgICAgICAgIGRpc3BsYXlhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZG9jczogMCxcbiAgICAgICAgICAgIGZpbHRlcmFibGU6IHRydWUsXG4gICAgICAgICAgICBuYW1lOiAndGFnX3RhZ3MnLFxuICAgICAgICAgICAgc29ydGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgc3R5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgdGFibGVhYmxlOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuXG5cdFx0XHR0aGlzLmZldGNoSHlkcmF0aW9uU3RhdHMgPSAocXVlcnk6IHN0cmluZykgPT4ge1xuXG5cdFx0XHRcdHJldHVybiB0aGlzLmZldGNoKCkudGhlbigoZmllbGRzOiBBcnJheTxhbnk+KSA9PiB7XG4gICAgICAgICAgdmFyIGZsID0gc3VnYXIucGx1Y2soZmllbGRzLCAnbmFtZScsIGZ1bmN0aW9uKGZpZWxkKSB7IHJldHVybiBmaWVsZC5uYW1lLmluZGV4T2YoJ18nKSAhPT0gMCAmJiBmaWVsZC5kb2NzID4gMDsgfSk7XG5cbiAgICAgICAgICByZXR1cm4gc3VnYXIucG9zdEZvcm0oJ3NvbHIvdjAvc2VsZWN0PycgKyBxdWVyeSwgdGhpcy5nZXRTdGF0c1BhcmFtcyhmbCkpLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgICB2YXIgc3RhdHNGaWVsZHMgPSByZXMuZGF0YS5mYWNldF9jb3VudHMuZmFjZXRfZmllbGRzO1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gcmVzLmRhdGEucmVzcG9uc2UubnVtRm91bmQ7XG4gICAgICAgICAgICB0aGlzLmFwcGx5SHlkcmF0aW9uKHN0YXRzRmllbGRzLCBmaWVsZHMsIHRvdGFsKTtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cdFx0XHR9O1xuXG5cdFx0fVxuXG4gICAgcHJpdmF0ZSBnZXRGaWVsZHNQYXJhbXMoZmwpIHtcbiAgICAgIHJldHVybiAncT0qOiomZmw9JyArIGZsICsgJyZyb3dzPTEwMDAwJnNvcnQ9bmFtZSUyMGFzYyZ3dD1qc29uJnJhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIGdldFN0YXRzUGFyYW1zKGZsKSB7XG4gICAgICByZXR1cm4gJ2ZhY2V0PXRydWUmZmFjZXQubGltaXQ9MTAwMDAmZmFjZXQubWluY291bnQ9MTAwJnJvd3M9MCZ3dD1qc29uJmZhY2V0LmZpZWxkPScgKyBmbC5qb2luKCcmZmFjZXQuZmllbGQ9JykgKyAnJnJhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhcHBseUh5ZHJhdGlvbihzdGF0c0ZpZWxkcywgZmllbGRzLCB0b3RhbCkge1xuICAgICAgdmFyIHN0YXRzRmllbGQsIGNvdW50O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3RhdHNGaWVsZCA9IHN0YXRzRmllbGRzW2ZpZWxkc1tpXS5uYW1lXTtcbiAgICAgICAgaWYgKHN0YXRzRmllbGQgJiYgc3RhdHNGaWVsZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGRzW2ldLmlkID0gZmllbGRzW2ldLm5hbWU7XG4gICAgICAgICAgY291bnQgPSB0aGlzLmdldENvdW50KHN0YXRzRmllbGQpO1xuICAgICAgICAgIGZpZWxkc1tpXS5oeWRyYXRpb24gPSBjb3VudCAvIHRvdGFsICogMTAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENvdW50KGZpZWxkKSB7XG4gICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBmaWVsZC5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICBjb3VudCArPSBmaWVsZFtpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2ZpZWxkcy5yZXNvdXJjZS50c1wiIC8+XHJcblxyXG5tb2R1bGUgdnMudG9vbHMuZmllbGRzIHtcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZmllbGRzJywgWyd2cy50b29scy51dGlsJ10pXHJcblx0XHQuc2VydmljZShGaWVsZHNSZXNvdXJjZS5yZWZOYW1lLCBGaWVsZHNSZXNvdXJjZSk7XHJcblxyXG59XHJcbiIsIm1vZHVsZSB2cy50b29scy5zYXZlZFNlYXJjaCB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuc2F2ZWRTZWFyY2gnLCBbJ3ZzLnRvb2xzLnV0aWwnXSk7XHJcbn1cclxuIiwiLypnbG9iYWwgYW5ndWxhciwgJCwgcXVlcnlzdHJpbmcsIGNvbmZpZyAqL1xyXG5kZWNsYXJlIHZhciBjb25maWc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuc2F2ZWRTZWFyY2gnKS5cclxuXHQvKiBAbmdJbmplY3QgKi9cclxuICBmYWN0b3J5KCdzYXZlZFNlYXJjaFJlc291cmNlJywgZnVuY3Rpb24gKCRodHRwOiBhbnksIHN1Z2FyKSB7XHJcblxyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICBmdW5jdGlvbiBfZG9TYXZlKHNhdmVkU2VhcmNoOiBhbnkpIHtcclxuICAgICAgIHJldHVybiBzdWdhci5wb3N0SnNvbihzYXZlZFNlYXJjaCwgJ2Rpc3BsYXknLCAnc3NlYXJjaCcpO1xyXG4gICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfZ2V0UXVlcnlTdHJpbmcoaWQ/OiBzdHJpbmcpIHtcclxuICAgICAgdmFyIHJvd3MgPSAxNTA7ICAvLyBAVE9ETyBzZXQgdG8gd2hhdCB3ZSByZWFsbHkgd2FudFxyXG4gICAgICB2YXIgcXVlcnlTdHJpbmcgPSBjb25maWcucm9vdCArICdzb2xyL3NzZWFyY2gvc2VsZWN0Pyc7XHJcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICdyb3dzPScgKyByb3dzICsgJyZyYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICBxdWVyeVN0cmluZyArPSAnJmZsPWlkLHRpdGxlLGRlc2NyaXB0aW9uLG93bmVyLHBhdGgsc2hhcmUscXVlcnksY29uZmlnLG9yZGVyLHNhdmVkLHByaXZhdGUsdmlldyxfdmVyc2lvbl8sY29uZmlnX3RpdGxlOltjb25maWdUaXRsZV0scGFyYW0qLGxhYmVscyc7XHJcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmd3Q9anNvbiZqc29uLndyZj1KU09OX0NBTExCQUNLJztcclxuICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGlkKSkge1xyXG4gICAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmZnE9aWQ6JyArIGlkO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBxdWVyeVN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfZXhlY3V0ZShpZD86IHN0cmluZykge1xyXG4gICAgICByZXR1cm4gJGh0dHAuanNvbnAoX2dldFF1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEuZGF0YS5yZXNwb25zZS5kb2NzO1xyXG4gICAgICB9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcbiAgICAgICAgLy8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGdldFNhdmVkU2VhcmNoZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBfZXhlY3V0ZSgpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZmV0Y2g6IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIF9leGVjdXRlKGlkKS50aGVuKGZ1bmN0aW9uKGRvY3MpIHtcclxuICAgICAgICAgIHJldHVybiBkb2NzWzBdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgc2F2ZVNlYXJjaDogZnVuY3Rpb24oc2F2ZWRTZWFyY2gsIHBhcmFtcykge1xyXG4gICAgICAgLy8gIHNhdmVkU2VhcmNoLmNvbmZpZyA9IGNvbmZpZ1NlcnZpY2UuZ2V0Q29uZmlnSWQoKTtcclxuICAgICAgIC8vICBzYXZlZFNlYXJjaC5xdWVyeSA9IGNvbnZlcnRlci50b0NsYXNzaWNQYXJhbXMocGFyYW1zKTtcclxuICAgICAgIHJldHVybiBfZG9TYXZlKHNhdmVkU2VhcmNoKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGRlbGV0ZVNlYXJjaDogZnVuY3Rpb24oaWQ6IHN0cmluZyl7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkKS50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgLy8gb2JzZXJ2ZXJzLmZvckVhY2goZnVuY3Rpb24gKGVudHJ5KSB7XHJcbiAgICAgICAgICAgICAgLy8gICBlbnRyeShpZCk7XHJcbiAgICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgd2lwZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvd2lwZScpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVzdG9yZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdhcGkvcmVzdC9kaXNwbGF5L3Jlc3RvcmUnLCAnJyk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBvcmRlcjogZnVuY3Rpb24oaWQ6IGFueSwgYmVmb3JlSWQ6IGFueSwgYWZ0ZXJJZDogYW55KSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSAnJztcclxuICAgICAgICBpZiAoYmVmb3JlSWQgIT09IG51bGwpIHtcclxuICAgICAgICAgIGRhdGEgKz0gJ2JlZm9yZT0nICsgYmVmb3JlSWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkYXRhICE9PSAnJykge1xyXG4gICAgICAgICAgZGF0YSArPSAnJic7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYWZ0ZXJJZCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgZGF0YSArPSAnYWZ0ZXI9JyArIGFmdGVySWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHJldHVybiBzdWdhci5wb3N0Rm9ybSgnYXBpL3Jlc3QvZGlzcGxheS9zc2VhcmNoLycgKyBpZCArICcvb3JkZXInLCBkYXRhKTtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZldGNoTGFiZWxzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdXJsID0gY29uZmlnLnJvb3QgKyAnc29sci9zc2VhcmNoL3NlbGVjdD9yb3dzPTAmZmFjZXQ9dHJ1ZSZmYWNldC5maWVsZD1sYWJlbHMmd3Q9anNvbiZyPScgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHVybCkudGhlbihmdW5jdGlvbihyZXNwKSB7XHJcbiAgICAgICAgICByZXR1cm4gcmVzcC5kYXRhLmZhY2V0X2NvdW50cy5mYWNldF9maWVsZHMubGFiZWxzO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uKCkgeyAgLy8gZXJyb3IgaWYgbGFiZWxzIGZpZWxkIGRvZXNuJ3QgZXhpc3RcclxuICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9KTtcclxuIiwibW9kdWxlIHZzLnRvb2xzLnRyYW5zbGF0ZSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBleHBvcnQgY2xhc3MgVHJhbnNsYXRvciB7XG5cbiAgICBwcml2YXRlIGZpZWxkczogYW55ID0gbnVsbDtcbiAgICBwcml2YXRlIHJlbW92ZVByZWZpeEhhc2ggPSB7fTtcblxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlnOiBhbnksIHByaXZhdGUgJGh0dHA6IG5nLklIdHRwU2VydmljZSwgcHJpdmF0ZSAkcTogbmcuSVFTZXJ2aWNlKSB7XG4gICAgICB2YXIgcmVtb3ZlUHJlZml4TGlzdCA9IFsnZnNfJywgJ2Z0XycsICdmaF8nLCAnZmlfJywgJ2ZsXycsICdmZF8nLCAnZmZfJywgJ2Z1XycsICdmcF8nLCAnZnlfJywgJ2ZtXycsICdmYl8nLCAndGFnXycsICdtZXRhXycsICdmc3NfJ107XG4gICAgICByZW1vdmVQcmVmaXhMaXN0LmZvckVhY2goKGl0ZW06IHN0cmluZykgPT4ge1xuICAgICAgICB0aGlzLnJlbW92ZVByZWZpeEhhc2hbaXRlbV0gPSB0cnVlO1xuICAgICAgICB2YXIgYyA9IGl0ZW0uc3Vic3RyaW5nKDEsIDIpO1xuICAgICAgICB2YXIga2V5ID0gaXRlbS5yZXBsYWNlKCdfJywgYyArICdfJyk7XG4gICAgICAgIHRoaXMucmVtb3ZlUHJlZml4SGFzaFtrZXldID0gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkKCkge1xuICAgICAgdmFyIHJlc291cmNlVXJsID0gdGhpcy5jb25maWcucm9vdCArICdhcGkvcmVzdC9pMThuL2ZpZWxkcy9zdGFuZGFyZC5qc29uJztcblxuICAgICAgaWYgKCF0aGlzLmZpZWxkcykge1xuICAgICAgICByZXR1cm4gdGhpcy4kaHR0cC5nZXQocmVzb3VyY2VVcmwpLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgdGhpcy5maWVsZHMgPSByZXMuZGF0YTtcbiAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJHEud2hlbigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB0cmFuc2xhdGVGaWVsZChmaWVsZDogc3RyaW5nKSB7XG4gICAgICB2YXIgaWR4ID0gZmllbGQuaW5kZXhPZignXycpO1xuICAgICAgaWYgKGlkeCA+IC0xKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSBmaWVsZC5zdWJzdHJpbmcoMCwgaWR4ICsgMSk7XG4gICAgICAgIGlmICh0aGlzLnJlbW92ZVByZWZpeEhhc2hbcHJlZml4XSkge1xuICAgICAgICAgIGZpZWxkID0gZmllbGQucmVwbGFjZShwcmVmaXgsICcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIHRyYW5zbGF0ZWQgPSB0aGlzLmZpZWxkcy5GSUVMRFtmaWVsZF07XG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodHJhbnNsYXRlZCkpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGFzc2lmeShmaWVsZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGFzc2lmeShzdHI6IHN0cmluZykge1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2UoL18vZywgJyAnKTtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFx3XFxTKi9nLCBmdW5jdGlvbih0eHQ6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdHh0LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHh0LnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwidHJhbnNsYXRvci50c1wiIC8+XHJcbm1vZHVsZSB2cy50b29scy50cmFuc2xhdGUge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgZGVjbGFyZSB2YXIgY29uZmlnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMudHJhbnNsYXRlJywgW10pXHJcbiAgICAvKiBAbmdJbmplY3QgKi9cclxuICAgIC5mYWN0b3J5KCd0cmFuc2xhdG9yJywgKGNvbmZpZzogYW55LCAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLCAkcTogbmcuSVFTZXJ2aWNlKSA9PiBuZXcgVHJhbnNsYXRvcihjb25maWcsICRodHRwLCAkcSkpXHJcbiAgICAuY29uc3RhbnQoJ2NvbmZpZycsIGNvbmZpZyk7XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN1Z2FyLnRzXCIgLz5cclxubW9kdWxlIHZzLnRvb2xzLnV0aWwge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnV0aWwnLCBbXSlcclxuICAgIC8qIEBuZ0luamVjdCAqL1xyXG4gICAgLmZhY3RvcnkoJ3N1Z2FyJywgKGNvbmZpZywgJGh0dHApID0+IFN1Z2FyLmdldEluc3RhbmNlKGNvbmZpZywgJGh0dHApKTtcclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
//# sourceMappingURL=maps/vs.toolkit.src.js.map