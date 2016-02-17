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
        })();
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
        })();
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
        angular.module('vs.tools', []).config(tools.Config).run(tools.RunBlock).constant('config', config);
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

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

angular.module('vs.tools.displayConfig').factory('displayConfigResource', function ($http) {
    'use strict';
    var configUri = config.root + 'api/rest/display/display_config/';
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
            angular.module('vs.tools.filters', []).filter('replaceString', function () {
                return function (hayStack, oldNeedle, newNeedle) {
                    return hayStack.replace(oldNeedle, newNeedle);
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
            })();
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
        (function (_fields) {
            'use strict';
            var FieldsResource = (function () {
                /* @ngInject */
                function FieldsResource(sugar) {
                    var _this = this;
                    this.sugar = sugar;
                    this.fetch = function (fields) {
                        var fl = (fields || 'name,category,docs,disp_en');
                        return sugar.postForm('solr/fields/select', _this.getFieldsParams(fl)).then(function (res) {
                            return res.data.response.docs;
                        });
                    };
                    this.fetchHydrationStats = function (query) {
                        return _this.fetch().then(function (fields) {
                            var fl = sugar.pluck(fields, 'name', function (field) {
                                return field.name.indexOf('_') !== 0 && field.docs > 0;
                            });
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
                    return 'q=*:*&fl=' + fl + '&rows=10000&sort=name%20asc&wt=json';
                };
                FieldsResource.prototype.getStatsParams = function (fl) {
                    return 'facet=true&facet.limit=10000&facet.mincount=100&rows=0&wt=json&facet.field=' + fl.join('&facet.field=');
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
            })();
            _fields.FieldsResource = FieldsResource;
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
            angular.module('vs.tools.fields', ['vs.tools.util']).service(fields.FieldsResource.refName, fields.FieldsResource);
        })(fields = tools.fields || (tools.fields = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

var vs;
(function (vs) {
    var tools;
    (function (tools) {
        var pageConfig;
        (function (pageConfig) {
            'use strict';
            angular.module('vs.tools.pageConfig', []);
        })(pageConfig = tools.pageConfig || (tools.pageConfig = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

angular.module('vs.tools.pageConfig').factory('pageConfigResource', function ($http) {
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
    function _getPageConfigList() {
        return $http.get(_getListQueryString()).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _getPageConfig(id) {
        return $http.get(_getConfigQueryString(id)).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _deletePageConfig(id) {
        return $http.delete(_getConfigQueryString(id)).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    function _savePageConfig(template) {
        return $http.post(configUri, template).then(function (data) {
            return data;
        }, function (error) {
            // @TODO: handle error
            console.log(error);
            return error;
        });
    }
    return {
        getPageConfigs: function () {
            return _getPageConfigList();
        },
        getPageConfig: function (id) {
            return _getPageConfig(id);
        },
        deletePageConfig: function (id) {
            return _deletePageConfig(id);
        },
        savePageConfig: function (template) {
            return _savePageConfig(template);
        }
    };
});

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

angular.module('vs.tools.savedSearch').factory('savedSearchResource', function ($http, sugar) {
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
            var Translator = (function () {
                /* @ngInject */
                function Translator(config, $http, $q) {
                    this.config = config;
                    this.$http = $http;
                    this.$q = $q;
                    this.fields = null;
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
            })();
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
            angular.module('vs.tools.translate', []).factory('translator', function (config, $http, $q) { return new translate.Translator(config, $http, $q); }).constant('config', config);
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
            angular.module('vs.tools.util', []).factory('sugar', function (config, $http) { return util.Sugar.getInstance(config, $http); });
        })(util = tools.util || (tools.util = {}));
    })(tools = vs.tools || (vs.tools = {}));
})(vs || (vs = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvbmZpZy50cyIsImluZGV4LnJ1bi50cyIsImluZGV4Lm1vZHVsZS50cyIsImRpc3BsYXktY29uZmlnL0Rpc3BsYXlDb25maWdNb2R1bGUudHMiLCJkaXNwbGF5LWNvbmZpZy9EaXNwbGF5Q29uZmlnUmVzb3VyY2UudHMiLCJmaWx0ZXJzL2ZpbHRlcnMudHMiLCJ1dGlsL3N1Z2FyLnRzIiwiZmllbGRzL2ZpZWxkcy5yZXNvdXJjZS50cyIsImZpZWxkcy9maWVsZHMubW9kdWxlLnRzIiwicGFnZS1jb25maWcvcGFnZS1jb25maWctbW9kdWxlLnRzIiwicGFnZS1jb25maWcvcGFnZS1jb25maWctcmVzb3VyY2UudHMiLCJzYXZlZC1zZWFyY2gvc2F2ZWQtc2VhcmNoLW1vZHVsZS50cyIsInNhdmVkLXNlYXJjaC9zYXZlZFNlYXJjaC5yZXNvdXJjZS50cyIsInRyYW5zbGF0ZS90cmFuc2xhdG9yLnRzIiwidHJhbnNsYXRlL3RyYW5zbGF0ZS5tb2R1bGUudHMiLCJ1dGlsL3V0aWwubW9kdWxlLnRzIl0sIm5hbWVzIjpbInZzIiwidnMudG9vbHMiLCJ2cy50b29scy5Db25maWciLCJ2cy50b29scy5Db25maWcuY29uc3RydWN0b3IiLCJ2cy50b29scy5SdW5CbG9jayIsInZzLnRvb2xzLlJ1bkJsb2NrLmNvbnN0cnVjdG9yIiwidnMudG9vbHMuZGlzcGxheUNvbmZpZyIsIl9nZXRMaXN0UXVlcnlTdHJpbmciLCJfZ2V0Q29uZmlnUXVlcnlTdHJpbmciLCJfZ2V0RGlzcGxheUNvbmZpZ0xpc3QiLCJfZ2V0RGlzcGxheUNvbmZpZyIsIl9kZWxldGVEaXNwbGF5Q29uZmlnIiwiX3NhdmVEaXNwbGF5Q29uZmlnIiwidnMudG9vbHMuZmlsdGVycyIsInZzLnRvb2xzLnV0aWwiLCJ2cy50b29scy51dGlsLlN1Z2FyIiwidnMudG9vbHMudXRpbC5TdWdhci5jb25zdHJ1Y3RvciIsInZzLnRvb2xzLnV0aWwuU3VnYXIuaXNTdHJpbmciLCJ2cy50b29scy51dGlsLlN1Z2FyLmdldEluc3RhbmNlIiwidnMudG9vbHMudXRpbC5TdWdhci50b01hcCIsInZzLnRvb2xzLnV0aWwuU3VnYXIudG9TdHJpbmdNYXAiLCJ2cy50b29scy51dGlsLlN1Z2FyLnBsdWNrIiwidnMudG9vbHMudXRpbC5TdWdhci5wb3N0Rm9ybSIsInZzLnRvb2xzLnV0aWwuU3VnYXIucGFyc2VRdWVyeVN0cmluZyIsInZzLnRvb2xzLnV0aWwuU3VnYXIucG9zdEpzb24iLCJ2cy50b29scy5maWVsZHMiLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UiLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UuY29uc3RydWN0b3IiLCJ2cy50b29scy5maWVsZHMuRmllbGRzUmVzb3VyY2UuZ2V0RmllbGRzUGFyYW1zIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlLmdldFN0YXRzUGFyYW1zIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlLmFwcGx5SHlkcmF0aW9uIiwidnMudG9vbHMuZmllbGRzLkZpZWxkc1Jlc291cmNlLmdldENvdW50IiwidnMudG9vbHMucGFnZUNvbmZpZyIsIl9nZXRQYWdlQ29uZmlnTGlzdCIsIl9nZXRQYWdlQ29uZmlnIiwiX2RlbGV0ZVBhZ2VDb25maWciLCJfc2F2ZVBhZ2VDb25maWciLCJ2cy50b29scy5zYXZlZFNlYXJjaCIsIl9kb1NhdmUiLCJfZ2V0UXVlcnlTdHJpbmciLCJfZXhlY3V0ZSIsInZzLnRvb2xzLnRyYW5zbGF0ZSIsInZzLnRvb2xzLnRyYW5zbGF0ZS5UcmFuc2xhdG9yIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IuY29uc3RydWN0b3IiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvci5sb2FkIiwidnMudG9vbHMudHJhbnNsYXRlLlRyYW5zbGF0b3IudHJhbnNsYXRlRmllbGQiLCJ2cy50b29scy50cmFuc2xhdGUuVHJhbnNsYXRvci5jbGFzc2lmeSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxF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QSxDQU1kQTtJQU5TQSxXQUFBQSxLQUFLQTtRQUFDQyxJQUFBQSxJQUFJQSxDQU1uQkE7UUFOZUEsV0FBQUEsSUFBSUEsRUFBQ0EsQ0FBQ0E7WUFDcEJhLFlBQVlBLENBQUNBO1lBRWJBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLGVBQWVBLEVBQUVBLEVBQUVBLENBQUNBLENBRWhDQSxPQUFPQSxDQUFDQSxPQUFPQSxFQUFFQSxVQUFDQSxNQUFNQSxFQUFFQSxLQUFLQSxJQUFLQSxPQUFBQSxVQUFLQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxFQUFFQSxLQUFLQSxDQUFDQSxFQUFoQ0EsQ0FBZ0NBLENBQUNBLENBQUNBO1FBQzNFQSxDQUFDQSxFQU5lYixJQUFJQSxHQUFKQSxVQUFJQSxLQUFKQSxVQUFJQSxRQU1uQkE7SUFBREEsQ0FBQ0EsRUFOU0QsS0FBS0EsR0FBTEEsUUFBS0EsS0FBTEEsUUFBS0EsUUFNZEE7QUFBREEsQ0FBQ0EsRUFOTSxFQUFFLEtBQUYsRUFBRSxRQU1SIiwiZmlsZSI6InZzLnRvb2xraXQubWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIHZzLnRvb2xzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGV4cG9ydCBjbGFzcyBDb25maWcge1xuICAgIC8qKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3RvcigkbG9nUHJvdmlkZXI6IG5nLklMb2dQcm92aWRlcikge1xuICAgICAgLy8gZW5hYmxlIGxvZ1xuICAgICAgJGxvZ1Byb3ZpZGVyLmRlYnVnRW5hYmxlZCh0cnVlKTtcbiAgICAgIC8vIHNldCBvcHRpb25zIHRoaXJkLXBhcnR5IGxpYlxuICAgIH1cblxuICB9XG59XG4iLCJtb2R1bGUgdnMudG9vbHMge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZXhwb3J0IGNsYXNzIFJ1bkJsb2NrIHtcbiAgICAvKiogQG5nSW5qZWN0ICovXG4gICAgY29uc3RydWN0b3IoJGxvZzogbmcuSUxvZ1NlcnZpY2UpIHtcbiAgICAgICRsb2cuZGVidWcoJ3J1bkJsb2NrIGVuZCcpO1xuICAgIH1cblxuICB9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLnRtcC90eXBpbmdzL3RzZC5kLnRzXCIgLz5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImluZGV4LmNvbmZpZy50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiaW5kZXgucnVuLnRzXCIgLz5cblxubW9kdWxlIHZzLnRvb2xzIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGRlY2xhcmUgdmFyIGNvbmZpZztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMnLCBbXSlcbiAgICAuY29uZmlnKENvbmZpZylcbiAgICAucnVuKFJ1bkJsb2NrKVxuICAgIC5jb25zdGFudCgnY29uZmlnJywgY29uZmlnKTtcbn1cbiIsIm1vZHVsZSB2cy50b29scy5kaXNwbGF5Q29uZmlnIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5kaXNwbGF5Q29uZmlnJywgW10pO1xyXG59XHJcbiIsIi8qZ2xvYmFsIGFuZ3VsYXIsICQsIHF1ZXJ5c3RyaW5nLCBjb25maWcgKi9cclxuZGVjbGFyZSB2YXIgY29uZmlnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLmRpc3BsYXlDb25maWcnKS5cclxuXHQvKiBAbmdJbmplY3QgKi9cclxuXHRmYWN0b3J5KCdkaXNwbGF5Q29uZmlnUmVzb3VyY2UnLCBmdW5jdGlvbiAoJGh0dHA6IGFueSkge1xyXG5cclxuXHRcdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0XHR2YXIgY29uZmlnVXJpID0gY29uZmlnLnJvb3QgKyAnYXBpL3Jlc3QvZGlzcGxheS9kaXNwbGF5X2NvbmZpZy8nO1xyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXRMaXN0UXVlcnlTdHJpbmcoKSB7XHJcblx0XHRcdHZhciBxdWVyeVN0cmluZyA9IGNvbmZpZ1VyaSArICdsaXN0JztcclxuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xyXG5cdFx0XHRyZXR1cm4gcXVlcnlTdHJpbmc7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgaWQ7XHJcblx0XHRcdHF1ZXJ5U3RyaW5nICs9ICc/cmFuZD0nICsgTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0cmV0dXJuIHF1ZXJ5U3RyaW5nO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXREaXNwbGF5Q29uZmlnTGlzdCgpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0TGlzdFF1ZXJ5U3RyaW5nKCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9nZXREaXNwbGF5Q29uZmlnKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmdldChfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZGVsZXRlRGlzcGxheUNvbmZpZyhpZDogc3RyaW5nKSB7XHJcblx0XHRcdHJldHVybiAkaHR0cC5kZWxldGUoX2dldENvbmZpZ1F1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX3NhdmVEaXNwbGF5Q29uZmlnKHRlbXBsYXRlOiBhbnkpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoY29uZmlnVXJpLCB0ZW1wbGF0ZSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZ3M6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBfZ2V0RGlzcGxheUNvbmZpZ0xpc3QoKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0RGlzcGxheUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBfZ2V0RGlzcGxheUNvbmZpZyhpZCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGRlbGV0ZURpc3BsYXlDb25maWc6IGZ1bmN0aW9uKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gX2RlbGV0ZURpc3BsYXlDb25maWcoaWQpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzYXZlRGlzcGxheUNvbmZpZzogZnVuY3Rpb24odGVtcGxhdGU6IGFueSl7XHJcblx0XHRcdFx0cmV0dXJuIF9zYXZlRGlzcGxheUNvbmZpZyh0ZW1wbGF0ZSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fSk7XHJcbiIsIm1vZHVsZSB2cy50b29scy5maWx0ZXJzIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5maWx0ZXJzJywgW10pXHJcbiAgICAuZmlsdGVyKCdyZXBsYWNlU3RyaW5nJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbihoYXlTdGFjazogc3RyaW5nLCBvbGROZWVkbGU6IHN0cmluZywgbmV3TmVlZGxlOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gaGF5U3RhY2sucmVwbGFjZShvbGROZWVkbGUsIG5ld05lZWRsZSk7XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuIH1cclxuIiwibW9kdWxlIHZzLnRvb2xzLnV0aWwge1xuXG5cdGV4cG9ydCBjbGFzcyBTdWdhciB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbmZpZzogYW55LCBwcml2YXRlICRodHRwOiBuZy5JSHR0cFNlcnZpY2UpIHt9XG5cblx0XHRwdWJsaWMgc3RhdGljIGlzU3RyaW5nKHZhbDogYW55KSB7XG5cdFx0XHRyZXR1cm4gKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnIHx8IHZhbCBpbnN0YW5jZW9mIFN0cmluZyk7XG5cdFx0fVxuXG5cdFx0c3RhdGljIGdldEluc3RhbmNlKGNvbmZpZzogYW55LCAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlKSA6IFN1Z2FyIHtcblx0XHRcdHJldHVybiBuZXcgU3VnYXIoY29uZmlnLCAkaHR0cCk7XG5cdFx0fVxuXG5cdFx0dG9NYXAoa2V5OiBhbnksIGFycmF5OiBhbnkpIHtcblx0XHRcdHZhciBtYXAgPSB7fTtcblx0XHRcdGFycmF5LmZvckVhY2goKHZhbHVlOiBhbnkpID0+IHtcblx0XHRcdFx0bWFwW3ZhbHVlW2tleV1dID0gdmFsdWU7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBtYXA7XG5cdFx0fVxuXG5cdFx0dG9TdHJpbmdNYXAoYXJyYXk6IGFueSkge1xuXHRcdFx0dmFyIG1hcCA9IHt9O1xuXHRcdFx0YXJyYXkuZm9yRWFjaCgodmFsdWU6IGFueSkgPT4ge1xuXHRcdFx0XHRtYXBbdmFsdWVdID0gdmFsdWU7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBtYXA7XG5cdFx0fVxuXG4gICAgcGx1Y2soYXJyYXk6IGFueSwgbmFtZTogc3RyaW5nLCBmbj86IEZ1bmN0aW9uKSB7XG4gICAgICB2YXIgZmwgPSBbXTtcbiAgICAgIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsdWU6IGFueSl7XG4gICAgICAgIGlmIChmbiAmJiBmbih2YWx1ZSkpIHtcbiAgICAgICAgICBmbC5wdXNoKHZhbHVlW25hbWVdKTtcbiAgICAgICAgfSBlbHNlIGlmIChhbmd1bGFyLmlzVW5kZWZpbmVkKGZuKSkge1xuICAgICAgICAgIGZsLnB1c2godmFsdWVbbmFtZV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmbDtcbiAgICB9XG5cbiAgICBwb3N0Rm9ybSh1cmw6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgICB2YXIgc2VydmljZSA9IHRoaXMuY29uZmlnLnJvb3QgKyB1cmw7XG4gICAgICByZXR1cm4gdGhpcy4kaHR0cCh7XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICB1cmw6IHNlcnZpY2UsXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCd9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwYXJzZVF1ZXJ5U3RyaW5nKHF1ZXJ5U3RyaW5nOiBzdHJpbmcpIHtcbiAgICAgIHZhciBwYWlycyA9IHF1ZXJ5U3RyaW5nLnNsaWNlKDEpLnNwbGl0KCcmJyk7XG4gICAgICB2YXIgcmVzdWx0ID0ge30sIHM7XG4gICAgICBwYWlycy5mb3JFYWNoKGZ1bmN0aW9uKHBhaXIpIHtcbiAgICAgICAgcyA9IHBhaXIuc3BsaXQoJz0nKTtcbiAgICAgICAgcmVzdWx0W3NbMF1dID0gZGVjb2RlVVJJQ29tcG9uZW50KHNbMV0gfHwgJycpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcbiAgICB9XG5cbiAgICBwb3N0SnNvbihyZXF1ZXN0LCBhcGksIGFjdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMuJGh0dHAoe1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgdXJsOiBjb25maWcucm9vdCArICdhcGkvcmVzdC8nICsgYXBpICArICcvJyArIGFjdGlvbiArICcuanNvbicsXG4gICAgICAgIGRhdGE6IHJlcXVlc3QsXG4gICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfVxuICAgICAgfSk7XG4gICAgfVxuXHR9XG59XG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLnRtcC90eXBpbmdzL3RzZC5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi91dGlsL3N1Z2FyLnRzXCIgLz5cblxubW9kdWxlIHZzLnRvb2xzLmZpZWxkcyB7XG4ndXNlIHN0cmljdCc7XG5cblx0ZXhwb3J0IGludGVyZmFjZSBJRmllbGRzUmVzb3VyY2Uge1xuXHRcdGZldGNoKGZpZWxkcz86IHN0cmluZyk6IG5nLklQcm9taXNlPGFueT47XG5cdFx0ZmV0Y2hIeWRyYXRpb25TdGF0cyhxdWVyeTogc3RyaW5nKTogbmcuSVByb21pc2U8YW55Pjtcblx0fVxuXG5cdGV4cG9ydCBjbGFzcyBGaWVsZHNSZXNvdXJjZSBpbXBsZW1lbnRzIElGaWVsZHNSZXNvdXJjZSB7XG5cdFx0c3RhdGljIHJlZk5hbWUgPSAnZmllbGRzUmVzb3VyY2UnO1xuXG5cdFx0ZmV0Y2g6IChwcm9wZXJ0aWVzPzogc3RyaW5nKSA9PiBhbnk7XG5cdFx0ZmV0Y2hIeWRyYXRpb25TdGF0czogKHF1ZXJ5OiBzdHJpbmcpID0+IGFueTtcblxuXHRcdC8qIEBuZ0luamVjdCAqL1xuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgc3VnYXI6IGFueSkge1xuXG5cdFx0XHR0aGlzLmZldGNoID0gKGZpZWxkcz86IGFueSkgPT4ge1xuXHRcdFx0XHR2YXIgZmwgPSAoZmllbGRzIHx8ICduYW1lLGNhdGVnb3J5LGRvY3MsZGlzcF9lbicpO1xuXHRcdFx0XHRyZXR1cm4gc3VnYXIucG9zdEZvcm0oJ3NvbHIvZmllbGRzL3NlbGVjdCcsIHRoaXMuZ2V0RmllbGRzUGFyYW1zKGZsKSkudGhlbigocmVzOiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiByZXMuZGF0YS5yZXNwb25zZS5kb2NzO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fTtcblxuXHRcdFx0dGhpcy5mZXRjaEh5ZHJhdGlvblN0YXRzID0gKHF1ZXJ5OiBzdHJpbmcpID0+IHtcblxuXHRcdFx0XHRyZXR1cm4gdGhpcy5mZXRjaCgpLnRoZW4oKGZpZWxkczogQXJyYXk8YW55PikgPT4ge1xuICAgICAgICAgIHZhciBmbCA9IHN1Z2FyLnBsdWNrKGZpZWxkcywgJ25hbWUnLCBmdW5jdGlvbihmaWVsZCkgeyByZXR1cm4gZmllbGQubmFtZS5pbmRleE9mKCdfJykgIT09IDAgJiYgZmllbGQuZG9jcyA+IDA7IH0pO1xuXG4gICAgICAgICAgcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdzb2xyL3YwL3NlbGVjdD8nICsgcXVlcnksIHRoaXMuZ2V0U3RhdHNQYXJhbXMoZmwpKS50aGVuKChyZXM6IGFueSkgPT4ge1xuICAgICAgICAgICAgdmFyIHN0YXRzRmllbGRzID0gcmVzLmRhdGEuZmFjZXRfY291bnRzLmZhY2V0X2ZpZWxkcztcbiAgICAgICAgICAgIHZhciB0b3RhbCA9IHJlcy5kYXRhLnJlc3BvbnNlLm51bUZvdW5kO1xuICAgICAgICAgICAgdGhpcy5hcHBseUh5ZHJhdGlvbihzdGF0c0ZpZWxkcywgZmllbGRzLCB0b3RhbCk7XG4gICAgICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuXHRcdFx0fTtcblxuXHRcdH1cblxuICAgIHByaXZhdGUgZ2V0RmllbGRzUGFyYW1zKGZsKSB7XG4gICAgICByZXR1cm4gJ3E9KjoqJmZsPScgKyBmbCArICcmcm93cz0xMDAwMCZzb3J0PW5hbWUlMjBhc2Mmd3Q9anNvbic7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIGdldFN0YXRzUGFyYW1zKGZsKSB7XG4gICAgICByZXR1cm4gJ2ZhY2V0PXRydWUmZmFjZXQubGltaXQ9MTAwMDAmZmFjZXQubWluY291bnQ9MTAwJnJvd3M9MCZ3dD1qc29uJmZhY2V0LmZpZWxkPScgKyBmbC5qb2luKCcmZmFjZXQuZmllbGQ9Jyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhcHBseUh5ZHJhdGlvbihzdGF0c0ZpZWxkcywgZmllbGRzLCB0b3RhbCkge1xuICAgICAgdmFyIHN0YXRzRmllbGQsIGNvdW50O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3RhdHNGaWVsZCA9IHN0YXRzRmllbGRzW2ZpZWxkc1tpXS5uYW1lXTtcbiAgICAgICAgaWYgKHN0YXRzRmllbGQgJiYgc3RhdHNGaWVsZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZmllbGRzW2ldLmlkID0gZmllbGRzW2ldLm5hbWU7XG4gICAgICAgICAgY291bnQgPSB0aGlzLmdldENvdW50KHN0YXRzRmllbGQpO1xuICAgICAgICAgIGZpZWxkc1tpXS5oeWRyYXRpb24gPSBjb3VudCAvIHRvdGFsICogMTAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENvdW50KGZpZWxkKSB7XG4gICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBmaWVsZC5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICBjb3VudCArPSBmaWVsZFtpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgfVxufVxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy50bXAvdHlwaW5ncy90c2QuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9maWVsZHMucmVzb3VyY2UudHNcIiAvPlxuXG5tb2R1bGUgdnMudG9vbHMuZmllbGRzIHtcbid1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMuZmllbGRzJywgWyd2cy50b29scy51dGlsJ10pXG5cdFx0LnNlcnZpY2UoRmllbGRzUmVzb3VyY2UucmVmTmFtZSwgRmllbGRzUmVzb3VyY2UpO1xuXG59XG4iLCJtb2R1bGUgdnMudG9vbHMucGFnZUNvbmZpZyB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMucGFnZUNvbmZpZycsIFtdKTtcclxufVxyXG4iLCIvKmdsb2JhbCBhbmd1bGFyLCAkLCBxdWVyeXN0cmluZywgY29uZmlnICovXHJcbmRlY2xhcmUgdmFyIGNvbmZpZztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5wYWdlQ29uZmlnJykuXHJcblx0LyogQG5nSW5qZWN0ICovXHJcblx0ZmFjdG9yeSgncGFnZUNvbmZpZ1Jlc291cmNlJywgZnVuY3Rpb24gKCRodHRwOiBhbnkpIHtcclxuXHJcblx0XHQndXNlIHN0cmljdCc7XHJcblxyXG5cdFx0dmFyIGNvbmZpZ1VyaSA9IGNvbmZpZy5yb290ICsgJ2FwaS9yZXN0L2Rpc3BsYXkvY29uZmlnLyc7XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldExpc3RRdWVyeVN0cmluZygpIHtcclxuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnVXJpICsgJ2xpc3QnO1xyXG5cdFx0XHRxdWVyeVN0cmluZyArPSAnP3JhbmQ9JyArIE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdHJldHVybiBxdWVyeVN0cmluZztcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQ6IHN0cmluZykge1xyXG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBjb25maWdVcmkgKyBpZDtcclxuXHRcdFx0cXVlcnlTdHJpbmcgKz0gJz9yYW5kPScgKyBNYXRoLnJhbmRvbSgpO1xyXG5cdFx0XHRyZXR1cm4gcXVlcnlTdHJpbmc7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldFBhZ2VDb25maWdMaXN0KCkge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KF9nZXRMaXN0UXVlcnlTdHJpbmcoKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcclxuXHRcdFx0XHQvLyBAVE9ETzogaGFuZGxlIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdFx0XHRcdHJldHVybiBlcnJvcjtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2dldFBhZ2VDb25maWcoaWQ6IHN0cmluZykge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KF9nZXRDb25maWdRdWVyeVN0cmluZyhpZCkpLnRoZW4oZnVuY3Rpb24gKGRhdGE6IGFueSkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9LCBmdW5jdGlvbihlcnJvcjogYW55KSB7XHJcblx0XHRcdFx0Ly8gQFRPRE86IGhhbmRsZSBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKTtcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9kZWxldGVQYWdlQ29uZmlnKGlkOiBzdHJpbmcpIHtcclxuXHRcdFx0cmV0dXJuICRodHRwLmRlbGV0ZShfZ2V0Q29uZmlnUXVlcnlTdHJpbmcoaWQpKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfc2F2ZVBhZ2VDb25maWcodGVtcGxhdGU6IGFueSkge1xyXG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdChjb25maWdVcmksIHRlbXBsYXRlKS50aGVuKGZ1bmN0aW9uIChkYXRhOiBhbnkpIHtcclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oZXJyb3I6IGFueSkge1xyXG5cdFx0XHRcdC8vIEBUT0RPOiBoYW5kbGUgZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhlcnJvcik7XHJcblx0XHRcdFx0cmV0dXJuIGVycm9yO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnZXRQYWdlQ29uZmlnczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIF9nZXRQYWdlQ29uZmlnTGlzdCgpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXRQYWdlQ29uZmlnOiBmdW5jdGlvbihpZDogc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIF9nZXRQYWdlQ29uZmlnKGlkKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZGVsZXRlUGFnZUNvbmZpZzogZnVuY3Rpb24oaWQ6IHN0cmluZykge1xyXG5cdFx0XHRcdHJldHVybiBfZGVsZXRlUGFnZUNvbmZpZyhpZCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHNhdmVQYWdlQ29uZmlnOiBmdW5jdGlvbih0ZW1wbGF0ZTogYW55KXtcclxuXHRcdFx0XHRyZXR1cm4gX3NhdmVQYWdlQ29uZmlnKHRlbXBsYXRlKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHR9KTtcclxuIiwibW9kdWxlIHZzLnRvb2xzLnNhdmVkU2VhcmNoIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy5zYXZlZFNlYXJjaCcsIFsndnMudG9vbHMudXRpbCddKTtcbn1cbiIsIi8qZ2xvYmFsIGFuZ3VsYXIsICQsIHF1ZXJ5c3RyaW5nLCBjb25maWcgKi9cbmRlY2xhcmUgdmFyIGNvbmZpZztcblxuYW5ndWxhci5tb2R1bGUoJ3ZzLnRvb2xzLnNhdmVkU2VhcmNoJykuXG5cdC8qIEBuZ0luamVjdCAqL1xuICBmYWN0b3J5KCdzYXZlZFNlYXJjaFJlc291cmNlJywgZnVuY3Rpb24gKCRodHRwOiBhbnksIHN1Z2FyKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgZnVuY3Rpb24gX2RvU2F2ZShzYXZlZFNlYXJjaDogYW55KSB7XG4gICAgICAgcmV0dXJuIHN1Z2FyLnBvc3RKc29uKHNhdmVkU2VhcmNoLCAnZGlzcGxheScsICdzc2VhcmNoJyk7XG4gICAgIH1cblxuICAgIGZ1bmN0aW9uIF9nZXRRdWVyeVN0cmluZyhpZD86IHN0cmluZykge1xuICAgICAgdmFyIHJvd3MgPSAxNTA7ICAvLyBAVE9ETyBzZXQgdG8gd2hhdCB3ZSByZWFsbHkgd2FudFxuICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gY29uZmlnLnJvb3QgKyAnc29sci9zc2VhcmNoL3NlbGVjdD8nO1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJ3Jvd3M9JyArIHJvd3MgKyAnJnJhbmQ9JyArIE1hdGgucmFuZG9tKCk7XG4gICAgICBxdWVyeVN0cmluZyArPSAnJmZsPWlkLHRpdGxlLGRlc2NyaXB0aW9uLG93bmVyLHBhdGgsc2hhcmUscXVlcnksY29uZmlnLG9yZGVyLHNhdmVkLHByaXZhdGUsdmlldyxfdmVyc2lvbl8sY29uZmlnX3RpdGxlOltjb25maWdUaXRsZV0scGFyYW0qLGxhYmVscyc7XG4gICAgICBxdWVyeVN0cmluZyArPSAnJnd0PWpzb24manNvbi53cmY9SlNPTl9DQUxMQkFDSyc7XG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoaWQpKSB7XG4gICAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmZnE9aWQ6JyArIGlkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHF1ZXJ5U3RyaW5nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9leGVjdXRlKGlkPzogc3RyaW5nKSB7XG4gICAgICByZXR1cm4gJGh0dHAuanNvbnAoX2dldFF1ZXJ5U3RyaW5nKGlkKSkudGhlbihmdW5jdGlvbiAoZGF0YTogYW55KSB7XG4gICAgICAgIHJldHVybiBkYXRhLmRhdGEucmVzcG9uc2UuZG9jcztcbiAgICAgIH0sIGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcbiAgICAgICAgLy8gQFRPRE86IGhhbmRsZSBlcnJvclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBnZXRTYXZlZFNlYXJjaGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF9leGVjdXRlKCk7XG4gICAgICB9LFxuXG4gICAgICBmZXRjaDogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuIF9leGVjdXRlKGlkKS50aGVuKGZ1bmN0aW9uKGRvY3MpIHtcbiAgICAgICAgICByZXR1cm4gZG9jc1swXTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICBzYXZlU2VhcmNoOiBmdW5jdGlvbihzYXZlZFNlYXJjaCwgcGFyYW1zKSB7XG4gICAgICAgLy8gIHNhdmVkU2VhcmNoLmNvbmZpZyA9IGNvbmZpZ1NlcnZpY2UuZ2V0Q29uZmlnSWQoKTtcbiAgICAgICAvLyAgc2F2ZWRTZWFyY2gucXVlcnkgPSBjb252ZXJ0ZXIudG9DbGFzc2ljUGFyYW1zKHBhcmFtcyk7XG4gICAgICAgcmV0dXJuIF9kb1NhdmUoc2F2ZWRTZWFyY2gpO1xuICAgICAgfSxcblxuICAgICAgZGVsZXRlU2VhcmNoOiBmdW5jdGlvbihpZDogc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuICRodHRwLmRlbGV0ZShjb25maWcucm9vdCArICdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIC8vIG9ic2VydmVycy5mb3JFYWNoKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICAgICAgICAvLyAgIGVudHJ5KGlkKTtcbiAgICAgICAgICAgICAgLy8gfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIG9yZGVyOiBmdW5jdGlvbihpZDogYW55LCBiZWZvcmVJZDogYW55LCBhZnRlcklkOiBhbnkpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAnJztcbiAgICAgICAgaWYgKGJlZm9yZUlkICE9PSBudWxsKSB7XG4gICAgICAgICAgZGF0YSArPSAnYmVmb3JlPScgKyBiZWZvcmVJZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YSAhPT0gJycpIHtcbiAgICAgICAgICBkYXRhICs9ICcmJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhZnRlcklkICE9PSBudWxsKSB7XG4gICAgICAgICAgZGF0YSArPSAnYWZ0ZXI9JyArIGFmdGVySWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmV0dXJuIHN1Z2FyLnBvc3RGb3JtKCdhcGkvcmVzdC9kaXNwbGF5L3NzZWFyY2gvJyArIGlkICsgJy9vcmRlcicsIGRhdGEpO1xuICAgICAgfSxcblxuICAgICAgZmV0Y2hMYWJlbHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdXJsID0gY29uZmlnLnJvb3QgKyAnc29sci9zc2VhcmNoL3NlbGVjdD9yb3dzPTAmZmFjZXQ9dHJ1ZSZmYWNldC5maWVsZD1sYWJlbHMmd3Q9anNvbiZyPScgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCh1cmwpLnRoZW4oZnVuY3Rpb24ocmVzcCkge1xuICAgICAgICAgIHJldHVybiByZXNwLmRhdGEuZmFjZXRfY291bnRzLmZhY2V0X2ZpZWxkcy5sYWJlbHM7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCkgeyAgLy8gZXJyb3IgaWYgbGFiZWxzIGZpZWxkIGRvZXNuJ3QgZXhpc3RcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuIiwibW9kdWxlIHZzLnRvb2xzLnRyYW5zbGF0ZSB7XG5cbiAgZXhwb3J0IGNsYXNzIFRyYW5zbGF0b3Ige1xuXG4gICAgcHJpdmF0ZSBmaWVsZHM6IGFueSA9IG51bGw7XG5cbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbmZpZzogYW55LCBwcml2YXRlICRodHRwOiBuZy5JSHR0cFNlcnZpY2UsIHByaXZhdGUgJHE6IG5nLklRU2VydmljZSkge1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkKCkge1xuICAgICAgdmFyIHJlc291cmNlVXJsID0gdGhpcy5jb25maWcucm9vdCArICdhcGkvcmVzdC9pMThuL2ZpZWxkcy9zdGFuZGFyZC5qc29uJztcblxuICAgICAgaWYgKCF0aGlzLmZpZWxkcykge1xuICAgICAgICByZXR1cm4gdGhpcy4kaHR0cC5nZXQocmVzb3VyY2VVcmwpLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgdGhpcy5maWVsZHMgPSByZXMuZGF0YTtcbiAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuJHEud2hlbigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB0cmFuc2xhdGVGaWVsZChmaWVsZDogc3RyaW5nKSB7XG4gICAgICB2YXIgdHJhbnNsYXRlZCA9IHRoaXMuZmllbGRzLkZJRUxEW2ZpZWxkXTtcbiAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZCh0cmFuc2xhdGVkKSkge1xuICAgICAgICByZXR1cm4gdHJhbnNsYXRlZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzaWZ5KGZpZWxkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNsYXNzaWZ5KHN0cjogc3RyaW5nKSB7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXy9nLCAnICcpO1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHdcXFMqL2csIGZ1bmN0aW9uKHR4dDogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0cmFuc2xhdG9yLnRzXCIgLz5cbm1vZHVsZSB2cy50b29scy50cmFuc2xhdGUge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZGVjbGFyZSB2YXIgY29uZmlnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCd2cy50b29scy50cmFuc2xhdGUnLCBbXSlcbiAgICAvKiBAbmdJbmplY3QgKi9cbiAgICAuZmFjdG9yeSgndHJhbnNsYXRvcicsIChjb25maWc6IGFueSwgJGh0dHA6IG5nLklIdHRwU2VydmljZSwgJHE6IG5nLklRU2VydmljZSkgPT4gbmV3IFRyYW5zbGF0b3IoY29uZmlnLCAkaHR0cCwgJHEpKVxuICAgIC5jb25zdGFudCgnY29uZmlnJywgY29uZmlnKTtcbn1cbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdWdhci50c1wiIC8+XG5tb2R1bGUgdnMudG9vbHMudXRpbCB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgndnMudG9vbHMudXRpbCcsIFtdKVxuICAgIC8qIEBuZ0luamVjdCAqL1xuICAgIC5mYWN0b3J5KCdzdWdhcicsIChjb25maWcsICRodHRwKSA9PiBTdWdhci5nZXRJbnN0YW5jZShjb25maWcsICRodHRwKSk7XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
//# sourceMappingURL=maps/vs.toolkit.src.js.map