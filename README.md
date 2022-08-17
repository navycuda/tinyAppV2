Route checklist

GET /

√  (user)  => /urls
√  (!user) => /login 

GET /urls

  (user)
    Index of urls
      +features
  (!user)
    error!

GET /urls/new

  (user)
    create new url page
  (!user)
    => /login

GET /urls/:id

  (!id)
    error!
  (user)
    (!user.owns(id))
      error!
    (user.owns(id))
      edit url page
  (!user)
    error!






STRETCH

urls
  date created
  number of times used
  number of unique uses