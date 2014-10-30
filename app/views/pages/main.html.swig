<% extends '../base.html.swig' %>

<% block content %>
    <h1><%= title %></h1>
    <p>Welcome aboard<% if user %>, <%= user.email %><% endif %>! Visit <a href="http://locomotivejs.org/">locomotivejs.org</a> for details.</p>
<% endblock %>
