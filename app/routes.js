export default function routes($stateProvider, $urlRouterProvider){
  $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "home/home.tpl.html"
    });
};