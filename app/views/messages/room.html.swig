<% extends '../base.html.swig' %>

<% block title %>Room «<%= room.displayname %>»<% endblock %>

<% block content %>
  <h1>Room «<%= room.displayname %>»</h1>

  <!-- Tab panes -->
  <ul class="nav nav-pills">
    <% for y in years %>
    <li<% if year == y %> class="active"<% endif %>><a href="<%= roomYearPath(room.chatname|url_encode, y) %>"><%= y %></a></li>
    <% endfor %>
  </ul>

  <table class="calendar">
  <% for month in [1,2,3,4,5,6,7,8,9,10,11,12] %>
    <% set grid = date|calendar(month) %>
    <% if (month + 3) % 4 == 0 %><tr><% endif %>
    <td>
      <table>
        <tr><th colspan="7"><%= date|date('F') %></th><tr>
        <% for week in grid %>
        <tr>
          <% for day in week %>
          <td<% if day.future %> class="o"<% endif %>>
          <% if days[month] && days[month][day.day] %>
          <a href="<%= messagesPath(room.chatname|url_encode, year, month, day.day) %>"><%= day.day %></a>
          <% else %>
          <%= day.day %>
          <% endif %>
          </td>
          <% endfor %>
        </tr>
        <% endfor %>
      </table>
    </td>
    <% if month % 4 == 0 %></tr><% endif %>
  <% endfor %>
  </table>
<% endblock %>
