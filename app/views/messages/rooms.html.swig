<% extends '../base.html.swig' %>

<% block title %>Registered rooms<% endblock %>

<% block content %>
  <h1>Registered rooms</h1>
  <ul>
    <% for room in rooms %>
    <li>
      <a href="<%= roomPath(room.displayname|url_encode) %>"><%= room.displayname %></a>
    </li>
    <% endfor %>
  </ul>
<% endblock %>
