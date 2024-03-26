# Changelog

All notable changes to this project will be documented in this file. See [Conventional Commits](https://www.conventionalcommits.org/) for commit guidelines.

## [2.4.1](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/palvelutarjotin-ui-v2.4.0...palvelutarjotin-ui-v2.4.1) (2023-12-27)


### Bug Fixes

* Header logo should use a pointer as a cursor ([8dae542](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/8dae5427d5b1401db87f1cda8299730cc9774401))

## [2.4.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/palvelutarjotin-ui-v2.3.2...palvelutarjotin-ui-v2.4.0) (2023-11-09)


### Features

* Add specific toast error message for event full when enrolling ([05cfa19](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/05cfa19e1021002ab6f9a1feb1b72b10cd7d8b1f))
* Update extra needs field's helper text ([7d90aa7](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/7d90aa7020cc9458a8c66f7fd910875c8bd88257))


### Bug Fixes

* **toast:** Automatically close toast error messages after 10s ([a7567e3](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/a7567e380d79d9a82eff286032eb2886682cd6e6))

## [2.3.2](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/palvelutarjotin-ui-v2.3.1...palvelutarjotin-ui-v2.3.2) (2023-09-07)

### Bug Fixes

- Version, release and build information PT-1652 ([#284](https://github.com/City-of-Helsinki/palvelutarjotin-ui/issues/284)) ([a568070](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/a5680709588151aef137b1ffe6631a868d4c17bf))

### Refactoring

- Moved the event enrolment queue component below the occurrences table.

### [2.3.1](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v2.3.0...v2.3.1) (2023-06-29)

### Updates

- the Node has been updated to v. 20.
- all the dependencies has been updated to the latest, so also all the existing code needed some migration.

### Bug Fixes

- cms page generation for pages with a search feature for subpages ([100adf3](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/100adf3c09dbdc1c39b0f1574dc1df3fedacb12f))
- **datepicker:** replace custom date picker with the HDS date input ([021cf94](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/021cf9415c751f80181674342b0e74523064d38e))
- enrolment form value set async calls must be awaited ([ecba27d](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ecba27dca21e3f1189fa1abec27e0ac57406ed9c))
- eslint configuration ([6ac7b25](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/6ac7b2530c568879ca9bc2e6493b22afb404645f))
- eslint configuration ([a113e66](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/a113e66010a397f02ab1612a74f9fc5ecefb29da))
- setFieldValue types and usage ([f776972](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/f7769723fb3440327cecc839aa598b6e68ede82a))
- **stylelint:** scss files configuration and format ([b5883ba](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/b5883ba94535123a4da4f34cf0f36cda63c83c74))
- trivial test mock bug ([59d28e8](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/59d28e869dd00fa814e044ebc1749813626dc6d2))
- yup validation schema ([92b99f6](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/92b99f600c224ad9c95699eeb52c4a7a88892abd))

### [2.3.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v2.2.0...v2.3.0) (2023-05-10)

- event queue enrolments ([#278](https://github.com/City-of-Helsinki/palvelutarjotin-ui/pull/278))

## [2.2.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v2.1.0...v2.2.0) (2023-03-27)

### Features

- cookie consent implementation ([#258](https://github.com/City-of-Helsinki/palvelutarjotin-ui/issues/258)) ([187dc42](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/187dc426af40fc50f733a4d51c45a106ea7ea514))
- **enrolment:** require phone number when enrolling ([f008e72](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/f008e729e1c8f65fb7ef185eafc8b19f039a925e))
- upgrade hds version to 2.8.0 ([#257](https://github.com/City-of-Helsinki/palvelutarjotin-ui/issues/257)) ([9ee5d9d](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/9ee5d9d83d953bd5c8ad373d45bd78bc2ab779d0))

### Bug Fixes

- cookie consent translations ([#260](https://github.com/City-of-Helsinki/palvelutarjotin-ui/issues/260)) ([342b39e](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/342b39ec67ef80de9f9a2e4a09c99305c5f180b4))
- essential cookies texts overrides ([#261](https://github.com/City-of-Helsinki/palvelutarjotin-ui/issues/261)) ([ff5830a](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ff5830a6a2718b0a89072bad2ed5eded6833cf7d))
- fix banner hero layout accessibility issue 4.1 ([30c14f0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/30c14f0d3b257e248a8704bad1599a698ae4d513))
- fix study level grade translations, e.g. "3rd class" ([f288cfb](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/f288cfb880edc579c3dcff8587f529e9e86c9e6c))
- fix swedish translations of study level grades to "Åk {{count}}" ([66887c1](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/66887c1aa087560151a33f6a1ac78baa2b971f51))
- update banner hero texts and raise search box a bit ([f7b34b5](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/f7b34b511ed23c525adca5f8407ae6f2187cbc8f))

## [2.1.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/release-v2.0.0...release-v2.1.0) (2022-12-15)

### Features

- update privacy policy links ([7d8c935](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/7d8c935f0086119c43e320b85bc6ebaa5c098b74))
- modify translations ([9f35113](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/9f35113d6fdc177eebb1ea25e7ec5d00d5d53873))

## [2.0.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v1.6.0...v2.0.0) (2022-11-08)

### ⚠ BREAKING CHANGES

- **hcrc:** installed latest version and handled the links with middleware

### Features

- add terms of service to footer ([70372b6](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/70372b653a77c849056923317ebd46c8f390257b))
- dynamic footer links from cms ([d4fec64](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/d4fec649afa8f63a2394a96cbe516281d38f47fb))
- **hcrc:** add CMS translations to HCRC config ([c43c883](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/c43c88354c0db1939dcadf4b729392f6332d83b4))
- **hcrc:** implemented a first cms collection ([41a43ba](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/41a43ba1a2ef3c1dd60e933054e452f7d90d619b))
- **hcrc:** implemented getIsHrefExternal to cms config ([ea5c39f](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ea5c39f25bfa8112be6dcdd1fda4250896e30dc8))
- **hcrc:** init PoC use of RHHC ([0746c19](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/0746c197f72e0e882c0a5ffec62fc26ca1aee7bf))
- **hcrc:** integrated articles to SSR ([da37ceb](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/da37cebfc03c0a02718682048daf8ac684641ffe))
- **hcrc:** use archive page search for page's sub pages searching ([9cb5a8a](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/9cb5a8a752bdb2bc4b8f86bd558f91e52f305682))

### Bug Fixes

- footer terms of service link i18n support ([eed3103](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/eed31039cd006eb10feb5b6ae2b28831da83662e))
- **hcrc:** added internal href origins ([69e0682](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/69e06823ba288e4946373527c3f1c4ed1105634f))
- **hcrc:** getCmsArticlePath ([3779dc9](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/3779dc9c8ecaed0f1ebc3d164af442319a53aec1))
- **hcrc:** installed latest version and handled the links with middleware ([686a50f](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/686a50f8d56499ee9e575bd488fd7ecfcc7841f3))
- **hcrc:** rename the layoutPageframent and layoutArticleFragment fields ([b25d6cd](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/b25d6cdca59caf0285cff1cf4ad732976e5771d3))
- **hcrc:** set cms articles static paths fall back to true ([89bcd55](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/89bcd558029a05267ebe0e537dbc23d065e66a1c))
- trivial translation fix ([0a98c78](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/0a98c7882d1eb46cdbe546c445dcd46a50ece4e6))

## [1.6.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v1.5.0...v1.6.0) (2022-10-12)

### Features

- **search:** use text-param instead of allOngoingAnd ([6c8fcfe](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/6c8fcfe26e9f5599b57ee610b9933343240543ae))

## [1.5.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v1.3.1...v1.5.0) (2022-09-16)

### Features

- **navigation:** add support for dropdown in header and delete sub menus ([bf9ef52](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/bf9ef529cf5019f95ccafb5466c6cdc4765e6aaf))
- **search:** added a bookable place filter ([684dd00](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/684dd00971803948efb503fcfc0a62da2e5ae75d))
- **search:** added a isFree -filter to the events search ([8b72747](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/8b727474a201c0278f90f8e473c1a26ff364af8f))
- **search:** save EventSearchPage sort state to localStorage ([4acadbb](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/4acadbb050e36d1afa09b30d30ff0d06b53a1cd4))
- **sidebar:** Add sidebar layout ([ae09705](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ae09705c715781f0c33b7f7ec6df9d4783f3600f))
- **sidebar:** add support for layout link list ([04973dc](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/04973dc0921211f8b79b3ab9869059bd233c7ebe))
- **sidebar:** allow highlighting of pages and articles ([a0ea4ee](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/a0ea4eeb0fdf38faf26feb96f37150194dace9f8))
- **sidebar:** deprecate sidebarlayout component ([14530c1](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/14530c102b74419b9ccf55d573728dad2a14726d))
- **sidebar:** use sidebar layout for all content ([fecc8a3](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/fecc8a37bd1f82a7fb79ce23356b05917277977f))

### Bug Fixes

- a typo in the placeholder text "Etsi helsinkiläistä toimipistettä" ([d0cf4d1](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/d0cf4d113406bb65c99fc1a324d6d35ff2be4677))
- add img and figure styles to fix cms page with bit image ([4994175](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/4994175c9d90d05f2645c83aefe158635e9cfd78))
- add missing domain ([ba86e71](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ba86e71a486fc866be3f921fcb62794cf8720f2c))
- delete duplicated page tracking and move matomo tests ([3840d95](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/3840d956048ad6e16d0d949a0ccfdaa31526b7a0))
- delete unused import ([28e34f3](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/28e34f3b7fa3d6179dcf63a8b5e29da73c30d78b))
- enrolments with 0 participants are not allowed ([9a53f42](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/9a53f4285c041d642bf95c1ef3d26abf2f92e70d))
- handle situation when cms page is not found ([bcf7f26](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/bcf7f265c48b860c7a467f8f576b453b7694b3ae))
- move matomo tracking component \_app.tsx so it included on all pages ([1ad0c60](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/1ad0c60bd9173e7d50649a3bcddc03d69357f4c9))
- prevent fetching the places without place id ([5bbf07c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/5bbf07c737fedc4b0f29846a02c7a1ec147b5158))
- **search:** the keyboard navigation issue in place multiselect ([0587bc8](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/0587bc8e5728bbf79ecba5b3da36810487d338d0))
- update organisation events link to target correct page ([fa89087](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/fa89087f53265bea2dfe86f63681845a100dc8db))

## [1.4.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v1.3.1...v1.4.0) (2022-04-21)

### Features

- **navigation:** add support for dropdown in header and delete sub menus ([bf9ef52](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/bf9ef529cf5019f95ccafb5466c6cdc4765e6aaf))
- **search:** added a bookable place filter ([684dd00](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/684dd00971803948efb503fcfc0a62da2e5ae75d))
- **search:** added a isFree -filter to the events search ([8b72747](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/8b727474a201c0278f90f8e473c1a26ff364af8f))
- **search:** save EventSearchPage sort state to localStorage ([4acadbb](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/4acadbb050e36d1afa09b30d30ff0d06b53a1cd4))
- **sidebar:** Add sidebar layout ([ae09705](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ae09705c715781f0c33b7f7ec6df9d4783f3600f))
- **sidebar:** add support for layout link list ([04973dc](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/04973dc0921211f8b79b3ab9869059bd233c7ebe))
- **sidebar:** allow highlighting of pages and articles ([a0ea4ee](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/a0ea4eeb0fdf38faf26feb96f37150194dace9f8))
- **sidebar:** deprecate sidebarlayout component ([14530c1](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/14530c102b74419b9ccf55d573728dad2a14726d))
- **sidebar:** use sidebar layout for all content ([fecc8a3](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/fecc8a37bd1f82a7fb79ce23356b05917277977f))

### Bug Fixes

- a typo in the placeholder text "Etsi helsinkiläistä toimipistettä" ([d0cf4d1](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/d0cf4d113406bb65c99fc1a324d6d35ff2be4677))
- add img and figure styles to fix cms page with bit image ([4994175](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/4994175c9d90d05f2645c83aefe158635e9cfd78))
- add missing domain ([ba86e71](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ba86e71a486fc866be3f921fcb62794cf8720f2c))
- delete duplicated page tracking and move matomo tests ([3840d95](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/3840d956048ad6e16d0d949a0ccfdaa31526b7a0))
- delete unused import ([28e34f3](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/28e34f3b7fa3d6179dcf63a8b5e29da73c30d78b))
- handle situation when cms page is not found ([bcf7f26](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/bcf7f265c48b860c7a467f8f576b453b7694b3ae))
- move matomo tracking component \_app.tsx so it included on all pages ([1ad0c60](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/1ad0c60bd9173e7d50649a3bcddc03d69357f4c9))
- prevent fetching the places without place id ([5bbf07c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/5bbf07c737fedc4b0f29846a02c7a1ec147b5158))
- **search:** the keyboard navigation issue in place multiselect ([0587bc8](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/0587bc8e5728bbf79ecba5b3da36810487d338d0))
- update organisation events link to target correct page ([fa89087](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/fa89087f53265bea2dfe86f63681845a100dc8db))

### [1.3.1](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v1.3.0...v1.3.1) (2022-01-20)

### Bug Fixes

- **enrolment:** don't show enrolment has ended if enrolmentEndDays is not defined ([f51b45e](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/f51b45e60e593c1cd7036d1b4055b5b7984401e9))

## [1.3.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v1.2.0...v1.3.0) (2022-01-12)

### Features

- **newsletter:** show privacy statement in the newsletter form ([37ff1cf](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/37ff1cf74aef49cdb4d230f0308eb9f25e5bc2b0))

### Bug Fixes

- make learning materials to link corretly in english and swedish ([b917541](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/b917541ffcad287569c5379fbbae87d0d50226d7))
- **newsletter:** added env next to arg defines in dockerfile ([535c401](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/535c401f8b6711b459b7415498a40c881bdeb8a3))
- **newsletter:** added error message to generic newsletter api error ([ba10dde](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ba10dde08b7509e2902772005ef6350df67669d9))
- **newsletter:** language specific link to newsletter ([73c453d](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/73c453dce300596c38aad9bc30b02ed0be8c2874))
- **newsletter:** moved api docker env variables under prod settings ([d902073](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/d902073c7cf469482d19c446e3867eae04a11146))

## [1.2.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v1.1.0...v1.2.0) (2021-12-17)

### Features

- add support for localization in notification ([7dfea80](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/7dfea800a7081025f41b02302e1b38813b67ff8c))
- **newsletter:** added feature flag for newsletter ([2aabbec](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/2aabbec2fa7d30c0e6ba573aad515d4be2ccd386))
- **newsletter:** api implementation for subscribing ([c53f854](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/c53f8549cc4e31324d3e432fac48cf54b0bdd9e2))
- **newsletter:** client uses internal api to hide api key ([83d4ccb](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/83d4ccbcf14c03630f812b325e2aabf2595bac2a))
- **newsletter:** gruppo-client ([13a0bfa](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/13a0bfa0cc50422c283957021d051ba6887824b2))
- **newsletter:** link added to the footer ([693df77](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/693df7718f69e9305af9a1ccccee8d813f0819d4))
- **newsletter:** subscription page ([d778fe1](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/d778fe1f615f9ba02a12b3c1a498f8538263013a))

### Bug Fixes

- add event language to the include list in evets and events search pages ([11f04a6](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/11f04a62c7cebb8600031afae7d962c384ca4554))
- **newsletter:** using HDS notifications ([2aec8d0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/2aec8d052b3e2cab1cff8cd58054d4f1fcf1e90d))
- resolve validate dom nesting issue by changing link to button ([1a224f6](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/1a224f67990d5a87c2e9bb62df8aad1495eaca83))
- update next to fix typing issues in \_document.tsx ([95b3872](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/95b38721770651f3b3d4c4865a5bcf5a06316e61))

## [1.1.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v1.0.0...v1.1.0) (2021-12-10)

### Features

- add notification on top of occurrences table if enrolment hasnt started ([f88147c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/f88147c8987ccb9d89b3efa5d8ba263f4922ea4c))
- add support for email link in enrolment ([24694df](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/24694dfd3ee7353753eedfcd7f0c484e0a4f663d))

### Bug Fixes

- isEnrolmentStarted now takes null in account ([67d4f14](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/67d4f14e13560932f47f53cb159a82e648c98d77))

## [1.0.0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.11...v1.0.0) (2021-12-08)

### Features

- add language column to occurrences table in event page ([ec6c5cd](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ec6c5cd3e67f1fff03483f31f31f3f7f242854a0))
- add popular keywords section to front page ([37c4216](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/37c421603be9d09577be2cbe622e541b2d7044bf))
- event back button navigates to correct page ([10f5d7d](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/10f5d7db777e8ab85d9ca446b0fa79320f821196))
- filter tags + clear filter button ([201538e](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/201538e6ef6000239d1c4c3a2ab6bce3f00aa7a3))
- new event page enrolment forms ([8983ebb](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/8983ebbb9656a96bae7fc7feffea96a1a84500b5))
- save recommended events variables from enrolment form ([755a471](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/755a4714becb0a1f85019d36f316c684cbdfc4ec))
- show date span in occurrence table for multi day occurrences ([428d794](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/428d7948e558bdef9ad8344fc6bd55fcc5624aa5))
- support for cms notification ([2247325](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/2247325ff63251261b0e62b65a11a6cab4f295cd))
- unit place selector uses schoolsAndKindergartens query ([ecb489c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ecb489ce7d200d4510b36b63b60f6dda61e53d3d))
- use local storage to remember if user close notification ([83dc7c2](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/83dc7c26f76b6143581d0c862f4ffd8a3861e9d0))
- use new upcoming events query in front page ([2171057](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/2171057b4776726e7f5f0e56b47f9d70b32a2cf0))

### Bug Fixes

- add better abel for show mroe details button in occurrence table ([17593b7](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/17593b74c33061574ab141bf5b484a4b5893f104))
- add missing sv translations ([0926980](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/092698038f534bbdb4c7c48b6e1512019bb7ff41))
- add translation to select occurrence checkbox ([a4a54b4](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/a4a54b46128b876fdd10a5cc76ed930b2ba6e89c))
- change language order in occurrence table to be fi, sv first ([ae2ba2e](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ae2ba2ec68fe57ef28cce8a1ef10aed34559dbb8))
- cms card image aspect ratio ([17e4232](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/17e4232c10e53b3981b20839608efc5d7e3597bc))
- cms card layout ([3ce5064](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/3ce50642e6d7ed660fe8199b7af30928c87b534c))
- delete duplicate properties from mock data ([d542b86](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/d542b869f5489d503e25b3c61d64d0df7a5e5524))
- delete redundant enrolOccurrenceMock from UnitField tests ([18efe57](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/18efe574a19f80dc501619ec72778faa45459916))
- delete unused create enrolment page ([108b4b5](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/108b4b51eea41cd0e5fad78b2bb5617619e70afe))
- enrolment form group size validation bug that was caused by formik persist ([0830cca](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/0830ccaa43f44c75b2816155b1c3173635b8bb5c))
- event card should show upcoming occurrences only, no matter the enrolment time ([bc57ca8](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/bc57ca82f034bb51479222183513da94db2a321b))
- external enrolment link fixed for occurrences ([745d6d2](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/745d6d26422eee057a3f8d2903e836984c3153d4))
- fixes based on comments ([e8afef8](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/e8afef8c4370f261563a19dd1fb0d7023af46911))
- languages in occurrences table so that screen reader reads whole language ([09b280a](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/09b280afe4d0c39e9ab4dab7e9513a8ca1a992eb))
- small fixes for linting warnings ([4d52e2c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/4d52e2cfbe4bf65a887e4937e6dce33e151f973d))
- unit id fields entries are filtered in lowercase format ([09adf5d](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/09adf5d6789c4c24f84b7b8de3176daec2f4a286))
- upcoming events query ([508909c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/508909c4db811aa07da68c57c69b3d223a8cd721))
- update event list title and delete pagination logic ([81f88cf](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/81f88cf75eb2362967211669907e621c41189cd3))
- update snapshot ([4ccd4aa](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/4ccd4aaf63dff7eb4dad74d55e233a7291d07d94))
- update unit field tests for new EventPage ([52d65b3](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/52d65b3f2ee33668d22cf13863ed4e381481b9f3))

### [0.3.11](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.10...v0.3.11) (2021-11-12)

### Features

- implement keywords as links to search ([f05186b](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/f05186bd71182fdb747c1f01d11927697223d856))
- implemented UnitPlaceSelectorField ([1fc5169](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/1fc5169bbf66566a41865884c555ee922aff4357))
- initialize enrolment form from local storage if possible ([d3623df](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/d3623dfe89ff3089c28f36a8bce1437de8d244ae))
- integrate unified search and use division from there ([224d2a1](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/224d2a1dc288c5c410d684df40b5529bbcb703bc))
- new event page layout ([525cc2f](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/525cc2f448ca2e45f15da2affbb489f1384ba37e))
- new search form panel and event search page ([9736c8b](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/9736c8b4314aa78c280f9c33f8c3ba999966f123))
- show timespan in days in event card when occurrence spans multiple days ([4a2e578](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/4a2e578ce2e54dbf5d1d9c42f23cdc18326f278e))
- updated the study group and servicemap api schemas ([15e6eaf](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/15e6eaf2a5e97240e3e7e4aca919ce22677bd693))

### Bug Fixes

- act errors in CreateEnrolmentPage ([d7cd3fb](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/d7cd3fb79c578ac6d84a6509d3e52f78d92c9d7e))
- add check for undefined connectedNode in cms page ([5fb4eaa](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/5fb4eaa5ab73b25f2a808234241d48c6a36181a4))
- add missing swedish translations ([ac76169](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ac76169672fda943bb873a24ee0ba3cc0cc7567b))
- add sv translation to labelKeywordLink ([4e73213](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/4e732130ddae5abf8e5d38166699870c8def8e12))
- better translation for unit field checkbox ([2b0ea46](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/2b0ea464cc360a68eaf0d3e3929aae8371213cb8))
- couple more swedish translations ([3506d88](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/3506d88547d2eefc417cdb663db9097821367c23))
- delete comma from review.yml ([5491471](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/54914713473d17e7d18216c9352bdd766a9fa281))
- delete neighborhood related mock utils ([93c0a5d](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/93c0a5d8accbd9a5b0e2ff80706af7c5ee15b571))
- delete some unused imports ([c1bcc5c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/c1bcc5c6ae155327b7de4e334be81b79e9afa8a8))
- dont try to fetch language options from cms when not on cms page ([3a639c9](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/3a639c9e2d04de817107d389b54c137641bb7614))
- english translation for keyword link label ([9503a1d](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/9503a1d4a6592204d25d7620d8b9d9a564a10707))
- eventsSearchPage test mock ([105fecb](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/105fecb4029e5a89066f4703a016ae513b844ffe))
- external enrolment link that was not rendered ([5129f21](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/5129f212bc3a191eb1d5f72dbe3a4a854b4ff41b))
- how some info for multi day occurrences are shown ([54e8ac9](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/54e8ac9474822f4694519c94386dba0b58ff2818))
- linter errors and warnings ([4af8067](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/4af8067155ff7c089546d8f9a8342726640b19d9))
- lodash/debounce mock comment ([bff8482](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/bff84823f2b40e5a1ed06e015c814eea83dba083))
- prevent focus reset when using search in EventsSearchPage ([74413d4](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/74413d43577c2009d6dab45a0b33b09863f451af))
- removed console logs and fixed nullable validation in enrolment ([54888aa](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/54888aac0f01220394712c1c840a41a56fb8ca96))
- skip cms page test because next-page-tester doesn't support next@12 ([508ea02](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/508ea024d7e55e025253fc9b0d9a0753e86faab3))
- swedish translations ([221c690](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/221c6907af9bfc2adafe9d6e9c504450edd33edd))
- tyhjennä lomake swedish translation ([afe6c20](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/afe6c201aa4a7d6c69aa3d2b3dd6de229f0daa85))
- update keyword links to work with new events search page ([906af5f](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/906af5fcc3d7d94cba25949442f700eac7791894))
- update start/server files to mjs also in Dockerfile ([be731ab](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/be731ab77f3e2aff4f5c39fb066a889849f7c11d))
- use d.M.yyyy format that comply with hds guidelines ([9d3257f](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/9d3257f8661b4b26dec6bd1fdcdb5d6f2a08cce9))

### [0.3.10](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.9...v0.3.10) (2021-09-29)

### Bug Fixes

- remove lookbehind regex operator to fix safari bug ([d2b21ff](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/d2b21ff01dde8638548a4a0b75e1c174c47db41c))

### [0.3.9](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.8...v0.3.9) (2021-09-24)

### Bug Fixes

- add missing env variables to Dockerfile ([69116c9](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/69116c9cbb54945bcc1eb02fd5d78b86f97af9a1))

### [0.3.8](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.7...v0.3.8) (2021-09-24)

### Bug Fixes

- matomo config to work with digiaiiris ([8c0f508](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/8c0f50824556e5688db033a30d0093014de2ab18))

### [0.3.7](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.6...v0.3.7) (2021-09-23)

### Bug Fixes

- ignore js errors in testcafe to make it work ([df0d3bc](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/df0d3bc3ccab4858bb31fdc730cae91f1b511bf6))
- matomo url base and site id ([823f8ae](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/823f8aedca36c810595dddee3c4bdecbbcafb4e2))

### [0.3.6](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.5...v0.3.6) (2021-09-23)

### Bug Fixes

- occurrences table enrolment button styling ([1f402ce](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/1f402ce9416dc2d645512cdeeae8ef975635fdd5))

### [0.3.5](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.4...v0.3.5) (2021-09-21)

### Features

- **cms:** add breadcrumbs and improve sub page search layout ([3f0762c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/3f0762c68dbb482d7f8fe5d3b5389db19bdd5b2b))
- **cms:** cms navigation and SEO optimization ([ade5f27](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/ade5f2742b7b5feb6cc92e89fbdfa8fc2325611d))
- **enrolment-type:** the enrolment type effects on views ([09e3f61](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/09e3f61f7a73cbb948697d8e4bc884c3953d3b94))
- **search:** search by a division. ([dc08deb](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/dc08deba291cc2b7c2df61e5ea6b558e44d1876c))
- support new enrolment types in occurrences table ([609c112](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/609c112fd129feafb99e376193f4d764c2f95f38))
- use allOngoingAnd parameter to get better search results ([6402b78](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/6402b78e761589bdc636da6c30f11f121a6d1f1a))

### Bug Fixes

- add key to breadcrumb list item ([0859588](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/0859588b34de8dee53ce2a6c41bc4c34af4fbf00))
- dont show upcoming occurrences in event card when there is none ([5b3f8ec](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/5b3f8ec6794e915635b5a0f16415fcd9a401ab22))
- missing placeIds field in mock data utils ([0a74056](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/0a740564f028358c0d6926354ae278381e52fe82))
- multiple occurrences bug ([e3c9692](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/e3c9692d6ba4479155cb247599dee2f1f7639feb))
- small fix to showEnrolmentButton boolean so 0 is not rendered to view ([a5c71e7](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/a5c71e7df55e4da278b95db5fea0335610356654))

### [0.3.4](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.3...v0.3.4) (2021-09-07)

### Bug Fixes

- language change when headless cms is not enabled ([46239e0](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/46239e0c4239ac39ec4b0b37918a831abfefdce8))

### [0.3.3](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.2...v0.3.3) (2021-09-07)

### Features

- **cms:** added a feature flag for headless cms implementation. ([8a465dd](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/8a465dd6707975f74db821c27eb13cd7bed1165a))
- **cms:** integrated the headless cms to render a language specific page menu ([6a2fd0c](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/6a2fd0c93d6ec2ee36f80cd5e94614a5c5f5d34f))
- make localization work with language selector in cms page ([82ee234](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/82ee2340aaf028f19579506917200f94c29420d0))

### Bug Fixes

- cms navigation to work with new graphql queries ([6f14a25](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/6f14a2539326f3161c4eeb50a21511a3f18c9093))
- occurrencesdate filtering in single event page ([9123a12](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/9123a12cf776bc8fba3fea07e5908190b58a03e8))
- use event.offer instead of occurrence.linkedEvent to improve api perf ([37df638](https://github.com/City-of-Helsinki/palvelutarjotin-ui/commit/37df63867b73855fc38a001b9ddc7452ea614ddf))

### [0.3.2](https://github.com/City-of-Helsinki/palvelutarjotin-ui/compare/v0.3.1...v0.3.2) (2021-08-18)

### 0.3.1 (2021-07-16)
