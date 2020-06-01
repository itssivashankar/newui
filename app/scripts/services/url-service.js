'use strict';

(function() {    
    
    angular.module('infynectApp')
        .factory('UrlService', UrlService);
    
    UrlService.$inject = ['RestApiService', 'constants'];
    
    function UrlService(RestApiService, constants) {
        
        var urlService = {};

        // Add all the url here for the application
        // For Ex:  urlService.service = RestApiService.createGET('url of the api'); 
        
        urlService.login = RestApiService.createPOST(constants.URLS.login.uri);
        urlService.logout = RestApiService.createGET(constants.URLS.logout.uri);
        urlService.register = RestApiService.createPOST(constants.URLS.register.uri);

        // UserList
        urlService.getAllUsers = RestApiService.createGET(constants.URLS.getAllUsers.uri);
        urlService.getUserByUserId = RestApiService.createGET(constants.URLS.getUserById.uri);
        urlService.createUser = RestApiService.createPOST(constants.URLS.createUser.uri);
        urlService.updateUser = RestApiService.createPUT(constants.URLS.updateUser.uri);
        urlService.deleteUser = RestApiService.createDELETE(constants.URLS.deleteUser.uri);

        // UserList
        urlService.getAllOrgs = RestApiService.createGET(constants.URLS.getAllOrgs.uri);
        urlService.getOrgById = RestApiService.createGET(constants.URLS.getOrgById.uri);
        urlService.createOrg = RestApiService.createPOST(constants.URLS.createOrg.uri);
        urlService.updateOrg = RestApiService.createPUT(constants.URLS.updateOrg.uri);
        urlService.deleteOrg = RestApiService.createDELETE(constants.URLS.deleteOrg.uri);

        // DeviceList
        urlService.getAllDevices = RestApiService.createGET(constants.URLS.getAllDevices.uri);
        urlService.getDeviceById = RestApiService.createGET(constants.URLS.getDeviceById.uri);
        urlService.createDevice = RestApiService.createPOST(constants.URLS.createDevice.uri);
        urlService.updateDevice = RestApiService.createPUT(constants.URLS.updateDevice.uri);
        urlService.deleteDevice = RestApiService.createDELETE(constants.URLS.deleteDevice.uri);

        // ComplainList
        urlService.getAllComplains = RestApiService.createGET(constants.URLS.getAllComplains.uri);
        urlService.getComplainById = RestApiService.createGET(constants.URLS.getComplainById.uri);
        urlService.createComplaint = RestApiService.createPOST(constants.URLS.createComplaint.uri);

        urlService.remotecommand = RestApiService.createPOST(constants.URLS.remotecommand.uri);
        urlService.getAppsById = RestApiService.createGET(constants.URLS.getAppsById.uri);
        urlService.updateStatusById = RestApiService.createGET(constants.URLS.updateStatusById.uri);

        // StatsList
        urlService.getAllStats = RestApiService.createGET(constants.URLS.getAllStats.uri);

        // SSL Certificate
        urlService.uploadSSLCertificate = RestApiService.createPOST(constants.URLS.uploadSSLCertificate.uri);
        urlService.certificate = RestApiService.createPOST(constants.URLS.certificate.uri);
        urlService.acl = RestApiService.createPOST(constants.URLS.acl.uri);
        
        //QoX
        urlService.qoxstatic = RestApiService.createPOST(constants.URLS.qoxstatic.uri);

        urlService.ott = RestApiService.createPOST(constants.URLS.ott.uri);
        
        urlService.qosstatic = RestApiService.createPOST(constants.URLS.qosstatic.uri);
        
        urlService.live = RestApiService.createPOST(constants.URLS.live.uri);
        urlService.getAllStatic = RestApiService.createGET(constants.URLS.getAllStatic.uri);
        urlService.getAllOtt = RestApiService.createGET(constants.URLS.getAllOtt.uri);
        urlService.getAllAcl = RestApiService.createGET(constants.URLS.getAllAcl.uri);
        urlService.getAllQox = RestApiService.createGET(constants.URLS.getAllQox.uri);
        urlService.getAllLive = RestApiService.createGET(constants.URLS.getAllLive.uri);
        urlService.getAllAcl = RestApiService.createGET(constants.URLS.getAllAcl.uri);
        urlService.deleteLive = RestApiService.createDELETE(constants.URLS.deleteLive.uri);
        urlService.deleteStatic = RestApiService.createDELETE(constants.URLS.deleteStatic.uri);
        urlService.getAllCertificate = RestApiService.createGET(constants.URLS.getAllCertificate.uri);
        urlService.deleteDomainCertificates = RestApiService.createDELETE(constants.URLS.deleteDomainCertificates.uri);
        urlService.deleteOtt = RestApiService.createDELETE(constants.URLS.deleteOtt.uri);
        urlService.updateService = RestApiService.createPOST(constants.URLS.updateService.uri);
        urlService.getAllServices = RestApiService.createGET(constants.URLS.getAllServices.uri);

        urlService.getAllDomains = RestApiService.createGET(constants.URLS.getAllDomains.uri);
        urlService.getDevByOrgId = RestApiService.createGET(constants.URLS.getDevByOrgId.uri);
        urlService.bypass = RestApiService.createPOST(constants.URLS.bypass.uri);
        urlService.getAllBypass = RestApiService.createGET(constants.URLS.getAllBypass.uri);
        urlService.deleteBypass = RestApiService.createDELETE(constants.URLS.deleteBypass.uri);
        urlService.installation = RestApiService.createPOST(constants.URLS.installation.uri);
        urlService.getAllServiceRequest = RestApiService.createGET(constants.URLS.getAllServiceRequest.uri);
        urlService.getInstallationRequest = RestApiService.createGET(constants.URLS.getInstallationRequest.uri);
        urlService.updateServiceRequest = RestApiService.createPUT(constants.URLS.updateServiceRequest.uri);
        urlService.deleteInstallation = RestApiService.createDELETE(constants.URLS.deleteInstallation.uri);
        urlService.deleteServiceRequest = RestApiService.createDELETE(constants.URLS.deleteServiceRequest.uri);
        
        urlService.createCategory = RestApiService.createPOST(constants.URLS.createCategory.uri);
        urlService.getAllCategory = RestApiService.createGET(constants.URLS.getAllCategory.uri);
        urlService.deleteCategory = RestApiService.createDELETE(constants.URLS.deleteCategory.uri);
        urlService.updateCategory = RestApiService.createPUT(constants.URLS.updateCategory.uri);

        urlService.createBumpWhitelist = RestApiService.createPOST(constants.URLS.createBumpWhitelist.uri);
        urlService.getAllBumpWhitelist = RestApiService.createGET(constants.URLS.getAllBumpWhitelist.uri);
        urlService.deleteWhitelistByOrgId = RestApiService.createDELETE(constants.URLS.deleteWhitelistByOrgId.uri);

        urlService.getAllSslbump = RestApiService.createGET(constants.URLS.getAllSslbump.uri);
        urlService.deleteBumplistByOrgId = RestApiService.createDELETE(constants.URLS.deleteBumplistByOrgId.uri);

        urlService.getReports = RestApiService.createGET(constants.URLS.getReports.uri);
        urlService.deleteTorrent = RestApiService.createDELETE(constants.URLS.deleteTorrent.uri);
     
        urlService.addCommand = RestApiService.createPOST(constants.URLS.addCommand.uri);
        urlService.getCommandByRole = RestApiService.createGET(constants.URLS.getCommandByRole.uri);
        urlService.deleteRemoteCommand = RestApiService.createDELETE(constants.URLS.deleteRemoteCommand.uri);
        urlService.updateRemoteCommand = RestApiService.createPUT(constants.URLS.updateRemoteCommand.uri);

        urlService.updateIR = RestApiService.createPUT(constants.URLS.updateIR.uri);
        urlService.createTariff = RestApiService.createPOST(constants.URLS.createTariff.uri);
        urlService.getAllTariff = RestApiService.createGET(constants.URLS.getAllTariff.uri);
        urlService.updateTariff = RestApiService.createPUT(constants.URLS.updateTariff.uri);
        urlService.deleteTariff = RestApiService.createDELETE(constants.URLS.deleteTariff.uri);

        urlService.setUsage = RestApiService.createPOST(constants.URLS.setUsage.uri);
        urlService.getAllUsage= RestApiService.createGET(constants.URLS.getAllUsage.uri);
        urlService.getUsageById= RestApiService.createGET(constants.URLS.getUsageById.uri);
        urlService.getAllOrgUsage= RestApiService.createGET(constants.URLS.getAllOrgUsage.uri);

        urlService.getServiceList = RestApiService.createGET(constants.URLS.getServiceList.uri);
        urlService.deleteService = RestApiService.createDELETE(constants.URLS.deleteService.uri);
        urlService.logStatusChange = RestApiService.createPOST(constants.URLS.logStatusChange.uri);

        urlService.getDomainRecords = RestApiService.createPOST(constants.URLS.getDomainRecords.uri);
        urlService.requestChallenge = RestApiService.createPOST(constants.URLS.requestChallenge.uri);        
        urlService.acceptAcmeChallenge = RestApiService.createPOST(constants.URLS.acceptAcmeChallenge.uri);
        urlService.uploadCertificate = RestApiService.createPOST(constants.URLS.uploadCertificate.uri);
        urlService.updateSSLCertificate = RestApiService.createPUT(constants.URLS.updateSSLCertificate.uri);
        
        urlService.createSetting = RestApiService.createPOST(constants.URLS.createSetting.uri);
        urlService.updateSetting = RestApiService.createPUT(constants.URLS.updateSetting.uri);
        urlService.getOrgSetting = RestApiService.createGET(constants.URLS.getOrgSetting.uri);
        urlService.getDashBoardStats = RestApiService.createGET(constants.URLS.getDashBoardStats.uri);

        return urlService;
    }    
}());
