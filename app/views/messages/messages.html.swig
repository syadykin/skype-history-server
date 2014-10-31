<% extends '../base.html.swig' %>

<% block title %>Room «<%= room.displayname %>» <%= year %>/<%= month %>/<%= day %><% endblock %>

<% block content %>
  <h1>Room «<%= room.displayname %>» <%= year %>/<%= month %>/<%= day %></h1>

  <ul class="messages">
    <% for msg in messages %>
    <li>
      <span class="time">[<%= msg.time %>]</span>
      <span class="name"><% if pmsg && pmsg.author == msg.author %>...<% else %><%= msg.from_dispname %>:<% endif %></span>
      <%= msg.body_xml | beautify | safe %>
    </li>
    <% set pmsg = msg %>
    <% endfor %>
  </ul>
<% endblock %>
