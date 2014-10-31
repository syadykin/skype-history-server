<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title><% block title %><%= title %><% endblock %></title>
    <meta name="viewport" content="width=device-width">
    <link href="/assets/app.css" rel="stylesheet" type="text/css">
    <script src="/assets/vendor.js"></script>
    <script src="/assets/app.js"></script>
  </head>
  <body ng-app="app">
    <nav class="navbar navbar-default">
      <div class="navbar-right" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav">
          <li><a href="<%= roomsPath() %>">Chat rooms</a></li>
          <% if user %>
            <li><a href="<%= signoutPath() %>">Logout</a></li>
          <% else %>
            <li><a href="<%= signinPath() %>">Sign in</a></li>
          <% endif %>
        </ul>
      </div>
    </nav>
    <div id="messages" class="container">
      <% if flash.error %>
      <div class="alert alert-error"><%= flash.error %></div>
      <% endif %>
      <% if flash.success %>
      <div class="alert alert-success"><%= flash.success %></div>
      <% endif %>
      <% if flash.info %>
      <div class="alert alert-info"><%= flash.info %></div>
      <% endif %>
    </div>


    <div class="container">
      <% block content %><% endblock %>
    </div>
  </body>
</html>
