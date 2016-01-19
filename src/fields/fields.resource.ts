/// <reference path="../../.tmp/typings/tsd.d.ts" />
/*global angular, $, querystring, config */
declare var config;

module vs.tools.fields {
'use strict';

	export interface IFieldResourceService {
		gettingFields(fields?: string): ng.IPromise<any>;
	}

	export class FieldResourceService implements IFieldResourceService {
		static refName = 'fieldResourceService';

		gettingFields: (fields?: string) => any;

		/* @ngInject */
		constructor(private $http: ng.IHttpService) {
			this.gettingFields = (fields?: string) => {
				var fl = (fields || 'name,category,docs,disp_en');
				return this.$http
					.jsonp(config.root +
						'solr/fields/select?q=*:*&fl={FIELDS}&wt=json&rows=500&json.wrf=JSON_CALLBACK'.replace('{FIELDS}', fl))
					.then(function(res: any) {
						return res.data.response.docs;
					}.bind(this));
			};
		}

	}
}