<% extends '../base.html.swig' %>
<% block title %>Login<% endblock %>

<% block content %>
  <h1>Login</h1>
  <form method="post" action="?" role="form">
    <div class="form-group">
      <label class="control-label" for="input-email">Email</label>
      <input type="text" id="input-email" class="form-control" name="email" placeholder="Email">
    </div>
    <div class="form-group">
      <label class="control-label" for="input-password">Password</label>
      <input type="password" id="input-password" class="form-control" name="password" placeholder="Password">
    </div>
    <div class="form-group">
      <button type="submit" class="btn btn-primary">Sign in</button>
    </div>
  </form>
<% endblock %>
