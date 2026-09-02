---
title: "Learning Odin: waiting for posix signals"
date: 2026-09-03
description: "A field guide for doing mostly unnecessary things the hard way"
layout: "article"
cover: "odin.png"
series: "learning-odin"
---

As I wrapped up my time at Log my Care in late 2026, I knew that one of the ways I wanted to spend the following months was by deepening my technical knowledge with regards to high performance systems and take a peek behind the curtain of all the abstractions of TypeScript and Python, my daily drivers.

So in this series we are going to build a full stack web framework, starting with the backend, where we will leverage C libraries and working our way towards the front-end where we will compile to WebAssembly.

## Running head-first into POSIX

To start with, I wanted to just run the program until a termination or interrupt signal was received. We import `core:fmt` for access to some basic output logging and then `core:sys/posix` which wraps FFI bindings for POSIX, including those for signals and threads. Both of which I imagine will come in handy.

```odin
package httpd

import "core:fmt"
import "core:sys/posix" // FFI bindings for POSIX, including signals and threads

main :: proc() {
  set: posix.sigset_t
  // ...
}
```

### What is a `posix.sigset_t` and why do we need it?

A `posix.sigset_t` is essentially a bitmask, i.e. an unsigned numeric whole number where each bit acts as a boolean flag. In this case, each bit represents a POSIX signal we either care about (`1`) or don't (`0`). To make use of the bitmask we have to set the bits appropriately, which we can do via `posix.sigaddset`.

```odin
main :: proc() {
  set: posix.sigset_t

  posix.sigemptyset(&set)
  posix.sigaddset(&set, .SIGINT)
  posix.sigaddset(&set, .SIGTERM)
}
```

### Where do `.SIGINT` and `.SIGTERM` come from?

It's an [implicit selector expression](https://odin-lang.org/docs/overview/#implicit-selector-expression), meaning that Odin is able to infer which enum should be used as the second argument to `posix.sigaddset` and as a result we can use an abbreviated form to indicate the value we are passing from that enum. We could also reference them explicitly.

```odin
main :: proc() {
  set: posix.sigset_t

  posix.sigemptyset(&set)
  posix.sigaddset(&set, posix.Signal.SIGINT)
  posix.sigaddset(&set, posix.Signal.SIGTERM)
}
```

Each value of the enum maps to a constant ultimately defined in `libc`, declaring which position bit represents which signal, e.g. 

- `libc.SIGINT :: 2` 
- `libc.SIGTERM :: 15`

After calling `posix.sigaddset` our `set` variable now holds a numeric value which when represented in bits would look something like `0000 0000 0000 0000 0100 0000 0000 0010`, where the 2nd and 15th have been set to `1`.

Now let's let the operating system know that we're taking ownership of these signals.

```odin
  if posix.pthread_sigmask(.BLOCK, &set, nil) != .NONE {
    fmt.eprintln("failed to block SIGINT or SIGTERM") // write to stderr
    return
  }
```

`.BLOCK` indicates how we want `set` to modify the existing signal handling configuration, and `.NONE` is another implicit selector expression, referring to `posix.Errno.NONE` i.e. the function returns `0` meaning no error was encountered.

At this point, we actually found a mistake in the comments of `core/sys/posix/signal_libc.odin`.

```odin/1-2
Sig :: enum c.int {
	// Resulting set is the union of the current set and the signal set and the complement of
	// the signal set pointed to by the argument.
	BLOCK   = SIG_BLOCK,
  // ...
}
```

In fact (obviously) `.BLOCK` returns plainly the union, whereas the complement is only considered for `.UNBLOCK` and we can confirm this by reviewing the `sigprocmask(2)` man page by executing `man sigprocmask`

```text/19
SIGPROCMASK(2)                              System Calls Manual                             SIGPROCMASK(2)

NAME
     sigprocmask – manipulate current signal mask

SYNOPSIS
     #include <signal.h>

     int
     sigprocmask(int how, const sigset_t *restrict set, sigset_t *restrict oset);

DESCRIPTION
     The sigprocmask() function examines and/or changes the current signal mask (those signals that are
     blocked from delivery).  Signals are blocked if they are members of the current signal mask set.

     If set is not null, the action of sigprocmask() depends on the value of the parameter how.  The
     signal mask is changed as a function of the specified set and the current mask.  The function is
     specified by how using one of the following values from ⟨signal.h⟩:

     SIG_BLOCK    The new mask is the union of the current mask and the specified set.

     SIG_UNBLOCK  The new mask is the intersection of the current mask and the complement of the specified
                  set.

     SIG_SETMASK  The current mask is replaced by the specified set.
```

[Having resolved this](https://github.com/odin-lang/Odin/pull/7503), we move on to waiting for and capturing the signal for shutdown itself.

```odin
  // ...

  fmt.println("waiting for shutdown signal")

  sig: posix.Signal

  if err := posix.sigwait(&set, &sig); err != .NONE {
    // Will only fail due to misconfiguration of `set` (`EINVAL`)
    fmt.eprintln("failed to wait for SIGINT or SIGTERM", err)
    return
  }

  fmt.println("shutdown signal received", sig)

  shutdown()
}

shutdown :: proc() {
  fmt.println("shutdown complete")
}
```

And with that we can wrap up part one. The next step will be to connect this up with `microhttpd` so that we have a persistent web server which is responsive to `SIGINT` and `SIGTERM`.