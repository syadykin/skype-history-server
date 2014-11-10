<!DOCTYPE html>
<html ng-app="app">
  <head>
    <meta charset="utf-8">
    <title>Skype History</title>
    <meta name="viewport" content="width=device-width">
    <link href="/assets/app.css" rel="stylesheet" type="text/css">
    <script src="/assets/vendor.js"></script>
    <script src="/assets/app.js"></script>
  </head>
  <body>
    <ng-include src="'t/nav.html'"></ng-include>
    <ng-include src="'t/flash.html'"></ng-include>
    <div class="container" id="content" ui-view></div>
  </body>
</html>
