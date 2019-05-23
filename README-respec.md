ReSpec
======

ReSpec is a JS library that makes it easier to write technical specifications, or documents
that tend to be technical in nature in general. It was originally designed for the purpose
of writing W3C specifications, but this fork is maintained purely for OASIS specifications.
For more information on the history of ReSpec, see the README.md of the W3C variant.

Important Note
==============

ReSpec is not endorsed by W3C or OASIS, and nobody should expect the W3C Webmaster or OASIS TC Administrator
to provide advice on problems encountered with ReSpec,
or on why it may be failing to produce compliant content.

Want to see complete documentation?
===================================

Thorough documentation for the W3C variant of ReSpec
can be found at http://www.w3.org/respec, with a github repository
for the sources at https://github.com/w3c/respec-docs.
That documentation is not accurate for this OASIS fork, but it is as close as we have right now!

How to contribute?
==================

It is common for people to contribute to RS, notably to make changes to the biblio references. You
certainly are welcome to submit whatever change you wish to (though if it's a complex feature please
try to coordinate with others first to avoid working long on something that will then be rejected).

If you're familiar with GitHub then contributing is simple: just fork and make pull requests. Please
just be careful to note that the primary branch is `gh-pages` and not `master` (this ensures that
the result gets published on the Web). **More importantly**, please note that the development branch
is `feature/oasis-style`. If you are making patches and pull requests, please base them off this branch.

If you're not familiar with GitHub, you need to follow the following steps:

* Get a GitHub account. This is done quickly, and the GH people will not bother you at all. Plus,
  it's pretty much a requirement for the majority of OSS communities these days.
* If all you want to make is a small, simple change, you can use the Web interface. Navigate to the
  file that you want to change, click "Edit this file" in the toolbar, then save your changes - they
  will get sent to the project for approval (which ought to be quick).
* If you wish to make more complex changes, you will need to fork the project (click "Fork"), clone
  the resulting repository, make the changes there, and push it back. Then click the "Pull Request"
  button. This allows you to request that the project integrate your changes. Those should normally
  get processed relatively fast (depending on how complex they are).

## Releasing ReSpec

### OASIS Profile

Normally, only @ndjc makes releases. But in the eventuality that he is not available, others
can follow this process:

1. Make sure you are up to date and on the 'feature/oasis-style' branch (git up; git checkout feature/oasis-style)
2. Go to 'tools'
3. Bump the version in `package-oasis.json`.
4. Run the build script (node build-oasis-common.js). This should respond "OK!" (if not, fix the
   issue).
5. Add the new build (git add builds/respec-oasis-common-m.n.r.js).
6. Commit your changes (git commit)
7. Merge to gh-pages (git checkout gh-pages; git merge feature/oasis-style)
8. (when needed) Tag the release (git tag v3.x.y) and be sure that git is pushing tags.
9. Push everything back to the server (make sure you are pushing at least the `feature/oasis-style` and
   `gh-pages` branches).

The simplest way of doing this, is to just run `tools/release.js`. This will prompt you a few times
with the above process.

This hasn't been adopted by OASIS, this work is in progress.
