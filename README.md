## Description

The purpose of this repository is to support development and maintenance
of extensions to the ReSpec application to enable it to produce
OASIS-styled specifications. The original work was done by Nicholas
Crossley of the OSLC Core TC.

The TAB itself is not formally an OASIS Technical Committee, but a
working group chartered by the OASIS Board to provide technical
assistance to OASIS. The TAB supports this work as part of its mission
to improve the standards development process and the quality of OASIS
Standards.

Please also refer to the [original README](README-respec.md).

## Getting started

### Using the built versions of ReSpec

Once you have set up a spec using a template (from a readily published spec, for example), you should only update the JS bundle URI when a new TAB ReSpec version is released:

    <script
      src="https://cdn.jsdelivr.net/gh/oasis-tcs/tab-respec@v2.1.27/builds/respec-oasis-common.js"
      async
      class="remove"
    ></script>

### Developing with ReSpec

First, switch your document to use ReSpec from a local development server:

    <script src="http://127.0.0.1:9000/respec-oasis-common.js" async class="remove"></script>

Next, start a dev server to serve this file:

    http-server -p 9000 builds/

Finally, set up an automatic ReSpec build when any of its files are changed:

    cd tools/
    fswatch -e '.*' -i '.*\.js$' -i '.*\.html$' --event Updated -x -r ../js/ | while read -r i; do node build-oasis-common.js ; done

Now you can refresh your specification document page and see how your local ReSpec build renders the document.

## OASIS Information

Members of the [Technical Advisory Board
(TAB)](https://www.oasis-open.org/committees/tab/), in concert with
members of the [OSLC Open Project](https://open-services.net/about/),
create and manage technical content in this TC GitHub repository (
<https://github.com/oasis-tcs/tab-respec>) as part of the TAB\'s
chartered work (_i.e._, the program of work and deliverables described
in its
[charter](https://www.oasis-open.org/committees/tab/charter.php)).

OASIS TC GitHub repositories, as described in [GitHub Repositories for
OASIS TC Members\' Chartered
Work](https://www.oasis-open.org/resources/tcadmin/github-repositories-for-oasis-tc-members-chartered-work),
are governed by the OASIS [TC
Process](https://www.oasis-open.org/policies-guidelines/tc-process),
[IPR Policy](https://www.oasis-open.org/policies-guidelines/ipr/), and
other policies, similar to TC Wikis, TC JIRA issues tracking instances,
TC SVN/Subversion repositories, etc. While they make use of public
GitHub repositories, these TC GitHub repositories are distinct from
[OASIS TC Open
Repositories](https://www.oasis-open.org/resources/open-repositories),
which are used for development of open source
[licensed](https://www.oasis-open.org/resources/open-repositories/licenses)
content.

### Contributions

As stated in this repository\'s [CONTRIBUTING
file](https://github.com/oasis-tcs/tab-respec/blob/master/CONTRIBUTING.md),
contributors to this repository are expected to be Members of the OSLC
Open Project or of the TAB, for any substantive change requests. Anyone
wishing to contribute to this GitHub project and
[participate](https://www.oasis-open.org/join/participation-instructions)
in the TC\'s technical activity is invited to join as an Project Member.
Public feedback is also accepted, subject to the terms of the [OASIS
Feedback
License](https://www.oasis-open.org/policies-guidelines/ipr/#appendixa).

### Licensing

Please see the
[LICENSE](https://github.com/oasis-tcs/tab-respec/blob/master/LICENSE.md)
file for description of the license terms and OASIS policies applicable
to the work in this GitHub project. Content in this repository is
intended to be part of the TAB\'s and the OSLC Open Project\'s permanent
record of activity, visible and freely available for all to use, subject
to applicable OASIS policies, as presented in the repository
[LICENSE](https://github.com/oasis-tcs/tab-respec/blob/master/LICENSE.md)
file.

### Contact

Please send questions or comments about [OASIS TC GitHub
repositories](https://www.oasis-open.org/resources/tcadmin/github-repositories-for-oasis-tc-members-chartered-work)
to the [OASIS Technical Committee
Administrator](mailto:tc-admin@oasis-open.org). For questions about
content in this repository, please contact the [OSLC Open
Project](https://open-services.net/about/).
