'use strict';

(function(){
    
    angular.module('infynectApp')
        .constant('constants', {
            HTTP_CODES : {
                BAD_REQUEST_CODE: 400,
                UNAUTHORIZED_CODE: 401,
                FORBIDDEN_CODE: 403,
                TOKEN_REQUIRED_CODE: 499,
                INTERNAL_SERVER_ERROR_CODE: 500
            },
            URLS: {
                login: {
                    method: 'POST', uri: '/auth/login'
                },
                logout: {
                    method: 'GET', uri: '/auth/logout'
                },
                register: {
                    method: 'POST', uri: '/auth/register'
                },
                getUserByUserId: {
                    method: 'GET', uri: '/users/{userId}'
                },
                getAllDevices: {
                    method: 'GET', uri: '/dev'
                },
                getDeviceById: {
                    method: 'GET', uri: '/dev/{deviceId}'
                },
                createDevice: {
                    method: 'POST', uri: '/dev'
                },
                updateDevice: {
                    method: 'PUT', uri: '/dev/{deviceId}'
                },
                deleteDevice: {
                    method: 'DELETE', uri: '/dev/{deviceId}'
                },
                getAllComplains: {
                    method: 'GET', uri: '/complain'
                },
                getComplainById: {
                    method: 'GET', uri: '/complain/{complainId}'
                },                
                createComplaint: {
                    method: 'POST', uri: '/complain'
                },
                getAllUsers: {
                    method: 'GET', uri: '/user'
                },
                getUserById: {
                    method: 'GET', uri: '/user/{userId}'
                },
                createUser: {
                    method: 'POST', uri: '/user'                    
                },
                updateUser: {
                    method: 'PUT', uri: '/user/{userId}'
                },
                deleteUser: {
                    method: 'DELETE', uri: '/user/{userId}'
                },
                getAllOrgs: {
                    method: 'GET', uri: '/org'
                },
                getOrgById: {
                    method: 'GET', uri: '/org/{orgId}'
                },
                createOrg: {
                    method: 'POST', uri: '/org'                    
                },
                updateOrg: {
                    method: 'PUT', uri: '/org/{orgId}'
                },
                deleteOrg: {
                    method: 'DELETE', uri: '/org/{orgId}'
                },
                remotecommand: {
                    method: 'POST', uri: '/monitor/rc'
                },
                getAppsById: {
                    method: 'GET', uri: '/monitor/{deviceId}'
                },
                getAllStats: {
                    method: 'GET', uri: '/stats/{userId}/{deviceId}/{startTime}/{endTime}'
                },
                uploadSSLCertificate: {
                    method: 'POST', uri: '/certificate/uploadSSLCertificate'
                },
                certificate: {
                    method: 'POST', uri: '/certificate/certificate'
                },
                acl: {
                    method: 'POST', uri: '/acl/acl'
                },
                qosstatic: {
                    method: 'POST', uri: '/qosstatic/qosstatic'
                },
                qoxstatic: {
                    method: 'POST', uri: '/qoxstatic/qoxstatic'
                },
                ott: {
                    method: 'POST', uri: '/ott/ott'
                 },
                live: {
                    method: 'POST', uri: '/live/live'
                },
                getAllStatic: {
                    method: 'GET', uri: '/qosstatic'
                },
                getAllAcl: {
                    method: 'GET', uri: '/acl'
                },
                getAllQox: {
                    method: 'GET', uri: '/qoxstatic'
                },
                getAllOtt: {
                    method: 'GET', uri: '/ott/{userId}'
                },
                getAllLive: {
                    method: 'GET', uri: '/live/{userId}'
                },
                getAllDomains: {
                    method: 'GET', uri: '/certificate'
                },
                deleteLive: {
                    method: 'DELETE', uri: '/live/{orgId}/{userId}/{domain}/{context}/{context_id}/{input_type}'
                },
                deleteStatic: {
                    method: 'DELETE', uri: '/qosstatic/{domain}/{userId}'
                },
                 getAllCertificate: {
                    method: 'GET', uri: '/certificate'
                },
                deleteDomainCertificates: {
                    method: 'DELETE', uri: '/certificate/{orgId}/{domainName}'
                },
                deleteOtt: {
                    method: 'DELETE', uri: '/ott/{orgId}/{domain}'
                },
                updateService: {
                    method: 'POST', uri: '/service'
                },
                getAllServices: {
                    method: 'GET', uri: '/service'
                },
                getDevByOrgId: {
                    method: 'GET', uri: '/dev/org/{userId}'
                },
                bypass: {
                    method: 'POST', uri: '/bypass'
                },
                getAllBypass: {
                    method: 'GET', uri: '/bypass/{orgId}'
                },
                deleteBypass: {
                    method: 'DELETE', uri: '/bypass/{bypassId}/{siteName}/{flag}'
                },
                installation: {
                    method: 'POST', uri: '/installationrequest'
                },
                getAllServiceRequest: {
                    method: 'GET', uri: '/servicerequest'
                },
                getInstallationRequest: {
                    method: 'GET', uri: '/installationrequest'
                },
                updateServiceRequest: {
                    method: 'PUT', uri: '/servicerequest/{reqInfo}'
                },
                createCategory: {
                    method: 'POST', uri: '/category'
                },
                getAllCategory: {
                    method: 'GET', uri: '/category'
                },
                deleteCategory:{
                     method: 'DELETE', uri: '/category/{category}'
                },
                updateCategory:{
                    method: 'PUT', uri: '/category/{categoryId}'
                },
                createBumpWhitelist: {
                    method: 'POST', uri: '/bump_whitelist'
                },
                getAllBumpWhitelist: {
                    method: 'GET', uri: '/bump_whitelist'
                },
                deleteWhitelistByOrgId: {
                    method: 'DELETE', uri: '/bump_whitelist/{orgId}/{domain}'
                },
                getAllSslbump: {
                    method: 'GET', uri: '/vas'
                },
                deleteBumplistByOrgId: {
                    method: 'DELETE', uri: '/vas/{orgId}/{domain}'
                },
                getReports: {
                    method: 'GET', uri: '/reports/{userId}/{deviceId}'
                },
                deleteTorrent: {
                    method: 'DELETE', uri: '/reports/{name}/{status}/{deviceId}'
                },
                deleteInstallation: {
                    method: 'DELETE', uri: '/installationrequest/{installationId}'
                },  
                updateStatusById: {
                    method: 'GET', uri: '/statistics/{deviceId}'
                },
                deleteServiceRequest: {
                    method: 'DELETE', uri: '/servicerequest/{Id}'
                },
                addCommand:{
                    method: 'POST', uri: '/rc_setup'
                },
                getCommandByRole:{
                    method: 'GET', uri: '/rc_setup/{info}'
                },
                deleteRemoteCommand:{
                    method: "DELETE", uri: '/rc_setup/{cmd}'
                },
                updateRemoteCommand:{
                    method: "PUT" , uri: '/rc_setup/{cmd}'
                },
                updateIR: {
                    method: 'PUT', uri: '/installationrequest/{installationId}'
                },
                createTariff: {
                    method: 'POST', uri: '/tariff'
                },
                getAllTariff: {
                    method: 'GET', uri: '/tariff'
                },
                updateTariff: {
                    method: 'PUT', uri: '/tariff'
                },
                deleteTariff: {
                    method: 'DELETE', uri: '/tariff/{tariffId}'
                },
                setUsage: {
                    method: 'POST', uri: '/usage'
                },
                getAllUsage: {
                    method: 'GET', uri:'/usage'
                },
                getUsageById: {
                    method: 'GET', uri:'/usage/{Id}'
                },
                getAllOrgUsage:{
                    method: 'GET', uri:'/usage/{orgId}/{userId}'
                },
                getServiceList: {
                    method: 'GET', uri: '/servicemapper/{deviceId}'
                },
                deleteService: {
                    method: 'DELETE', uri: '/service/{service}/{status}'
                },
                logStatusChange: {
                    method: 'POST', uri: '/servicemapper/changeStatus'
                },
                getDomainRecords : {
                    method: 'POST', uri: '/certificate/check'
                },
                requestChallenge : {
                    method: 'POST', uri: '/certificate/challenge'
                },
                acceptAcmeChallenge : {
                    method: 'POST', uri: '/certificate/validate'
                },
                uploadCertificate: {
                    method: 'POST', uri: '/certificate/upload'
                },
                updateSSLCertificate:{
                    method: 'PUT', uri:'/certificate'
                },
                getOrgSetting:{
                    method: 'GET',uri:'/org_setting'
                },
                updateSetting: {
                    method: 'PUT',uri:'/org_setting/{Id}'
                },
                createSetting: {
                    method: 'POST',uri:'/org_setting'
                },
                getDashBoardStats:{
                    method: 'GET' ,uri:'/statistics/{Id}/{filter}'
                }
            }
        });    
}())
