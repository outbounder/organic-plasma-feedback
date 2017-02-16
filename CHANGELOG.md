# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0] - 2017-02-16
### Fixed
- augmenting plasma which already has been augmented with feedback support

### Changed and fixed
- removed from organic plasma feedback support for Promises, this resolves an issue of creating Promise instance when feedback is not needed

### Added
- eslint with standard rules
- support to receive multiple invocations of emit's callback via providing `$feedback_timestamp` in the chemical for emit


## [1.0.0] - 2016-02-18
### Fixed
- feedback support honoring [aggregation return flag](https://github.com/outbounder/organic-plasma/blob/5d14cf0d8eea32f8ecf8016637b01fdcee7dd101/README.md#chemical-aggregation)
- feedback support using mixed callback / promises reactions

### Changed
- better `README`

### Added
- examples
- more tests
- changelog


## [0.0.4] - 2016-02-17
### Fixed
- fix result chemical structure to use `$feedback_timestamp` separated than `chemical.type + "result"`


## [0.0.3] - 2016-01-18
### Fixed
- fix double emit edge case
