export default function routes($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "app/home/home.tpl.html"
    });
};