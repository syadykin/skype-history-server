<% extends "../base.html.swig" %>
<% block title %>Sign up<% endblock %>
<% block content %>
  <h1>Sign up</h1>
  <form method="post" role="form" action="?">
    <div class="form-group">
      <label class="control-label" for="input-email">Email</label>
      <input type="text" id="input-email" class="form-control" name="email" placeholder="Email">
    </div>
    <div class="form-group">
      <label class="control-label" for="input-password">Password</label>
      <input type="password" id="input-password" class="form-control" name="password" placeholder="Password">
    </div>
    <div class="form-group">
      <label class="control-label" for="input-password">Confirm password</label>
      <input type="password" id="input-confirm-password" class="form-control" name="confirm-password" placeholder="Confirm Password">
    </div>
    <div class="form-group">
      <button type="submit" class="btn btn-primary">Sign up</button>
    </div>
  </form>
<% endblock %>
