# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.11](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.10...v0.3.11) (2021-11-12)


### Features

* implement keywords as links to search ([f05186b](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/f05186bd71182fdb747c1f01d11927697223d856))
* implemented UnitPlaceSelectorField ([1fc5169](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/1fc5169bbf66566a41865884c555ee922aff4357))
* initialize enrolment form from local storage if possible ([d3623df](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/d3623dfe89ff3089c28f36a8bce1437de8d244ae))
* integrate unified search and use division from there ([224d2a1](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/224d2a1dc288c5c410d684df40b5529bbcb703bc))
* new event page layout ([525cc2f](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/525cc2f448ca2e45f15da2affbb489f1384ba37e))
* new search form panel and event search page ([9736c8b](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/9736c8b4314aa78c280f9c33f8c3ba999966f123))
* show timespan in days in event card when occurrence spans multiple days ([4a2e578](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/4a2e578ce2e54dbf5d1d9c42f23cdc18326f278e))
* updated the study group and servicemap api schemas ([15e6eaf](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/15e6eaf2a5e97240e3e7e4aca919ce22677bd693))


### Bug Fixes

* act errors in CreateEnrolmentPage ([d7cd3fb](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/d7cd3fb79c578ac6d84a6509d3e52f78d92c9d7e))
* add check for undefined connectedNode in cms page ([5fb4eaa](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/5fb4eaa5ab73b25f2a808234241d48c6a36181a4))
* add missing swedish translations ([ac76169](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ac76169672fda943bb873a24ee0ba3cc0cc7567b))
* add sv translation to labelKeywordLink ([4e73213](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/4e732130ddae5abf8e5d38166699870c8def8e12))
* better translation for unit field checkbox ([2b0ea46](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/2b0ea464cc360a68eaf0d3e3929aae8371213cb8))
* couple more swedish translations ([3506d88](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/3506d88547d2eefc417cdb663db9097821367c23))
* delete comma from review.yml ([5491471](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/54914713473d17e7d18216c9352bdd766a9fa281))
* delete neighborhood related mock utils ([93c0a5d](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/93c0a5d8accbd9a5b0e2ff80706af7c5ee15b571))
* delete some unused imports ([c1bcc5c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/c1bcc5c6ae155327b7de4e334be81b79e9afa8a8))
* dont try to fetch language options from cms when not on cms page ([3a639c9](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/3a639c9e2d04de817107d389b54c137641bb7614))
* english translation for keyword link label ([9503a1d](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/9503a1d4a6592204d25d7620d8b9d9a564a10707))
* eventsSearchPage test mock ([105fecb](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/105fecb4029e5a89066f4703a016ae513b844ffe))
* external enrolment link that was not rendered ([5129f21](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/5129f212bc3a191eb1d5f72dbe3a4a854b4ff41b))
* how some info for multi day occurrences are shown ([54e8ac9](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/54e8ac9474822f4694519c94386dba0b58ff2818))
* linter errors and warnings ([4af8067](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/4af8067155ff7c089546d8f9a8342726640b19d9))
* lodash/debounce mock comment ([bff8482](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/bff84823f2b40e5a1ed06e015c814eea83dba083))
* prevent focus reset when using search in EventsSearchPage ([74413d4](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/74413d43577c2009d6dab45a0b33b09863f451af))
* removed console logs and fixed nullable validation in enrolment ([54888aa](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/54888aac0f01220394712c1c840a41a56fb8ca96))
* skip cms page test because next-page-tester doesn't support next@12 ([508ea02](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/508ea024d7e55e025253fc9b0d9a0753e86faab3))
* swedish translations ([221c690](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/221c6907af9bfc2adafe9d6e9c504450edd33edd))
* tyhjennä lomake swedish translation ([afe6c20](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/afe6c201aa4a7d6c69aa3d2b3dd6de229f0daa85))
* update keyword links to work with new events search page ([906af5f](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/906af5fcc3d7d94cba25949442f700eac7791894))
* update start/server files to mjs also in Dockerfile ([be731ab](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/be731ab77f3e2aff4f5c39fb066a889849f7c11d))
* use d.M.yyyy format that comply with hds guidelines ([9d3257f](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/9d3257f8661b4b26dec6bd1fdcdb5d6f2a08cce9))

### [0.3.10](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.9...v0.3.10) (2021-09-29)


### Bug Fixes

* remove lookbehind regex operator to fix safari bug ([d2b21ff](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/d2b21ff01dde8638548a4a0b75e1c174c47db41c))

### [0.3.9](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.8...v0.3.9) (2021-09-24)


### Bug Fixes

* add missing env variables to Dockerfile ([69116c9](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/69116c9cbb54945bcc1eb02fd5d78b86f97af9a1))

### [0.3.8](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.7...v0.3.8) (2021-09-24)


### Bug Fixes

* matomo config to work with digiaiiris ([8c0f508](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/8c0f50824556e5688db033a30d0093014de2ab18))

### [0.3.7](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.6...v0.3.7) (2021-09-23)


### Bug Fixes

* ignore js errors in testcafe to make it work ([df0d3bc](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/df0d3bc3ccab4858bb31fdc730cae91f1b511bf6))
* matomo url base and site id ([823f8ae](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/823f8aedca36c810595dddee3c4bdecbbcafb4e2))

### [0.3.6](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.5...v0.3.6) (2021-09-23)


### Bug Fixes

* occurrences table enrolment button styling ([1f402ce](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/1f402ce9416dc2d645512cdeeae8ef975635fdd5))

### [0.3.5](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.4...v0.3.5) (2021-09-21)


### Features

* **cms:** add breadcrumbs and improve sub page search layout ([3f0762c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/3f0762c68dbb482d7f8fe5d3b5389db19bdd5b2b))
* **cms:** cms navigation and SEO optimization ([ade5f27](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ade5f2742b7b5feb6cc92e89fbdfa8fc2325611d))
* **enrolment-type:** the enrolment type effects on views ([09e3f61](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/09e3f61f7a73cbb948697d8e4bc884c3953d3b94))
* **search:** search by a division. ([dc08deb](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/dc08deba291cc2b7c2df61e5ea6b558e44d1876c))
* support new enrolment types in occurrences table ([609c112](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/609c112fd129feafb99e376193f4d764c2f95f38))
* use allOngoingAnd parameter to get better search results ([6402b78](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/6402b78e761589bdc636da6c30f11f121a6d1f1a))


### Bug Fixes

* add key to breadcrumb list item ([0859588](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/0859588b34de8dee53ce2a6c41bc4c34af4fbf00))
* dont show upcoming occurrences in event card when there is none ([5b3f8ec](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/5b3f8ec6794e915635b5a0f16415fcd9a401ab22))
* missing placeIds field in mock data utils ([0a74056](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/0a740564f028358c0d6926354ae278381e52fe82))
* multiple occurrences bug ([e3c9692](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/e3c9692d6ba4479155cb247599dee2f1f7639feb))
* small fix to showEnrolmentButton boolean so 0 is not rendered to view ([a5c71e7](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/a5c71e7df55e4da278b95db5fea0335610356654))

### [0.3.4](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.3...v0.3.4) (2021-09-07)


### Bug Fixes

* language change when headless cms is not enabled ([46239e0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/46239e0c4239ac39ec4b0b37918a831abfefdce8))

### [0.3.3](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.2...v0.3.3) (2021-09-07)


### Features

* **cms:** added a feature flag for headless cms implementation. ([8a465dd](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/8a465dd6707975f74db821c27eb13cd7bed1165a))
* **cms:** integrated the headless cms to render a language specific page menu ([6a2fd0c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/6a2fd0c93d6ec2ee36f80cd5e94614a5c5f5d34f))
* make localization work with language selector in cms page ([82ee234](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/82ee2340aaf028f19579506917200f94c29420d0))


### Bug Fixes

* cms navigation to work with new graphql queries ([6f14a25](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/6f14a2539326f3161c4eeb50a21511a3f18c9093))
* occurrencesdate filtering in single event page ([9123a12](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/9123a12cf776bc8fba3fea07e5908190b58a03e8))
* use event.offer instead of occurrence.linkedEvent to improve api perf ([37df638](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/37df63867b73855fc38a001b9ddc7452ea614ddf))

### [0.3.2](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.1...v0.3.2) (2021-08-18)

### 0.3.1 (2021-07-16)
