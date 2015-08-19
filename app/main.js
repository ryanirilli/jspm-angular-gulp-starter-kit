import angular from 'angular';
import angularUiRouter from 'angular-ui-router';
import applicationController from './applicationController';
import templates from './cachedTemplates/templates';
import routes from './routes';

let app = angular.module('pointsLoyaltyWallet', ['ui.router', 'templates'])
  .config(["$stateProvider", "$urlRouterProvider", routes])
  .controller('applicationController', ['$injector', applicationController]);

export default app;