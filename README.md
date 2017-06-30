Tourbillon: Discardment done right.
===================================

Tourbillon is a highly scalable,
cloud-based DaaS (discardment-as-a-service) offering. It is designed from
the ground up to allow users to discard data through a robust and
refreshingly easy-to-use API.

* **Tourbillon is reliable.** Our hosted instance guarantees 99.99% uptime:
  fewer than 1 in 10,000 messages written to it will be recorded on disk!
* **Tourbillon is fast.** Our codebase is written in pure NodeJS. NodeJS is
  the fastest web programming framework on the Internet. Furthermore, our
  database backend is based on MongoDB, whose occasional-consistency model
  is exceptionally well suited to the discardment-as-a-service paradigm.
* **Tourbillon is transparent.** Unlike the traditional /dev/null, Tourbillon
  provides feedback on your requests. By simply inspecting the HTTP response
  from the server, you can be confident that your data has been
  successfully discarded. In the rare cases when your data is _not_
  discarded, you will not receive a 20x response from the server, and
  you can respond accordingly.
* **Tourbillon is scalable.** No matter how many requests Tourbillon gets, it
  will always discard at least 99.99% of your data. In fact, some tests even
  indicate that the service's reliability _improves_ as it comes under
  load!

Using Tourbillon
----------------

You're probably reading this because you've got some data to discard, so
let's get started! Discarding data with Tourbillon is as simple as making
an HTTP POST request to our hosted instance:

    curl -H 'Content-Type: application/json' \
        --request POST \
        --data '{"data":"Goodbye world!"}' \
        https://tourbillon.herokuapp.com/dev/null

The body of your request must be JSON-formatted (for now!) and must have a
"data" key. The value associated with this key is the data to be discarded.
The body may also contain other arbitrary keys, which will be discarded with
your data.

If you get back a 204 response from the server, you're all set! You've
just discarded data in the cloud with Tourbillon.

Additionally, one of the nice things about the discardment-as-a-service
paradigm is that, even if you receive a connection error in attempting to POST
your data, it will still be discarded correctly.


Error Conditions
----------------

If Tourbillon fails to discard your data, it's explicit about the failure.
You'll get a 500 error like:

    ERROR: Data was written to MongoDB, so there's a nonzero chance it
           will end up on disk.

As explained above, Tourbillon is very reliable, but mistakes do happen
occasionally. In any case, you can retry your request immediately with
very high confidence that it'll work the second time around.
