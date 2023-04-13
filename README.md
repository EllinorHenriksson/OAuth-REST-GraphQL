# Assignment WT1 - OAuth + Consuming REST and GraphQL APIs

In modern web applications, the ability to delegate access between systems is crucial. One widely used standard for access delegation is OAuth (Open Authorization). Although the OAuth flow may appear complex at first glance, it is important to understand the roles and communication of the different stakeholders (client/consumer/service provider) involved.

## The assignment

Your task is to develop a three-legged OAuth2 access delegation system for a server-side rendered web application (the consumer) and GitLab (the service provider). The system should enable users to log in to the consumer application using their gitlab.lnu.se account (#10) and access the following information from GitLab: basic profile information (#11), the 101 most recent GitLab activities (#12), and information about groups, projects and the latest commit.

In particular, the system should allow users to view details about the first three projects in each of their first five groups, including information about the latest commit, provided that they have access to those groups (#13).

Note that you must not use any external packages or modules that have built-in OAuth support (#2).

If you're aiming for a higher grade, it's important you choose a design and structure for your code that makes it easier to develop, test, and maintain over time. (#14)

## Requirements

Please review [all requirements of the application](../../issues/) including (#1, #2, #3, #4, #5, #6, #7, #8, #9, #10, #11, #12, #13, and #14). Pay special attention to the labels indicating if a requirement is required or optional.

As you implement tasks and add functionality, it is important to create and close issues accordingly.
