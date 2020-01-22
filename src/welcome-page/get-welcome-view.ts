export function getWelcomeView() {
  return /*html*/`
  <main role="main" class="container-fluid pt-5">
    <div class="row">
      <div class="col">
        <img width="450" src="https://cdn.dribbble.com/users/129991/screenshots/4870591/phone_addiction.png" />
      </div>

      <div class="col-4">
        <h1>Rollbooking</h1>
        <p class="lead">Try how fast an simple rollbooking is:</p>
        <form action="/join" method="post" id="join-form">
          <div class="form-group">
            <input class="form-control form-control-lg" type="text" name="business_name" placeholder="Your Business Name" autofocus="" required="">
          </div>
          <div class="form-group">
            <input class="form-control form-control-lg" type="email" name="email" placeholder="Email" required="">
          </div>
          <div class="form-group">
            <input class="form-control form-control-lg" type="password" name="password" placeholder="Password" required="">
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary btn-lg btn-block">Continue</button>
          </div>
        </form>

      </div>
    </div>
  </main>
  `
}
