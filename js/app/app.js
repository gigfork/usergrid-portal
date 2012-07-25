// fix for IE8 which has no console.log... go figure
window.console = window.console || {};
window.console.log = window.console.log || function() {};
// fix end here
usergrid.session = new Session();
usergrid.currentUser = new User();
usergrid.currentApp = new Application();
usergrid.currentOrg = new Organization();
usergrid.organizations = new Organizations();
usergrid.client = new Client();

var Pages = new UsergridPages();


$(document).ready(function () {
  var query_params = getQueryParams();
  initCore();
  initUI(query_params);
  startApp();

  function initCore() {
    prepareLocalStorage();
    parseParams();    
  }
  
  function initUI(query_params) {
    usergrid_console_app(Pages, query_params);
    initMenu();
    StatusBar.Init('#statusbar-placeholder');
    toggleableSections();
  }

  function startApp() {
    if (!usergrid.session.loggedIn()) {
      // test to see if the Portal is running on Apigee, if so, send to SSO, if not, fall through to login screen
      if ( usergrid.console.useSSO() ){
        Pages.clearPage();
        usergrid.console.sendToSSOLoginPage();
      } else if (query_params.goto_signup) {
        Pages.ShowPage("signup");
      } else {
        usergrid.console.showLoginForNonSSO();
      }
    } else {
      usergrid.console.autoLogin(
        function() {
          usergrid.console.loginOk();
        },
        function() {
          usergrid.console.logout();
        }
      );
    }

  }

  function initMenu() {
    $('.navbar .dropdown-toggle').dropdown();
    $('#sidebar-menu .dropdown-toggle').dropdown();
    $('#logout-link').click(usergrid.console.logout);
    $('#hideBanner').click(Pages.hideBanner);

    var publicMenu = $('#publicMenu');
    var privateMenu =$('#privateMenu');

    Pages.AddPage({name:'login', menu:publicMenu});
    //Pages.ShowPage('login');
    Pages.AddPage({name:'signup', menu:publicMenu});
    Pages.AddPage({name:'forgot-password', menu:publicMenu});
    Pages.AddPage({name:'post-signup', menu:publicMenu});
    Pages.AddPage({name:'console', menu:privateMenu, initFunction:initConsole, showFunction:usergrid.console.pageSelectHome});

  }

  function initConsole() {
    //Pages.AddPanel(pageName,linkSelector,boxSelector,initfunc,showfunc);
    Pages.AddPanel('organization', null, null, null, null);
    Pages.AddPanel('console', null, null, null ,null );
    Pages.AddPanel('application', null, null, null, usergrid.console.pageSelectApplication);
    Pages.AddPanel('user', "#sidebar-menu a[href='#users']", null, null, null);
    Pages.AddPanel('users', null, null, null, usergrid.console.pageSelectUsers);
    Pages.AddPanel('group', "#sidebar-menu a[href='#groups']", null, null, null);
    Pages.AddPanel('groups', null, null, null, usergrid.console.pageSelectGroups);
    Pages.AddPanel('roles', null, null, null, usergrid.console.pageSelectRoles);
    Pages.AddPanel('activities', null, null, null, usergrid.console.pageSelectActivities);
    Pages.AddPanel('collections', null, null, null, usergrid.console.pageSelectCollections);
    Pages.AddPanel('analytics', null, null, null, usergrid.console.pageSelectAnalytics);
    Pages.AddPanel('settings', null, null, null, usergrid.console.pageSelectSettings);
    Pages.AddPanel('shell', null, null, null, usergrid.console.pageSelectShell);
    Pages.AddPanel('account', "#account-link", null, null, usergrid.console.requestAccountSettings);
    //$("#sidebar-menu > ul > li > a").click(Pages.ShowPanel);
  }

});
