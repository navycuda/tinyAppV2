Route checklist

GET /

√ (user)  => /urls
√ (!user) => /login 

GET /urls

  (user)
    Index of urls
      +features
√ (!user)
√   error!

POST /urls
  (user)
    generates new short url, assigns
      users as owner
√ (!user)
√   error!

GET /urls/new

  (user)
    create new url page
√ (!user)
√   => /login

GET /urls/:id

√ (!id)
√   error!
  (user)
    (user.owns(id))
      edit url page
    (!user.owns(id))
      error!
√ (!user)
√   error!

PUT /urls/:id
√ (!id)
√   error!
  (user)
    (user.owns(id))
      updates url
      => /urls
√   (!user.owns(id))
√     error!
√ (!user)
√   error!

DELETE /urls/:id/delete
  (user)
    (user.owns(id))
      delete(id)
      => /urls
    (!user.owns(id))
      error!
  (!user)
    error!

GET /u/:id
√ (!id)
√   error!
√ (id)
√   => id.longURL

GET /login
√ (user)
√   => /urls
√ (!user)
√   login page

POST /login
  (email && password)
    set session
√ (!email || !password)
√   error!

GET /register
  (user)
    => /urls
  (!user)
    registration page

POST /register
  (!email || !password)
    error!
  (email.exists())
    error!
  create new user

POST /logout
  deletes session
  => /urls


STRETCH

urls
  date created
  number of times used
  number of unique uses