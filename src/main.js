import angular from 'angular';
import angularUiRouter from 'angular-ui-router';
import templates from './cachedTemplates/templates';
import routes from './routes';
import applicationController from './app/applicationController';

let app = angular.module('application', ['ui.router', 'templates'])
  .config(["$stateProvider", "$urlRouterProvider", routes])
  .controller('applicationController', ['$injector', applicationController]);

export default app;