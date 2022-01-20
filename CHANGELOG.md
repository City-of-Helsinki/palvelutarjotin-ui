# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.3.1](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v1.3.0...v1.3.1) (2022-01-20)


### Bug Fixes

* **enrolment:** don't show enrolment has ended if enrolmentEndDays is not defined ([f51b45e](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/f51b45e60e593c1cd7036d1b4055b5b7984401e9))

## [1.3.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v1.2.0...v1.3.0) (2022-01-12)


### Features

* **newsletter:** show privacy statement in the newsletter form ([37ff1cf](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/37ff1cf74aef49cdb4d230f0308eb9f25e5bc2b0))


### Bug Fixes

* make learning materials to link corretly in english and swedish ([b917541](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/b917541ffcad287569c5379fbbae87d0d50226d7))
* **newsletter:** added env next to arg defines in dockerfile ([535c401](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/535c401f8b6711b459b7415498a40c881bdeb8a3))
* **newsletter:** added error message to generic newsletter api error ([ba10dde](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ba10dde08b7509e2902772005ef6350df67669d9))
* **newsletter:** language specific link to newsletter ([73c453d](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/73c453dce300596c38aad9bc30b02ed0be8c2874))
* **newsletter:** moved api docker env variables under prod settings ([d902073](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/d902073c7cf469482d19c446e3867eae04a11146))

## [1.2.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v1.1.0...v1.2.0) (2021-12-17)


### Features

* add support for localization in notification ([7dfea80](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/7dfea800a7081025f41b02302e1b38813b67ff8c))
* **newsletter:** added feature flag for newsletter ([2aabbec](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/2aabbec2fa7d30c0e6ba573aad515d4be2ccd386))
* **newsletter:** api implementation for subscribing ([c53f854](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/c53f8549cc4e31324d3e432fac48cf54b0bdd9e2))
* **newsletter:** client uses internal api to hide api key ([83d4ccb](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/83d4ccbcf14c03630f812b325e2aabf2595bac2a))
* **newsletter:** gruppo-client ([13a0bfa](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/13a0bfa0cc50422c283957021d051ba6887824b2))
* **newsletter:** link added to the footer ([693df77](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/693df7718f69e9305af9a1ccccee8d813f0819d4))
* **newsletter:** subscription page ([d778fe1](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/d778fe1f615f9ba02a12b3c1a498f8538263013a))


### Bug Fixes

* add event language to the include list in evets and events search pages ([11f04a6](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/11f04a62c7cebb8600031afae7d962c384ca4554))
* **newsletter:** using HDS notifications ([2aec8d0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/2aec8d052b3e2cab1cff8cd58054d4f1fcf1e90d))
* resolve validate dom nesting issue by changing link to button ([1a224f6](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/1a224f67990d5a87c2e9bb62df8aad1495eaca83))
* update next to fix typing issues in _document.tsx ([95b3872](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/95b38721770651f3b3d4c4865a5bcf5a06316e61))

## [1.1.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v1.0.0...v1.1.0) (2021-12-10)


### Features

* add notification on top of occurrences table if enrolment hasnt started ([f88147c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/f88147c8987ccb9d89b3efa5d8ba263f4922ea4c))
* add support for email link in enrolment ([24694df](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/24694dfd3ee7353753eedfcd7f0c484e0a4f663d))


### Bug Fixes

* isEnrolmentStarted now takes null in account ([67d4f14](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/67d4f14e13560932f47f53cb159a82e648c98d77))

## [1.0.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.11...v1.0.0) (2021-12-08)


### Features

* add language column to occurrences table in event page ([ec6c5cd](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ec6c5cd3e67f1fff03483f31f31f3f7f242854a0))
* add popular keywords section to front page ([37c4216](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/37c421603be9d09577be2cbe622e541b2d7044bf))
* event back button navigates to correct page ([10f5d7d](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/10f5d7db777e8ab85d9ca446b0fa79320f821196))
* filter tags + clear filter button ([201538e](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/201538e6ef6000239d1c4c3a2ab6bce3f00aa7a3))
* new event page enrolment forms ([8983ebb](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/8983ebbb9656a96bae7fc7feffea96a1a84500b5))
* save recommended events variables from enrolment form ([755a471](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/755a4714becb0a1f85019d36f316c684cbdfc4ec))
* show date span in occurrence table for multi day occurrences ([428d794](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/428d7948e558bdef9ad8344fc6bd55fcc5624aa5))
* support for cms notification ([2247325](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/2247325ff63251261b0e62b65a11a6cab4f295cd))
* unit place selector uses schoolsAndKindergartens query ([ecb489c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ecb489ce7d200d4510b36b63b60f6dda61e53d3d))
* use local storage to remember if user close notification ([83dc7c2](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/83dc7c26f76b6143581d0c862f4ffd8a3861e9d0))
* use new upcoming events query in front page ([2171057](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/2171057b4776726e7f5f0e56b47f9d70b32a2cf0))


### Bug Fixes

* add better abel for show mroe details button in occurrence table ([17593b7](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/17593b74c33061574ab141bf5b484a4b5893f104))
* add missing sv translations ([0926980](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/092698038f534bbdb4c7c48b6e1512019bb7ff41))
* add translation to select occurrence checkbox ([a4a54b4](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/a4a54b46128b876fdd10a5cc76ed930b2ba6e89c))
* change language order in occurrence table to be fi, sv first ([ae2ba2e](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ae2ba2ec68fe57ef28cce8a1ef10aed34559dbb8))
* cms card image aspect ratio ([17e4232](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/17e4232c10e53b3981b20839608efc5d7e3597bc))
* cms card layout ([3ce5064](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/3ce50642e6d7ed660fe8199b7af30928c87b534c))
* delete duplicate properties from mock data ([d542b86](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/d542b869f5489d503e25b3c61d64d0df7a5e5524))
* delete redundant enrolOccurrenceMock from UnitField tests ([18efe57](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/18efe574a19f80dc501619ec72778faa45459916))
* delete unused create enrolment page ([108b4b5](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/108b4b51eea41cd0e5fad78b2bb5617619e70afe))
* enrolment form group size validation bug that was caused by formik persist ([0830cca](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/0830ccaa43f44c75b2816155b1c3173635b8bb5c))
* event card should show upcoming occurrences only, no matter the enrolment time ([bc57ca8](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/bc57ca82f034bb51479222183513da94db2a321b))
* external enrolment link fixed for occurrences ([745d6d2](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/745d6d26422eee057a3f8d2903e836984c3153d4))
* fixes based on comments ([e8afef8](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/e8afef8c4370f261563a19dd1fb0d7023af46911))
* languages in occurrences table so that screen reader reads whole language ([09b280a](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/09b280afe4d0c39e9ab4dab7e9513a8ca1a992eb))
* small fixes for linting warnings ([4d52e2c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/4d52e2cfbe4bf65a887e4937e6dce33e151f973d))
* unit id fields entries are filtered in lowercase format ([09adf5d](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/09adf5d6789c4c24f84b7b8de3176daec2f4a286))
* upcoming events query ([508909c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/508909c4db811aa07da68c57c69b3d223a8cd721))
* update event list title and delete pagination logic ([81f88cf](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/81f88cf75eb2362967211669907e621c41189cd3))
* update snapshot ([4ccd4aa](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/4ccd4aaf63dff7eb4dad74d55e233a7291d07d94))
* update unit field tests for new EventPage ([52d65b3](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/52d65b3f2ee33668d22cf13863ed4e381481b9f3))

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
