// To run this code, edit file 
// index.html or index.jade and change
// html data-ng-app attribute from
// angle to myAppName
// -----------------------------------

var myApp = angular.module('SLP_WebApp', ['angle']);
//myApp.config(["$locationProvider", function($locationProvider) {
//	$locationProvider.html5Mode(true);
//}]);


myApp.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

myApp.run([ "$log","$rootScope", "$state", "$stateParams", function($log,$rootScope, $state, $stateParams) {

    //guide: https://github.com/angular-ui/ui-router/wiki/Quick-Reference#note-about-using-state-within-a-template
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.offsidebarOverlap = true;
    $rootScope.encodeCite = {
        'http://purl.org/spar/cito/agreesWith': 1,
        'http://purl.org/spar/cito/cites': 2,
        'http://purl.org/spar/cito/citesAsAuthority': 3,
        'http://purl.org/spar/cito/citesAsDataSource': 4,
        'http://purl.org/spar/cito/citesAsEvidence': 5,
        'http://purl.org/spar/cito/citesAsMetadataDocument': 6,
        'http://purl.org/spar/cito/citesAsPotentialSolution': 7,
        'http://purl.org/spar/cito/citesAsRecommendedReading': 8,
        'http://purl.org/spar/cito/citesAsRelated': 9,
        'http://purl.org/spar/cito/citesAsSourceDocument': 10,
        'http://purl.org/spar/cito/citesForInformation': 11,
        'http://purl.org/spar/cito/compiles': 12,
        'http://purl.org/spar/cito/confirms': 13,
        'http://purl.org/spar/cito/containsAssertionFrom': 14,
        'http://purl.org/spar/cito/corrects': 15,
        'http://purl.org/spar/cito/credits': 16,
        'http://purl.org/spar/cito/critiques': 17,
        'http://purl.org/spar/cito/derides': 18,
        'http://purl.org/spar/cito/describes': 19,
        'http://purl.org/spar/cito/disagreesWith': 20,
        'http://purl.org/spar/cito/discusses': 21,
        'http://purl.org/spar/cito/disputes': 22,
        'http://purl.org/spar/cito/documents': 23,
        'http://purl.org/spar/cito/extends': 24,
        'http://purl.org/spar/cito/givesBackgroundTo': 25,
        'http://purl.org/spar/cito/givesSupportTo': 26,
        'http://purl.org/spar/cito/hasCitationCharacterization': 27,
        'http://purl.org/spar/cito/hasCitedEntity': 28,
        'http://purl.org/spar/cito/hasCitingEntity': 29,
        'http://purl.org/spar/cito/hasReply': 30,
        'http://purl.org/spar/cito/includesExcerptFrom': 31,
        'http://purl.org/spar/cito/includesQuotationFrom': 32,
        'http://purl.org/spar/cito/isAgreedWithBy': 33,
        'http://purl.org/spar/cito/isCitedAsAuthorityBy': 34,
        'http://purl.org/spar/cito/isCitedAsDataSourceBy': 35,
        'http://purl.org/spar/cito/isCitedAsEvidenceBy': 36,
        'http://purl.org/spar/cito/isCitedAsMetadataDocumentBy': 37,
        'http://purl.org/spar/cito/isCitedAsPotentialSolutionBy': 38,
        'http://purl.org/spar/cito/isCitedAsRecommendedReading': 39,
        'http://purl.org/spar/cito/isCitedAsRelatedBy': 40,
        'http://purl.org/spar/cito/isCitedAsSourceDocumentBy': 41,
        'http://purl.org/spar/cito/isCitedBy': 42,
        'http://purl.org/spar/cito/isCitedForInformationBy': 43,
        'http://purl.org/spar/cito/isCompiledBy': 44,
        'http://purl.org/spar/cito/isConfirmedBy': 45,
        'http://purl.org/spar/cito/isCorrectedBy': 46,
        'http://purl.org/spar/cito/isCreditedBy': 47,
        'http://purl.org/spar/cito/isCritiquedBy': 48,
        'http://purl.org/spar/cito/isDeridedBy': 49,
        'http://purl.org/spar/cito/isDescribedBy': 50,
        'http://purl.org/spar/cito/isDisagreedWithBy': 51,
        'http://purl.org/spar/cito/isDiscussedBy': 52,
        'http://purl.org/spar/cito/isDisputedBy': 53,
        'http://purl.org/spar/cito/isDocumentedBy': 54,
        'http://purl.org/spar/cito/isExtendedBy': 55,
        'http://purl.org/spar/cito/isParodiedBy': 56,
        'http://purl.org/spar/cito/isPlagiarizedBy': 57,
        'http://purl.org/spar/cito/isQualifiedBy': 58,
        'http://purl.org/spar/cito/isRefutedBy': 59,
        'http://purl.org/spar/cito/isRetractedBy': 60,
        'http://purl.org/spar/cito/isReviewedBy': 61,
        'http://purl.org/spar/cito/isRidiculedBy': 62,
        'http://purl.org/spar/cito/isSpeculatedOnBy': 63,
        'http://purl.org/spar/cito/isSupportedBy': 64,
        'http://purl.org/spar/cito/isUpdatedBy': 65,
        'http://purl.org/spar/cito/likes': 66,
        'http://purl.org/spar/cito/obtainsBackgroundFrom': 67,
        'http://purl.org/spar/cito/obtainsSupportFrom': 68,
        'http://purl.org/spar/cito/parodies': 69,
        'http://purl.org/spar/cito/plagiarizes': 70,
        'http://purl.org/spar/cito/providesAssertionFor': 71,
        'http://purl.org/spar/cito/providesConclusionsFor': 72,
        'http://purl.org/spar/cito/providesDataFor': 73,
        'http://purl.org/spar/cito/providesExcerptFor': 74,
        'http://purl.org/spar/cito/providesMethodFor': 75,
        'http://purl.org/spar/cito/providesQuotationFor': 76,
        'http://purl.org/spar/cito/qualifies': 77,
        'http://purl.org/spar/cito/refutes': 78,
        'http://purl.org/spar/cito/repliesTo': 79,
        'http://purl.org/spar/cito/retracts': 80,
        'http://purl.org/spar/cito/reviews': 81,
        'http://purl.org/spar/cito/ridicules': 82,
        'http://purl.org/spar/cito/sharesAuthorInstitutionWith': 83,
        'http://purl.org/spar/cito/sharesAuthorsWith': 84,
        'http://purl.org/spar/cito/sharesFundingAgencyWith': 85,
        'http://purl.org/spar/cito/speculatesOn': 86,
        'http://purl.org/spar/cito/supports': 87,
        'http://purl.org/spar/cito/updates': 88,
        'http://purl.org/spar/cito/usesConclusionsFrom': 89,
        'http://purl.org/spar/cito/usesDataFrom': 90,
        'http://purl.org/spar/cito/usesMethodIn': 91
    };


    $rootScope.decodeCite = [
    	"",
	    "http://purl.org/spar/cito/agreesWith",
	    "http://purl.org/spar/cito/cites",
	    "http://purl.org/spar/cito/citesAsAuthority",
	    "http://purl.org/spar/cito/citesAsDataSource",
	    "http://purl.org/spar/cito/citesAsEvidence",
	    "http://purl.org/spar/cito/citesAsMetadataDocument",
	    "http://purl.org/spar/cito/citesAsPotentialSolution",
	    "http://purl.org/spar/cito/citesAsRecommendedReading",
	    "http://purl.org/spar/cito/citesAsRelated",
	    "http://purl.org/spar/cito/citesAsSourceDocument",
	    "http://purl.org/spar/cito/citesForInformation",
	    "http://purl.org/spar/cito/compiles",
	    "http://purl.org/spar/cito/confirms",
	    "http://purl.org/spar/cito/containsAssertionFrom",
	    "http://purl.org/spar/cito/corrects",
	    "http://purl.org/spar/cito/credits",
	    "http://purl.org/spar/cito/critiques",
	    "http://purl.org/spar/cito/derides",
	    "http://purl.org/spar/cito/describes",
	    "http://purl.org/spar/cito/disagreesWith",
	    "http://purl.org/spar/cito/discusses",
	    "http://purl.org/spar/cito/disputes",
	    "http://purl.org/spar/cito/documents",
	    "http://purl.org/spar/cito/extends",
	    "http://purl.org/spar/cito/givesBackgroundTo",
	    "http://purl.org/spar/cito/givesSupportTo",
	    "http://purl.org/spar/cito/hasCitationCharacterization",
	    "http://purl.org/spar/cito/hasCitedEntity",
	    "http://purl.org/spar/cito/hasCitingEntity",
	    "http://purl.org/spar/cito/hasReply",
	    "http://purl.org/spar/cito/includesExcerptFrom",
	    "http://purl.org/spar/cito/includesQuotationFrom",
	    "http://purl.org/spar/cito/isAgreedWithBy",
	    "http://purl.org/spar/cito/isCitedAsAuthorityBy",
	    "http://purl.org/spar/cito/isCitedAsDataSourceBy",
	    "http://purl.org/spar/cito/isCitedAsEvidenceBy",
	    "http://purl.org/spar/cito/isCitedAsMetadataDocumentBy",
	    "http://purl.org/spar/cito/isCitedAsPotentialSolutionBy",
	    "http://purl.org/spar/cito/isCitedAsRecommendedReading",
	    "http://purl.org/spar/cito/isCitedAsRelatedBy",
	    "http://purl.org/spar/cito/isCitedAsSourceDocumentBy",
	    "http://purl.org/spar/cito/isCitedBy",
	    "http://purl.org/spar/cito/isCitedForInformationBy",
	    "http://purl.org/spar/cito/isCompiledBy",
	    "http://purl.org/spar/cito/isConfirmedBy",
	    "http://purl.org/spar/cito/isCorrectedBy",
	    "http://purl.org/spar/cito/isCreditedBy",
	    "http://purl.org/spar/cito/isCritiquedBy",
	    "http://purl.org/spar/cito/isDeridedBy",
	    "http://purl.org/spar/cito/isDescribedBy",
	    "http://purl.org/spar/cito/isDisagreedWithBy",
	    "http://purl.org/spar/cito/isDiscussedBy",
	    "http://purl.org/spar/cito/isDisputedBy",
	    "http://purl.org/spar/cito/isDocumentedBy",
	    "http://purl.org/spar/cito/isExtendedBy",
	    "http://purl.org/spar/cito/isParodiedBy",
	    "http://purl.org/spar/cito/isPlagiarizedBy",
	    "http://purl.org/spar/cito/isQualifiedBy",
	    "http://purl.org/spar/cito/isRefutedBy",
	    "http://purl.org/spar/cito/isRetractedBy",
	    "http://purl.org/spar/cito/isReviewedBy",
	    "http://purl.org/spar/cito/isRidiculedBy",
	    "http://purl.org/spar/cito/isSpeculatedOnBy",
	    "http://purl.org/spar/cito/isSupportedBy",
	    "http://purl.org/spar/cito/isUpdatedBy",
	    "http://purl.org/spar/cito/likes",
	    "http://purl.org/spar/cito/obtainsBackgroundFrom",
	    "http://purl.org/spar/cito/obtainsSupportFrom",
	    "http://purl.org/spar/cito/parodies",
	    "http://purl.org/spar/cito/plagiarizes",
	    "http://purl.org/spar/cito/providesAssertionFor",
	    "http://purl.org/spar/cito/providesConclusionsFor",
	    "http://purl.org/spar/cito/providesDataFor",
	    "http://purl.org/spar/cito/providesExcerptFor",
	    "http://purl.org/spar/cito/providesMethodFor",
	    "http://purl.org/spar/cito/providesQuotationFor",
	    "http://purl.org/spar/cito/qualifies",
	    "http://purl.org/spar/cito/refutes",
	    "http://purl.org/spar/cito/repliesTo",
	    "http://purl.org/spar/cito/retracts",
	    "http://purl.org/spar/cito/reviews",
	    "http://purl.org/spar/cito/ridicules",
	    "http://purl.org/spar/cito/sharesAuthorInstitutionWith",
	    "http://purl.org/spar/cito/sharesAuthorsWith",
	    "http://purl.org/spar/cito/sharesFundingAgencyWith",
	    "http://purl.org/spar/cito/speculatesOn",
	    "http://purl.org/spar/cito/supports",
	    "http://purl.org/spar/cito/updates",
	    "http://purl.org/spar/cito/usesConclusionsFrom",
	    "http://purl.org/spar/cito/usesDataFrom",
	    "http://purl.org/spar/cito/usesMethodIn"
    ];

    $rootScope.arr_colors = [
	    {},
	    {'color': '#9edae5', 'prop': 'http://purl.org/spar/cito/agreesWith'},
	    {'color': '#730034', 'prop': 'http://purl.org/spar/cito/cites'},
	    {'color': '#ffbb78', 'prop': 'http://purl.org/spar/cito/citesAsAuthority'},
	    {'color': '#aec7e8', 'prop': 'http://purl.org/spar/cito/citesAsDataSource'},
	    {'color': '#843c39', 'prop': 'http://purl.org/spar/cito/citesAsEvidence'},
	    {'color': '#2ca02c', 'prop': 'http://purl.org/spar/cito/citesAsMetadataDocument'},
	    {'color': '#bd9e39', 'prop': 'http://purl.org/spar/cito/citesAsPotentialSolution'},
	    {'color': '#e6550d', 'prop': 'http://purl.org/spar/cito/citesAsRecommendedReading'},
	    {'color': '#bcbd22', 'prop': 'http://purl.org/spar/cito/citesAsRelated'},
	    {'color': '#fdae6b', 'prop': 'http://purl.org/spar/cito/citesAsSourceDocument'},
	    {'color': '#1f77b4', 'prop': 'http://purl.org/spar/cito/citesForInformation'},
	    {'color': '#d6616b', 'prop': 'http://purl.org/spar/cito/compiles'},
	    {'color': '#ff7f0e', 'prop': 'http://purl.org/spar/cito/confirms'},
	    {'color': '#ad494a', 'prop': 'http://purl.org/spar/cito/containsAssertionFrom'},
	    {'color': '#c5b0d5', 'prop': 'http://purl.org/spar/cito/corrects'},
	    {'color': '#636363', 'prop': 'http://purl.org/spar/cito/credits'},
	    {'color': '#c49c94', 'prop': 'http://purl.org/spar/cito/critiques'},
	    {'color': '#17becf', 'prop': 'http://purl.org/spar/cito/derides'},
	    {'color': '#9467bd', 'prop': 'http://purl.org/spar/cito/describes'},
	    {'color': '#bdbdbd', 'prop': 'http://purl.org/spar/cito/disagreesWith'},
	    {'color': '#8c6d31', 'prop': 'http://purl.org/spar/cito/discusses'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/disputes'},
	    {'color': '#9e9ac8', 'prop': 'http://purl.org/spar/cito/documents'},
	    {'color': ' #637939', 'prop': 'http://purl.org/spar/cito/extends'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/givesBackgroundTo'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/givesSupportTo'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/hasCitationCharacterization'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/hasCitedEntity'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/hasCitingEntity'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/hasReply'},
	    {'color': '#e377c2', 'prop': 'http://purl.org/spar/cito/includesExcerptFrom'},
	    {'color': '#f7b6d2', 'prop': 'http://purl.org/spar/cito/includesQuotationFrom'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isAgreedWithBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isCitedAsAuthorityBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isCitedAsDataSourceBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isCitedAsEvidenceBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isCitedAsMetadataDocumentBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isCitedAsPotentialSolutionBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isCitedAsRecommendedReading'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isCitedAsRelatedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isCitedAsSourceDocumentBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isCitedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isCitedForInformationBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isCompiledBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isConfirmedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isCorrectedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isCreditedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isCritiquedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isDeridedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isDescribedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isDisagreedWithBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isDiscussedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isDisputedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isDocumentedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isExtendedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isParodiedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isPlagiarizedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isQualifiedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isRefutedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isRetractedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isReviewedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isRidiculedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isSpeculatedOnBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isSupportedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/isUpdatedBy'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/likes'},
	    {'color': '#d9d9d9', 'prop': 'http://purl.org/spar/cito/obtainsBackgroundFrom'},
	    {'color': '#7f7f7f', 'prop': 'http://purl.org/spar/cito/obtainsSupportFrom'},
	    {'color': '#cedb9c', 'prop': 'http://purl.org/spar/cito/parodies'},
	    {'color': '#dadaeb', 'prop': 'http://purl.org/spar/cito/plagiarizes'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/providesAssertionFor'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/providesConclusionsFor'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/providesDataFor'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/providesExcerptFor'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/providesMethodFor'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/providesQuotationFor'},
	    {'color': '#ff9896', 'prop': 'http://purl.org/spar/cito/qualifies'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/refutes'},
	    {'color': '#d62728', 'prop': 'http://purl.org/spar/cito/repliesTo'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/retracts'},
	    {'color': '#bcbddc', 'prop': 'http://purl.org/spar/cito/reviews'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/ridicules'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/sharesAuthorInstitutionWith'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/sharesAuthorsWith'},
	    {'color': '', 'prop': 'http://purl.org/spar/cito/sharesFundingAgencyWith'},
	    {'color': '#dbdb8d', 'prop': 'http://purl.org/spar/cito/speculatesOn'},
	    {'color': '#969696', 'prop': 'http://purl.org/spar/cito/supports'},
	    {'color': '#c7c7c7', 'prop': 'http://purl.org/spar/cito/updates'},
	    {'color': '#98df8a', 'prop': 'http://purl.org/spar/cito/usesConclusionsFrom'},
	    {'color': '#e7ba52', 'prop': 'http://purl.org/spar/cito/usesDataFrom'},
	    {'color': '#8c564b', 'prop': 'http://purl.org/spar/cito/usesMethodIn'}
    ];

	$rootScope.colorsMap = {
	    "http://purl.org/spar/cito/citesForInformation": {
	        color: "#1693A5" ,
	        toString: "cites for information",
	        value: "http://purl.org/spar/cito/citesForInformation" },
	    "http://purl.org/spar/cito/citesAsMetadataDocument": {
	        color: "#2f9e68",
	        toString: "cites as metadata document",
	        value: "http://purl.org/spar/cito/citesAsMetadataDocument" },
	    "http://purl.org/spar/cito/citesAsDataSource": {
	        color: "#1B6E72",
	        toString: "cites as data source",
	        value: "http://purl.org/spar/cito/citesAsDataSource" },
	    "http://purl.org/spar/cito/citesAsAuthority": {
	        color: "#6B8E23",
	        toString: "cites as authority",
	        value: "http://purl.org/spar/cito/citesAsAuthority" },
	    "http://purl.org/spar/cito/obtainsSupportFrom": {
	        color: "#663399",
	        toString: "obtains support from",
	        value: "http://purl.org/spar/cito/obtainsSupportFrom" },
	    "http://purl.org/spar/cito/includesExcerptFrom": {
	        color: "#2E8B57",
	        toString: "includes excerpt from",
	        value: "http://purl.org/spar/cito/includesExcerptFrom" },
	    "http://purl.org/spar/cito/confirms": {
	        color: "#D8BFD8",
	        toString: "confirms",
	        value: "http://purl.org/spar/cito/confirms" },
	    "http://purl.org/spar/cito/containsAssertionFrom": {
	        color: "#FF6347",
	        toString: "contains assertion from",
	        value: "http://purl.org/spar/cito/containsAssertionFrom" },
	    "http://purl.org/spar/cito/derides": {
	        color: "#CD5C5C",
	        toString: "derides",
	        value: "http://purl.org/spar/cito/derides" },
	    "http://purl.org/spar/cito/includesQuotationFrom": {
	        color: "#DAA520",
	        toString: "includes quotation from",
	        value: "http://purl.org/spar/cito/includesQuotationFrom" },
	    "http://purl.org/spar/cito/citesAsRelated": {
	        color: "#483D8B",
	        toString: "cites as related",
	        value: "http://purl.org/spar/cito/citesAsRelated" },
	    "http://purl.org/spar/cito/usesMethodIn": {
	        color: "#8B0000",
	        toString: "uses method in",
	        value: "http://purl.org/spar/cito/usesMethodIn" },
	    "http://purl.org/spar/cito/documents": {
	        color: "#008B8B",
	        toString: "documents",
	        value: "http://purl.org/spar/cito/documents" },
	    "http://purl.org/spar/cito/describes": {
	        color: "#698296",
	        toString: "describes",
	        value: "http://purl.org/spar/cito/describes" },
	    "http://purl.org/spar/cito/usesConclusionsFrom": {
	        color: "#efca95",
	        toString: "uses conclusions from",
	        value: "http://purl.org/spar/cito/usesConclusionsFrom" },
	    "http://purl.org/spar/cito/repliesTo": {
	        color: "#698296",
	        toString: "replies to",
	        value: "http://purl.org/spar/cito/repliesTo" },
	    "http://purl.org/spar/cito/qualifies": {
	        color: "#653838",
	        toString: "qualifies",
	        value: "http://purl.org/spar/cito/qualifies" },
	    "http://purl.org/spar/cito/corrects": {
	        color: "#7aa33e",
	        toString: "corrects",
	        value: "http://purl.org/spar/cito/corrects" },
	    "http://purl.org/spar/cito/agreesWith": {
	        color: "#6a5ca4",
	        toString: "agrees with",
	        value: "http://purl.org/spar/cito/agreesWith" },
	    "http://purl.org/spar/cito/citesAsEvidence": {
	        color: "#946D67",
	        toString: "cites as evidence",
	        value: "http://purl.org/spar/cito/citesAsEvidence" },
	    "http://purl.org/spar/cito/usesDataFrom": {
	        color: "#b559a2",
	        toString: "uses data from",
	        value: "http://purl.org/spar/cito/usesDataFrom" },
	    "http://purl.org/spar/cito/parodies": {
	        color: "#C71E3F",
	        toString: "parodies",
	        value: "http://purl.org/spar/cito/parodies" },
	    "http://purl.org/spar/cito/critiques": {
	        color: "#3d6e4e",
	        toString: "critiques",
	        value: "http://purl.org/spar/cito/critiques" },
	    "http://purl.org/spar/cito/compiles": {
	        color: "#ac4987",
	        toString: "compiles",
	        value: "http://purl.org/spar/cito/compiles" },
	    "http://purl.org/spar/cito/speculatesOn": {
	        color: "#896fc2",
	        toString: "speculates on",
	        value: "http://purl.org/spar/cito/speculatesOn" },
	    "http://purl.org/spar/cito/extends": {
	        color: "#613e49",
	        toString: "extends",
	        value: "http://purl.org/spar/cito/extends" },
	    "http://purl.org/spar/cito/citesAsSourceDocument": {
	        color: "#c4c5c9",
	        toString: "cites as source document",
	        value: "http://purl.org/spar/cito/citesAsSourceDocument" },
	    "http://purl.org/spar/cito/updates": {
	        color: "#f29598",
	        toString: "updates",
	        value: "http://purl.org/spar/cito/updates" },
	    "http://purl.org/spar/cito/discusses": {
	        color: "#1b3b14",
	        toString: "discusses",
	        value: "http://purl.org/spar/cito/discusses" },
	    "http://purl.org/spar/cito/citesAsPotentialSolution": {
	        color: "#2a2073",
	        toString: "cites as potential solution",
	        value: "http://purl.org/spar/cito/citesAsPotentialSolution" },
	    "http://purl.org/spar/cito/obtainsBackgroundFrom": {
	        color: "#2c51af",
	        toString: "obtains background from",
	        value: "http://purl.org/spar/cito/obtainsBackgroundFrom" },
	    "http://purl.org/spar/cito/reviews": {
	        color: "#302006",
	        toString: "reviews",
	        value: "http://purl.org/spar/cito/reviews" },
	    "http://purl.org/spar/cito/supports": {
	        color: "#7d7b58",
	        toString: "supports",
	        value: "http://purl.org/spar/cito/supports" },
	    "http://purl.org/spar/cito/citesAsRecommendedReading": {
	        color: "#cc370e",
	        toString: "cites as recommended reading",
	        value: "http://purl.org/spar/cito/citesAsRecommendedReading" },
	    "http://purl.org/spar/cito/credits": {
	        color: "#d3ccf0",
	        toString: "credits",
	        value: "http://purl.org/spar/cito/credits" },
	    "http://purl.org/spar/cito/disagreesWith": {
	        color: "#e89ec8",
	        toString: "disagrees with",
	        value: "http://purl.org/spar/cito/disagreesWith" },
	    "http://purl.org/spar/cito/plagiarizes": {
	        color: "#312673",
	        toString: "plagiarizes",
	        value: "http://purl.org/spar/cito/plagiarizes" }
	};
	$rootScope.inheritUrlParams = false;
	$rootScope.paramsTokensDelimiter = ";";
	$rootScope.showRefiningOptions = {value: false}
}]);

/* costanti per le tipologie di risultati */
myApp
    .constant("SEARCH_TYPE", {
        abstractSearch: "abstractSearch",
        titleSearch: "titleSearch",
        authorSearch: "authorSearch",
		singleArticleDoi: "singleArticleDoi",
		venueSearch: "venueSearch",
		list: "list"
    })
	.constant("ORDER_BY", {
		publicationYear : "publicationYear",
		title : "title",
		globalCitations : "globalCitations",
		totCitActs : "totCitActs"
	})
	.constant("SORT", {
		desc : true,
		asc : false
	})
	.constant("ARTICLE_TYPES", {
		JournalArticle:"Journal Article",
		ConferencePaper:"Conference Paper",
		JournalReviewArticle:"Journal Review Article",
		JournalEditorial:"Journal Editorial",
		Letter:"Letter",
		Article:"Article",
		ProceedingsPaper: "ProceedingsPaper",
		BookChapter: "BookChapter",
		AcademicProceedings : "AcademicProceedings",
		BibliographicReference: "BibliographicReference",
		ReportDocument: "ReportDocument",
		ExpressionCollection: "ExpressionCollection",
		Book: "Book"
	})
    .constant("FILTERS_TYPE", {
        Articles_types:"type",
        Articles_afterYear:"afterYear",
        Citations_afterYear:"citAfterYear",
        Citations_selfCitations:"selfCitations",
        Citations_authors:"citAuthors",
        Citations_functions_exclude:"citFunctionsExclude",
		Citations_functions:"citFunctions"
    })
	//todo: usare FILTER_TYPE per queste costanti
	.constant("ARTICLES_REFINEMENTS_PARAMS", "&orderBy&sort&afterYear&type")
	.constant("CITATIONS_REFINEMENTS_PARAMS", "&orderCitBy&sortCit&citAfterYear&selfCitations&citAuthors&citFunctions");

myApp.config(["$stateProvider","SEARCH_TYPE","ARTICLES_REFINEMENTS_PARAMS", "CITATIONS_REFINEMENTS_PARAMS", function($stateProvider, SEARCH_TYPE, ARTICLES_REFINEMENTS_PARAMS, CITATIONS_REFINEMENTS_PARAMS) {
    $stateProvider
		.state('app.home-search', {
			url: '/homeSearch',
			title: 'Search',
			templateUrl: getMyBasepath('home-search.html'),
			controller: 'HomeSearchController',
			controllerAs: 'HomeSearchCtrl'
		})
		.state('app.articles-results', {
			url: '/articles/?abstract&author&title&list&venue'+ARTICLES_REFINEMENTS_PARAMS+CITATIONS_REFINEMENTS_PARAMS,
			title: 'Articles Results',
			params: {
				newSearch: false,  // se newSearch=true vengono rimpiazzati i risultati di ricerca in LocalStorage e vengono rimossi tutti gli states
				searchQuery: undefined,  // query di ricerca (abstract, titolo, nome autore)
				authorUri: undefined,
				searchType: undefined,
				noReload: false
			},
        	templateUrl: getMyBasepath('articles-results.html'),
        	controller: 'ArticlesResultsController',
        	controllerAs: 'ArticlesResultsCtrl',
        	onEnter: ["StatesManagerService", "$stateParams", "ArticlesFiltersManager", 
	        	function(StatesManagerService, $stateParams, ArticlesFiltersManager){
	        		console.log($stateParams);
		            if (oneSearchParam($stateParams)) {
		                if ($stateParams.abstract) {
			                $stateParams.searchType = SEARCH_TYPE.abstractSearch;
			                $stateParams.searchQuery = $stateParams['abstract']
		                } else if ($stateParams.author) {
				            $stateParams.searchType = SEARCH_TYPE.authorSearch;
		                	$stateParams.searchQuery = $stateParams['author'];
			                $stateParams.authorUri = $stateParams['authorUri'];
			                $stateParams.authorName = $stateParams['authorName'];
			                $stateParams.authorSurname = $stateParams['authorSurname'];
			            } else if ($stateParams.title) {
				            $stateParams.searchType = SEARCH_TYPE.titleSearch;
			                $stateParams.searchQuery = $stateParams['title']
			            } else if ($stateParams.venue) {
				            $stateParams.searchType = SEARCH_TYPE.venueSearch;
			                $stateParams.searchQuery = $stateParams['venue']
			            }
		            } else {
			            //todo: notificare che la modalità di ricerca è unica
		            }
		            function oneSearchParam(params) {
		                //todo: da implementare
		                return true;
		            }
		            StatesManagerService.setState("app.articles-results", $stateParams);
	        	}],
			reloadOnSearch: false
      	})
	  	.state ('app.author-articles', {
		  url: '/author/:authorId/articles/?'+ARTICLES_REFINEMENTS_PARAMS+CITATIONS_REFINEMENTS_PARAMS,
		  title: 'Author articles',
		  params: {
			  newSearch: false,  // se newSearch=true vengono rimpiazzati i risultati di ricerca in LocalStorage e vengono rimossi tutti gli states
			  searchQuery: undefined,  // query di ricerca (abstract, titolo, nome autore)
			  authorUri: undefined,
			  authorName: undefined,
			  authorSurname: undefined,
			  searchType: undefined,
			  noReload: false
		  },
		  templateUrl: getMyBasepath('author-results.html'),
		  controller: 'ArticlesResultsController',
		  controllerAs: 'ArticlesResultsCtrl',
		  onEnter: ["ArticlesFiltersManager","StatesManagerService","$stateParams", 
		  	function(ArticlesFiltersManager,StatesManagerService,$stateParams){
		  	  //todo: da rifattorizzare, si può fare di meglio
		        //todo: il parametro searchType è da eliminare
	            if (oneSearchParam($stateParams)) {
	                if ($stateParams.abstract) {
		                $stateParams.searchType = SEARCH_TYPE.abstractSearch;
		                $stateParams.searchQuery = $stateParams['abstract']
	                } else if ($stateParams.author) {
			            $stateParams.searchType = SEARCH_TYPE.authorSearch;
		                $stateParams.searchQuery = $stateParams['author'];
		                $stateParams.authorUri = $stateParams['authorUri'];
		                $stateParams.authorName = $stateParams['authorName'];
		                $stateParams.authorSurname = $stateParams['authorSurname'];
		            } else if ($stateParams.title) {
			            $stateParams.searchType = SEARCH_TYPE.titleSearch;
		                $stateParams.searchQuery = $stateParams['title']
		            } else if ($stateParams.venue) {
			            $stateParams.searchType = SEARCH_TYPE.venueSearch;
		                $stateParams.searchQuery = $stateParams['venue']
		            }
	            } else {
		            //todo: notificare che la modalità di ricerca è unica
	            }
	            function oneSearchParam(params) {
	                //todo: da implementare
	                return true;
	            }
			    StatesManagerService.setState("app.author-articles", $stateParams);
		  }],
	      reloadOnSearch: false
		})
		.state('app.article-doi', {
			url: '/article/?doi'+CITATIONS_REFINEMENTS_PARAMS,
			title: 'Article',
			params: {
				newSearch: false,  // se newSearch=true vengono rimpiazzati i risultati di ricerca in LocalStorage e vengono rimossi tutti gli states
				//title: "", //non lo setto a null o undefined per un problema di ui-router che li converte in stringa "null" e "undefined", strano...
				title: "",
				searchType: SEARCH_TYPE.singleArticleDoi,            // tipologia di ricerca (abstract, titolo, autore)
				noReload: false
			},
			templateUrl: getMyBasepath('articles-results.html'),
			controller: 'ArticlesResultsController',
			controllerAs: 'ArticlesResultsCtrl',
			onEnter: ["StatesManagerService","$stateParams", function(StatesManagerService,$stateParams){
				StatesManagerService.setState("app.article-doi", $stateParams);
			}],
			reloadOnSearch: false
	  	})
		.state('app.bookmarks', {
			url: '/bookmarks',
			title: 'Bookmarks',
			templateUrl: getMyBasepath('bookmarks.html'),
			controller: 'BookmarksController',
			controllerAs: 'BookmarksCtrl'
		})
		.state('app.author-results', {
			url: '/author/?abstract&author&authorUri&authorName&authorSurname&title&list'+ARTICLES_REFINEMENTS_PARAMS+CITATIONS_REFINEMENTS_PARAMS,
			params: {
				newSearch: false,  // se newSearch=true vengono rimpiazzati i risultati di ricerca in LocalStorage e vengono rimossi tutti gli states
				searchQuery: undefined,  // query di ricerca (abstract, titolo, nome autore)
				authorUri: undefined,
				authorName: undefined,
				authorSurname: undefined,
				searchType: undefined,
				noReload: false
			},
			templateUrl: getMyBasepath('author-results.html'),
			controller: 'ArticlesResultsController',
			controllerAs: 'ArticlesResultsCtrl',
			onEnter: ["StatesManagerService","$stateParams","ArticlesFiltersManager", 
			function(StatesManagerService,$stateParams,ArticlesFiltersManager){
				//todo: da rifattorizzare, si può fare di meglio
				//todo: il parametro searchType è da eliminare
				if (oneSearchParam($stateParams)) {
					if ($stateParams.abstract) {
						$stateParams.searchType = SEARCH_TYPE.abstractSearch;
						$stateParams.searchQuery = $stateParams['abstract']
					} else if ($stateParams.author) {
			            $stateParams.searchType = SEARCH_TYPE.authorSearch;
		                $stateParams.searchQuery = $stateParams['author'];
		                $stateParams.authorUri = $stateParams['authorUri'];
		                $stateParams.authorName = $stateParams['authorName'];
		                $stateParams.authorSurname = $stateParams['authorSurname'];
		            } else if ($stateParams.title) {
						$stateParams.searchType = SEARCH_TYPE.titleSearch;
						$stateParams.searchQuery = $stateParams['title']
					} else if ($stateParams.venue) {
			            $stateParams.searchType = SEARCH_TYPE.venueSearch;
		                $stateParams.searchQuery = $stateParams['venue']
		            }
				} else {
					//todo: notificare che la modalità di ricerca è unica
				}

				function oneSearchParam(params) {
					//todo: da implementare
					return true;
				}
				StatesManagerService.setState("app.author-results",$stateParams);
			}],
			reloadOnSearch: false
		})
		.state ('app.comparisons', {
			url: '/comparisons',
			title: 'Authors comparison',
			templateUrl: getMyBasepath('comparisons.html'),
			controller: 'ComparisonsController',
			controllerAs: 'ComparisonsCtrl'
		})
		.state('app.settings', {
			url: '/settings',
			title: 'Settings',
			templateUrl: getMyBasepath('settings.html'),
			controller: 'SettingsController',
			controllerAs: 'SettingsCtrl'
		})
		.state('app.about', {
			url: '/about',
			title: 'About',
			templateUrl: getMyBasepath('about.html'),
			controller: 'AboutController',
			controllerAs: 'AboutCtrl'
		})
		.state('app.stateTest', {
			url: '/test/articles/:searchType/:searchQuery?param0&param1',
			title: 'test',
			templateUrl: getMyBasepath('testView.html'),
			controller: 'testController',
			controllerAs: 'testCtrl',
			reloadOnSearch: false
		})
}]);

// Set here the base of the relative path
// for all app views
function getMyBasepath(uri) {
    return 'app/views/appViews/' + uri;
}